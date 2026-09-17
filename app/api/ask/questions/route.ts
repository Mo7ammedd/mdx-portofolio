import { after } from 'next/server'
import {
  askHandler,
  askJson,
  limitAskRequest,
  requireAskAdminConfig,
} from '@/lib/ask/http'
import { adminConfig, readJson, requireSameOrigin } from '@/lib/ask/security'
import { getAskStore, getPublicQuestions } from '@/lib/ask/storage'
import { validateQuestion } from '@/lib/ask/validation'
import {
  emailNotificationsEnabled,
  notifyNewQuestion,
} from '@/lib/ask/notifications'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  return askHandler(async () =>
    askJson({
      questions: await getPublicQuestions(),
      acceptingQuestions: Boolean(adminConfig()),
    }),
  )
}

export async function POST(request: Request) {
  return askHandler(async () => {
    requireSameOrigin(request)
    requireAskAdminConfig()
    const input = validateQuestion(await readJson(request))
    await limitAskRequest(request, 'question')
    const question = await getAskStore().create(input)
    if (emailNotificationsEnabled()) {
      after(async () => {
        await notifyNewQuestion(question)
      })
    }
    return askJson({ id: question.id }, 201)
  })
}
