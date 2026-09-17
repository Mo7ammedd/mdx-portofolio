import { cookies } from 'next/headers'
import { Inbox } from '@/components/ask/inbox'
import { InboxLogin } from '@/components/ask/inbox-login'
import {
  adminConfig,
  ASK_SESSION_COOKIE,
  verifySession,
} from '@/lib/ask/security'
import { getAskStore } from '@/lib/ask/storage'
import type { Question } from '@/lib/ask/types'
import { generateSEO } from '@/lib/seo'
import { emailNotificationsEnabled } from '@/lib/ask/notifications'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata = generateSEO({
  title: 'Question inbox',
  description: 'Private question inbox for Mohammed Mostafa.',
  path: '/ask/inbox',
  noIndex: true,
})

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ question?: string | string[] }>
}) {
  const admin = adminConfig()
  const session = (await cookies()).get(ASK_SESSION_COOKIE)?.value
  if (!verifySession(session, admin?.sessionSecret ?? null)) {
    return <InboxLogin configured={Boolean(admin)} />
  }
  let questions: Question[] = []
  let loadError = false
  try {
    questions = await getAskStore().list()
  } catch {
    loadError = true
  }
  const requestedQuestion = (await searchParams).question
  return (
    <Inbox
      initialQuestions={questions}
      initialQuestionId={
        typeof requestedQuestion === 'string' ? requestedQuestion : undefined
      }
      notificationsEnabled={emailNotificationsEnabled()}
      loadError={loadError}
    />
  )
}
