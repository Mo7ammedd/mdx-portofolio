import { NextRequest } from 'next/server'
import { askHandler, askJson, requireAskAdmin } from '@/lib/ask/http'
import { readJson, requireSameOrigin } from '@/lib/ask/security'
import { getAskStore } from '@/lib/ask/storage'
import {
  AskError,
  validateQuestionId,
  validateUpdate,
} from '@/lib/ask/validation'

export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return askHandler(async () => {
    requireSameOrigin(request)
    requireAskAdmin(request)
    const { id } = await context.params
    validateQuestionId(id)
    const input = validateUpdate(await readJson(request, 35_000))
    const question = await getAskStore().update(id, input)
    if (!question) throw new AskError('Question not found.', 404)
    return askJson({ question })
  })
}
