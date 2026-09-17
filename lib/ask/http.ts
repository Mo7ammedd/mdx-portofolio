import { NextRequest, NextResponse } from 'next/server'
import {
  adminConfig,
  ASK_SESSION_COOKIE,
  requestFingerprint,
  verifySession,
} from './security'
import { getAskStore } from './storage'
import { AskError } from './validation'

export function askJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
      Vary: 'Cookie, Origin',
    },
  })
}

export async function askHandler(handler: () => Promise<NextResponse>) {
  try {
    return await handler()
  } catch (error) {
    const expected = error instanceof AskError
    const response = askJson(
      {
        error: expected
          ? error.message
          : 'Something went wrong. Please try again shortly.',
      },
      expected ? error.status : 503,
    )
    if (expected && error.retryAfter) {
      response.headers.set('Retry-After', String(error.retryAfter))
    }
    return response
  }
}

export function requireAskAdminConfig() {
  const admin = adminConfig()
  if (!admin) {
    throw new AskError(
      'Questions are temporarily closed. Please check back shortly.',
      503,
    )
  }
  return admin
}

export function requireAskAdmin(request: NextRequest) {
  if (
    !verifySession(
      request.cookies.get(ASK_SESSION_COOKIE)?.value,
      adminConfig()?.sessionSecret ?? null,
    )
  ) {
    throw new AskError('Your session has ended. Please sign in again.', 401)
  }
}

export async function limitAskRequest(
  request: Request,
  purpose: 'question' | 'login',
) {
  const secret = requireAskAdminConfig().password
  const key = `${purpose}:${requestFingerprint(request, secret)}`
  const retryAfter = await getAskStore().consumeLimit(key, 5, 15 * 60)
  if (retryAfter) {
    throw new AskError(
      `A few too many attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
      429,
      retryAfter,
    )
  }
}
