import type { Metadata } from 'next'
import { cache } from 'react'
import { AskPage } from '@/components/ask/ask-page'
import { generateAskMetadata } from '@/lib/ask/metadata'
import { adminConfig } from '@/lib/ask/security'
import { getPublicQuestions } from '@/lib/ask/storage'
import type { PublicQuestion } from '@/lib/ask/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Share a read between the page and its metadata for this request only.
const loadQuestions = cache(async () => {
  try {
    return { questions: await getPublicQuestions(), loadError: false }
  } catch {
    return { questions: [] as PublicQuestion[], loadError: true }
  }
})

type AskProps = {
  searchParams: Promise<{ question?: string | string[] }>
}

export async function generateMetadata({
  searchParams,
}: AskProps): Promise<Metadata> {
  const { question: requestedQuestion } = await searchParams
  if (typeof requestedQuestion !== 'string') return generateAskMetadata()
  const { questions } = await loadQuestions()
  return generateAskMetadata(
    questions.find(
      (question) => question.id === requestedQuestion.toLowerCase(),
    ),
  )
}

export default async function Ask({ searchParams }: AskProps) {
  const [{ question: requestedQuestion }, { questions, loadError }] =
    await Promise.all([searchParams, loadQuestions()])
  const initialQuestionId = questions.find(
    (question) =>
      typeof requestedQuestion === 'string' &&
      question.id === requestedQuestion.toLowerCase(),
  )?.id
  return (
    <AskPage
      initialQuestions={questions}
      initialQuestionId={initialQuestionId}
      acceptingQuestions={Boolean(adminConfig()) && !loadError}
      loadError={loadError}
    />
  )
}
