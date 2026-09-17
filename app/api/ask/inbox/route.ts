import { NextRequest } from 'next/server'
import { askHandler, askJson, requireAskAdmin } from '@/lib/ask/http'
import { getAskStore } from '@/lib/ask/storage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return askHandler(async () => {
    requireAskAdmin(request)
    return askJson({ questions: await getAskStore().list() })
  })
}
