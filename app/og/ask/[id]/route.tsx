import { previewText } from '@/lib/ask/metadata'
import { getPublicQuestion } from '@/lib/ask/storage'
import { AskError } from '@/lib/ask/validation'
import { generateOGImage } from '@/lib/og-generator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const headers = { 'Cache-Control': 'private, no-store, max-age=0' }

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  let question
  try {
    question = await getPublicQuestion(id)
  } catch (error) {
    if (!(error instanceof AskError && error.status === 404)) {
      return new Response('The question preview is temporarily unavailable.', {
        status: 503,
        headers,
      })
    }
  }
  if (!question) {
    return new Response('Question not found.', { status: 404, headers })
  }

  const image = await generateOGImage({
    title: previewText(question.question, 160),
    description: previewText(question.answer, 240),
    label: 'QUESTIONS & ANSWERS',
    footer: 'Answered by Mohammed Mostafa',
    detail: 'ask.modev.me',
  })
  // Recheck publication on every request, including after edits or archiving.
  image.headers.set('Cache-Control', headers['Cache-Control'])
  return image
}
