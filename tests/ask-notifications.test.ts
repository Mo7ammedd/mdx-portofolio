import assert from 'node:assert/strict'
import test, { type TestContext } from 'node:test'
import {
  emailNotificationsEnabled,
  notifyNewQuestion,
} from '../lib/ask/notifications'
import type { Question } from '../lib/ask/types'

const question: Question = {
  id: '26c67168-a246-4ae8-9127-a2c4a3314739',
  question:
    'What about <img src=x onerror="alert(1)"> & "quotes"?\nAnother line.',
  topic: 'general',
  status: 'pending',
  answer: 'An unpublished draft that must not be emailed.',
  createdAt: '2026-09-17T10:00:00.000Z',
  updatedAt: '2026-09-17T10:00:00.000Z',
  answeredAt: null,
}

function configure(t: TestContext) {
  const values = {
    ASK_EMAIL_NOTIFICATIONS: 'true',
    RESEND_API_KEY: 're_test_notification_key',
    ASK_ADMIN_EMAIL: ' OWNER@example.com ',
    ASK_EMAIL_FROM: 'questions@example.com',
    VERCEL_ENV: 'production',
  }
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  )
  Object.assign(process.env, values)
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })
  t.mock.method(console, 'info', () => {})
}

test('notifications are opt-in, need complete configuration, and never send from previews', async (t) => {
  configure(t)
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('Disabled notifications must not contact the provider')
  })
  process.env.ASK_EMAIL_NOTIFICATIONS = 'false'
  assert.equal(await notifyNewQuestion(question), 'disabled')
  process.env.ASK_EMAIL_NOTIFICATIONS = 'true'
  process.env.VERCEL_ENV = 'preview'
  assert.equal(emailNotificationsEnabled(), false)
  assert.equal(await notifyNewQuestion(question), 'disabled')
  process.env.VERCEL_ENV = 'production'
  process.env.RESEND_API_KEY = ''
  assert.equal(await notifyNewQuestion(question), 'disabled')
  process.env.RESEND_API_KEY = 're_test_notification_key'
  process.env.ASK_EMAIL_FROM = 'sender@example.com\r\nBcc: other@example.com'
  assert.equal(await notifyNewQuestion(question), 'disabled')
  process.env.ASK_EMAIL_FROM = 'questions@example.com'
  process.env.ASK_ADMIN_EMAIL = 'not-an-email'
  assert.equal(await notifyNewQuestion(question), 'disabled')
  assert.equal(fetchMock.mock.callCount(), 0)
})

test('mail only goes to the admin, escapes anonymous content, and links to the private question', async (t) => {
  configure(t)
  let message: Record<string, string | string[]> | undefined
  let headers: Headers | undefined
  t.mock.method(
    globalThis,
    'fetch',
    async (url: Parameters<typeof fetch>[0], init?: RequestInit) => {
      assert.equal(url, 'https://api.resend.com/emails')
      assert.equal(init?.method, 'POST')
      message = JSON.parse(String(init?.body))
      headers = new Headers(init?.headers)
      return Response.json({ id: 'test-email-id' })
    },
  )
  assert.equal(emailNotificationsEnabled(), true)
  assert.equal(await notifyNewQuestion(question), 'sent')
  assert.ok(message)
  assert.deepEqual(message.to, ['owner@example.com'])
  assert.equal(message.from, 'Modev Q&A <questions@example.com>')
  assert.equal(message.subject, 'New question on ask.modev.me')
  assert.equal(headers?.get('Idempotency-Key'), `ask-question-${question.id}`)
  assert.equal(headers?.get('Authorization'), 'Bearer re_test_notification_key')
  assert.equal(String(message.text).includes(question.question), true)
  assert.equal(String(message.html).includes('<img src='), false)
  assert.equal(String(message.html).includes('&lt;img src='), true)
  assert.equal(String(message.html).includes('&amp; &quot;quotes&quot;?'), true)
  assert.equal(String(message.html).includes('<br>Another line.'), true)
  for (const content of [String(message.html), String(message.text)]) {
    assert.equal(content.includes(question.answer!), false)
    assert.equal(content.includes('re_test_notification_key'), false)
    assert.equal(
      content.includes(`https://ask.modev.me/inbox?question=${question.id}`),
      true,
    )
  }
})

test('transient failures retry with identical content and an idempotency key', async (t) => {
  configure(t)
  const requests: { key: string | null; body: BodyInit | null | undefined }[] =
    []
  t.mock.method(
    globalThis,
    'fetch',
    async (_url: Parameters<typeof fetch>[0], init?: RequestInit) => {
      requests.push({
        key: new Headers(init?.headers).get('Idempotency-Key'),
        body: init?.body,
      })
      return requests.length === 1
        ? new Response(null, { status: 503 })
        : Response.json({ id: 'test-email-id' })
    },
  )
  assert.equal(await notifyNewQuestion(question), 'sent')
  assert.equal(requests.length, 2)
  assert.deepEqual(requests[0], requests[1])
})

test('permanent delivery failures are contained and never log question text or provider secrets', async (t) => {
  configure(t)
  const logs: unknown[][] = []
  t.mock.method(console, 'error', (...args: unknown[]) => logs.push(args))
  const fetchMock = t.mock.method(globalThis, 'fetch', async () =>
    Response.json(
      { message: `Sensitive provider response: ${question.question}` },
      { status: 403 },
    ),
  )
  assert.equal(await notifyNewQuestion(question), 'failed')
  assert.equal(fetchMock.mock.callCount(), 1)
  assert.equal(logs.length, 1)
  const log = JSON.stringify(logs)
  assert.equal(log.includes(question.question), false)
  assert.equal(log.includes('re_test_notification_key'), false)
  assert.equal(log.includes('Sensitive provider response'), false)
  assert.equal(log.includes(question.id), true)
})

test('connection failures stop after one retry and preserve the saved-question flow', async (t) => {
  configure(t)
  t.mock.method(console, 'error', () => {})
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => {
    throw new Error('A network failure')
  })
  assert.equal(await notifyNewQuestion(question), 'failed')
  assert.equal(fetchMock.mock.callCount(), 2)
})
