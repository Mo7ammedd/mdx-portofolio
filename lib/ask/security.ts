import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto'
import { isIP } from 'node:net'
import { AskError, normalizeEmail, type AdminCredentials } from './validation'

export const ASK_SESSION_COOKIE = 'ask_inbox_session'
export const ASK_SESSION_SECONDS = 60 * 60 * 8

export function adminConfig() {
  const email = normalizeEmail(process.env.ASK_ADMIN_EMAIL)
  const password = process.env.ASK_ADMIN_PASSWORD
  if (!email) {
    console.error('[ask] ASK_ADMIN_EMAIL is missing or invalid.')
    return null
  }
  if (!password || password.length < 10 || password.length > 256) {
    console.error('[ask] ASK_ADMIN_PASSWORD must contain 10 to 256 characters.')
    return null
  }
  return {
    email,
    password,
    // Bind sessions to the admin identity and reject legacy password-only cookies.
    sessionSecret: createHmac('sha256', password)
      .update(`ask-admin-identity:v1:${email}`)
      .digest('hex'),
  }
}

export function passwordMatches(input: string, expected: string) {
  return timingSafeEqual(
    createHash('sha256').update(input).digest(),
    createHash('sha256').update(expected).digest(),
  )
}

export function credentialsMatch(
  input: AdminCredentials,
  expected: AdminCredentials,
) {
  // Always compare both fields before deciding; neither error reveals which matched.
  const emailMatches = passwordMatches(input.email, expected.email)
  const secretMatches = passwordMatches(input.password, expected.password)
  return emailMatches && secretMatches
}

function signature(payload: string, secret: string) {
  return createHmac('sha256', secret)
    .update(`ask-inbox-session:${payload}`)
    .digest('base64url')
}

export function createSession(secret: string, now = Date.now()) {
  const expires = Math.floor(now / 1000) + ASK_SESSION_SECONDS
  const payload = `v1.${expires}.${randomBytes(18).toString('base64url')}`
  return `${payload}.${signature(payload, secret)}`
}

export function verifySession(
  token: string | undefined,
  secret: string | null,
  now = Date.now(),
) {
  if (!token || !secret || token.length > 256) return false
  const [version, expires, nonce, supplied, ...extra] = token.split('.')
  if (
    extra.length ||
    version !== 'v1' ||
    !/^\d{10,}$/.test(expires ?? '') ||
    !/^[\w-]{24}$/.test(nonce ?? '') ||
    !/^[\w-]{43}$/.test(supplied ?? '') ||
    Number(expires) <= Math.floor(now / 1000) ||
    Number(expires) > Math.floor(now / 1000) + ASK_SESSION_SECONDS
  ) {
    return false
  }
  const expected = signature(`${version}.${expires}.${nonce}`, secret)
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
}

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  try {
    const parsed = new URL(origin ?? '')
    const host = request.headers.get('host') ?? new URL(request.url).host
    if (
      parsed.host === host &&
      ['http:', 'https:'].includes(parsed.protocol) &&
      (process.env.NODE_ENV !== 'production' || parsed.protocol === 'https:')
    ) {
      return
    }
  } catch {
    // Missing and malformed origins are rejected as well.
  }
  throw new AskError('Please send this request from the Q&A page.', 403)
}

export function requestFingerprint(request: Request, secret: string) {
  // Vercel overwrites this header. Outside Vercel, use a shared bucket rather
  // than trusting an arbitrary client-supplied forwarding header.
  const forwarded =
    process.env.VERCEL === '1'
      ? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      : undefined
  const address = forwarded && isIP(forwarded) ? forwarded : 'local'
  return createHmac('sha256', secret)
    .update(`ask-rate-limit:${address}`)
    .digest('hex')
}

export async function readJson(
  request: Request,
  limit = 6000,
): Promise<unknown> {
  if (
    request.headers.get('content-type')?.split(';')[0]?.trim() !==
    'application/json'
  ) {
    throw new AskError('This request needs JSON content.', 415)
  }
  if (!request.body) throw new AskError('Please complete the form.')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > limit) {
        await reader.cancel()
        throw new AskError('This request is too large.', 413)
      }
      chunks.push(value)
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch (error) {
    if (error instanceof AskError) throw error
    throw new AskError('Please check the form and try again.')
  } finally {
    reader.releaseLock()
  }
}
