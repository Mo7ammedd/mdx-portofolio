import { ASK_URL, topicLabel, type Question } from './types'
import { normalizeEmail } from './validation'

type NotificationQuestion = Pick<Question, 'id' | 'question' | 'topic'>
type NotificationResult = 'sent' | 'disabled' | 'failed'

function notificationConfig() {
  // Local development and previews must not send notifications accidentally.
  if (
    process.env.ASK_EMAIL_NOTIFICATIONS !== 'true' ||
    (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production')
  ) {
    return null
  }
  const key = process.env.RESEND_API_KEY?.trim()
  const to = normalizeEmail(process.env.ASK_ADMIN_EMAIL)
  const from = normalizeEmail(
    process.env.ASK_EMAIL_FROM || 'onboarding@resend.dev',
  )
  return key && to && from ? { key, to, from } : null
}

export function emailNotificationsEnabled() {
  return Boolean(notificationConfig())
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[character]
  })
}

export async function notifyNewQuestion(
  question: NotificationQuestion,
): Promise<NotificationResult> {
  const config = notificationConfig()
  if (!config) return 'disabled'

  const inbox = `${ASK_URL}/inbox?question=${encodeURIComponent(question.id)}`
  const topic = topicLabel(question.topic)
  const body = JSON.stringify({
    from: `Modev Q&A <${config.from}>`,
    to: [config.to],
    subject: 'New question on ask.modev.me',
    text: [
      'Someone left you a question.',
      '',
      question.question,
      '',
      `Topic: ${topic}`,
      '',
      `Read and reply: ${inbox}`,
      '',
      'This question stays private until you publish an answer.',
    ].join('\n'),
    html: `<!doctype html>
<html lang="en"><body style="margin:0;background:#f6f6f4;color:#18181b;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" style="width:100%;border-collapse:collapse"><tr><td style="padding:40px 20px">
<table role="presentation" style="width:100%;max-width:560px;margin:0 auto;border-collapse:collapse"><tr><td>
<p style="margin:0 0 28px;font-size:11px;letter-spacing:2px;color:#71717a">ASK.MODEV.ME</p>
<h1 style="margin:0 0 24px;font-size:25px;line-height:1.4;font-weight:500">Someone left you a question.</h1>
<blockquote style="margin:0 0 20px;padding:0 0 0 18px;border-left:2px solid #d4d4d8;font-size:16px;line-height:1.8;overflow-wrap:anywhere">${escapeHtml(question.question).replace(/\r?\n/g, '<br>')}</blockquote>
<p style="margin:0 0 28px;font-size:12px;color:#71717a">${escapeHtml(topic)}</p>
<a href="${escapeHtml(inbox)}" style="display:inline-block;padding:13px 18px;background:#18181b;border-radius:4px;color:#fafafa;font-size:13px;text-decoration:none">Read &amp; reply &rarr;</a>
<p style="margin:32px 0 0;padding-top:20px;border-top:1px solid #dedede;font-size:12px;line-height:1.7;color:#71717a">This question stays private until you publish an answer.</p>
</td></tr></table></td></tr></table></body></html>`,
  })

  let status: number | 'network' = 'network'
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.key}`,
          'Content-Type': 'application/json',
          // A timeout can happen after delivery. Retrying must not send twice.
          'Idempotency-Key': `ask-question-${question.id}`,
        },
        body,
        signal: AbortSignal.timeout(8_000),
      })
      status = response.status
      if (response.ok) {
        console.info('[ask] Question notification accepted.', {
          questionId: question.id,
        })
        return 'sent'
      }
      if (response.status !== 429 && response.status < 500) break
    } catch {
      status = 'network'
    }
    if (attempt === 0)
      await new Promise((resolve) => setTimeout(resolve, 1_000))
  }

  // Neither provider responses nor question text/credentials belong in logs.
  console.error('[ask] Question saved, but its email notification failed.', {
    questionId: question.id,
    status,
  })
  return 'failed'
}
