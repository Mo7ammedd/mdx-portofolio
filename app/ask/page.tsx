import type { Metadata } from 'next'
import { AskPage } from '@/components/ask/ask-page'
import { adminConfig } from '@/lib/ask/security'
import { getPublicQuestions } from '@/lib/ask/storage'
import { ASK_URL, type PublicQuestion } from '@/lib/ask/types'
import { generateSEO } from '@/lib/seo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const seo = generateSEO({
  title: 'Ask me anything',
  description:
    'Whatever is on your mind, ask Mohammed Mostafa. Leave an anonymous question and read his answers. No account needed.',
  path: '/ask',
})

export const metadata: Metadata = {
  ...seo,
  metadataBase: new URL(ASK_URL),
  alternates: { canonical: ASK_URL },
  openGraph: { ...seo.openGraph, url: ASK_URL },
}

export default async function Ask() {
  let questions: PublicQuestion[] = []
  let loadError = false
  try {
    questions = await getPublicQuestions()
  } catch {
    loadError = true
  }
  return (
    <AskPage
      initialQuestions={questions}
      acceptingQuestions={Boolean(adminConfig()) && !loadError}
      loadError={loadError}
    />
  )
}
