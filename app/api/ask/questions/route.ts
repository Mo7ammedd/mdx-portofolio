import {
  askHandler,
  askJson,
  limitAskRequest,
  requireAskPassword,
} from '@/lib/ask/http'
import { adminPassword, readJson, requireSameOrigin } from '@/lib/ask/security'
import { getAskStore, getPublicQuestions } from '@/lib/ask/storage'
import { validateQuestion } from '@/lib/ask/validation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return askHandler(async () =>
    askJson({
      questions: await getPublicQuestions(),
      acceptingQuestions: Boolean(adminPassword()),
    }),
  )
}

export async function POST(request: Request) {
  return askHandler(async () => {
    requireSameOrigin(request)
    requireAskPassword()
    const input = validateQuestion(await readJson(request))
    await limitAskRequest(request, 'question')
    const question = await getAskStore().create(input)
    return askJson({ id: question.id }, 201)
  })
}
