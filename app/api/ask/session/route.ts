import {
  askHandler,
  askJson,
  limitAskRequest,
  requireAskAdminConfig,
} from '@/lib/ask/http'
import {
  ASK_SESSION_COOKIE,
  ASK_SESSION_SECONDS,
  createSession,
  credentialsMatch,
  readJson,
  requireSameOrigin,
} from '@/lib/ask/security'
import { AskError, validateCredentials } from '@/lib/ask/validation'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  return askHandler(async () => {
    requireSameOrigin(request)
    const expected = requireAskAdminConfig()
    const credentials = validateCredentials(await readJson(request, 2000))
    await limitAskRequest(request, 'login')
    if (!credentialsMatch(credentials, expected)) {
      throw new AskError(
        'Email or password is incorrect. Please try again.',
        401,
      )
    }
    const response = askJson({ authenticated: true })
    response.cookies.set(
      ASK_SESSION_COOKIE,
      createSession(expected.sessionSecret),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: ASK_SESSION_SECONDS,
      },
    )
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
