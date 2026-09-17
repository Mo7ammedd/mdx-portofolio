import { cookies } from 'next/headers'
import { Inbox } from '@/components/ask/inbox'
import { InboxLogin } from '@/components/ask/inbox-login'
import {
  adminPassword,
  ASK_SESSION_COOKIE,
  verifySession,
} from '@/lib/ask/security'
import { getAskStore } from '@/lib/ask/storage'
import type { Question } from '@/lib/ask/types'
import { generateSEO } from '@/lib/seo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const metadata = generateSEO({
  title: 'Question inbox',
  description: 'Private question inbox for Mohammed Mostafa.',
  path: '/ask/inbox',
  noIndex: true,
})

export default async function InboxPage() {
  const password = adminPassword()
  const session = (await cookies()).get(ASK_SESSION_COOKIE)?.value
  if (!verifySession(session, password)) {
    return <InboxLogin configured={Boolean(password)} />
  }
  let questions: Question[] = []
  let loadError = false
  try {
    questions = await getAskStore().list()
  } catch {
    loadError = true
  }
  return <Inbox initialQuestions={questions} loadError={loadError} />
}
