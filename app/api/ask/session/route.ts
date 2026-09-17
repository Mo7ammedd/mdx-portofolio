import {
  askHandler,
  askJson,
  limitAskRequest,
  requireAskPassword,
} from '@/lib/ask/http'
import {
  ASK_SESSION_COOKIE,
  ASK_SESSION_SECONDS,
  createSession,
  passwordMatches,
  readJson,
  requireSameOrigin,
} from '@/lib/ask/security'
import { AskError, validatePassword } from '@/lib/ask/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  return askHandler(async () => {
    requireSameOrigin(request)
    const expected = requireAskPassword()
    const password = validatePassword(await readJson(request, 1500))
    await limitAskRequest(request, 'login')
    if (!passwordMatches(password, expected)) {
      throw new AskError('That password doesn’t match. Please try again.', 401)
    }
    const response = askJson({ authenticated: true })
    response.cookies.set(ASK_SESSION_COOKIE, createSession(expected), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: ASK_SESSION_SECONDS,
    })
    return response
  })
}

export async function DELETE(request: Request) {
  return askHandler(async () => {
    requireSameOrigin(request)
    const response = askJson({ authenticated: false })
    response.cookies.set(ASK_SESSION_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })
    return response
  })
}
