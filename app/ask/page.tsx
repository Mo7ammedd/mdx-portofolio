import type { Metadata } from 'next'
import { AskPage } from '@/components/ask/ask-page'
import { adminPassword } from '@/lib/ask/security'
import { getPublicQuestions } from '@/lib/ask/storage'
import { ASK_URL, type PublicQuestion } from '@/lib/ask/types'
import { generateSEO } from '@/lib/seo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const seo = generateSEO({
  title: 'Ask me anything',
  description:
    'Questions about backend engineering, databases, careers, and everything in between. Ask Mohammed Mostafa anonymously and read his answers.',
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
      acceptingQuestions={Boolean(adminPassword()) && !loadError}
      loadError={loadError}
    />
  )
}
