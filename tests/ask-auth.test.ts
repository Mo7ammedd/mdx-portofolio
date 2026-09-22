import assert from 'node:assert/strict'
import test, { type TestContext } from 'node:test'
import { NextRequest } from 'next/server'
import { POST as signIn, DELETE as signOut } from '../app/api/ask/session/route'
import {
  GET as listQuestions,
  POST as submitQuestion,
} from '../app/api/ask/questions/route'
import { requireAskAdmin } from '../lib/ask/http'
import {
  adminConfig,
  createSession,
  credentialsMatch,
  verifySession,
} from '../lib/ask/security'
import { AskError, validateCredentials } from '../lib/ask/validation'

const email = 'owner@example.com'
const password = 'Test-admin!'
const origin = 'https://ask.example.com'

function configure(t: TestContext) {
  const environment: Record<string, string | undefined> = process.env
  const values = {
    NODE_ENV: 'production',
    ASK_ADMIN_EMAIL: email,
    ASK_ADMIN_PASSWORD: password,
    SUPABASE_URL: 'https://database.example.com',
    SUPABASE_SECRET_KEY: 'sb_secret_auth_test',
  }
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, environment[key]]),
  )
  Object.assign(environment, values)
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete environment[key]
      else environment[key] = value
    }
  })
}

function loginRequest(body: unknown, requestOrigin = origin) {
  return new Request(`${origin}/api/ask/session`, {
    method: 'POST',
    headers: { Origin: requestOrigin, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

test('admin sign-in validates both fields, normalizes email, and preserves the password exactly', () => {
  const input = {
    email: '  OWNER@EXAMPLE.COM  ',
    password: ' spaces matter in passwords ',
  }
  assert.deepEqual(validateCredentials(input), {
    email,
    password: input.password,
  })
  for (const value of [
    null,
    [],
    {},
    { password },
    { email },
    { email, password: '' },
    { email, password: 123 },
    { email: 'invalid', password },
    { email: `${'a'.repeat(250)}@example.com`, password },
    { email, password: 'a'.repeat(257) },
  ]) {
    assert.throws(() => validateCredentials(value), AskError)
  }
  assert.equal(credentialsMatch({ email, password }, { email, password }), true)
  assert.equal(
    credentialsMatch(
      { email: 'someone@example.com', password },
      { email, password },
    ),
    false,
  )
  assert.equal(
    credentialsMatch(
      { email, password: 'wrong-password' },
      { email, password },
    ),
    false,
  )
})

test('inbox configuration fails closed and sessions are bound to the admin email and password', (t) => {
  configure(t)
  const original = adminConfig()!
  const session = createSession(original.sessionSecret)
  assert.equal(verifySession(session, original.sessionSecret), true)
  assert.equal(
    verifySession(createSession(password), original.sessionSecret),
    false,
  )

  process.env.ASK_ADMIN_EMAIL = '  OWNER@EXAMPLE.COM  '
  assert.equal(verifySession(session, adminConfig()!.sessionSecret), true)
  process.env.ASK_ADMIN_EMAIL = 'another@example.com'
  assert.equal(verifySession(session, adminConfig()!.sessionSecret), false)
  process.env.ASK_ADMIN_EMAIL = email
  process.env.ASK_ADMIN_PASSWORD = `${password}-changed`
  assert.equal(verifySession(session, adminConfig()!.sessionSecret), false)
  process.env.ASK_ADMIN_PASSWORD = password

  for (const value of ['', 'invalid', `${'a'.repeat(250)}@example.com`]) {
    process.env.ASK_ADMIN_EMAIL = value
    assert.equal(adminConfig(), null)
  }
  process.env.ASK_ADMIN_EMAIL = email
  for (const length of [10, 256]) {
    process.env.ASK_ADMIN_PASSWORD = 'a'.repeat(length)
    assert.equal(adminConfig()?.password, 'a'.repeat(length))
  }
  for (const value of ['', 'too-short', 'a'.repeat(257)]) {
    process.env.ASK_ADMIN_PASSWORD = value
    assert.equal(adminConfig(), null)
  }
})

test('the login API accepts an 11-character password and protects credentials, sessions, and rate limits', async (t) => {
  configure(t)
  let retryAfter = 0
  const requests: Request[] = []
  t.mock.method(
    globalThis,
    'fetch',
    async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      const request = new Request(input, init)
      assert.equal(
        new URL(request.url).pathname,
        '/rest/v1/rpc/ask_consume_rate_limit',
      )
      requests.push(request)
      return Response.json(retryAfter)
    },
  )

  const missingEmail = await signIn(loginRequest({ password }))
  assert.equal(missingEmail.status, 400)
  assert.equal(missingEmail.headers.get('set-cookie'), null)
  assert.equal(requests.length, 0)
  assert.equal(
    (
      await signIn(
        loginRequest({ email, password }, 'https://unrelated.example'),
      )
    ).status,
    403,
  )

  const wrongEmail = await signIn(
    loginRequest({ email: 'someone@example.com', password }),
  )
  const wrongPassword = await signIn(
    loginRequest({ email, password: 'wrong-password' }),
  )
  assert.equal(wrongEmail.status, 401)
  assert.equal(wrongPassword.status, 401)
  assert.deepEqual(await wrongEmail.json(), await wrongPassword.json())
  assert.equal(wrongEmail.headers.get('set-cookie'), null)

  const success = await signIn(
    loginRequest({ email: ' OWNER@EXAMPLE.COM ', password }),
  )
  assert.equal(success.status, 200)
  assert.deepEqual(await success.json(), { authenticated: true })
  const cookie = success.headers.get('set-cookie')!
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /Secure/i)
  assert.match(cookie, /SameSite=Strict/i)
  assert.match(success.headers.get('cache-control')!, /no-store/)
  const request = new NextRequest(`${origin}/api/ask/inbox`, {
    headers: { Cookie: cookie.split(';')[0] },
  })
  assert.doesNotThrow(() => requireAskAdmin(request))
  process.env.ASK_ADMIN_EMAIL = 'changed@example.com'
  assert.throws(
    () => requireAskAdmin(request),
    (error: unknown) => error instanceof AskError && error.status === 401,
  )
  process.env.ASK_ADMIN_EMAIL = email

  retryAfter = 900
  const limited = await signIn(loginRequest({ email, password }))
  assert.equal(limited.status, 429)
  assert.equal(limited.headers.get('retry-after'), '900')
  assert.equal(limited.headers.get('set-cookie'), null)
  for (const request of requests) {
    const body = await request.text()
    assert.equal(body.includes(email), false)
    assert.equal(body.includes(password), false)
  }

  const logout = await signOut(
    new Request(`${origin}/api/ask/session`, {
      method: 'DELETE',
      headers: { Origin: origin },
    }),
  )
  assert.equal(logout.status, 200)
  assert.match(logout.headers.get('set-cookie')!, /Max-Age=0/i)
})

test('missing admin email closes sign-in and new submissions without exposing credentials publicly', async (t) => {
  configure(t)
  t.mock.method(globalThis, 'fetch', async () => Response.json([]))
  const publicData = await (await listQuestions()).json()
  assert.deepEqual(publicData, { questions: [], acceptingQuestions: true })
  delete process.env.ASK_ADMIN_EMAIL
  assert.deepEqual(await (await listQuestions()).json(), {
    questions: [],
    acceptingQuestions: false,
  })
  assert.equal((await signIn(loginRequest({ email, password }))).status, 503)
  const submission = new Request(`${origin}/api/ask/questions`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: 'How should I learn databases?',
      topic: 'databases',
    }),
  })
  assert.equal((await submitQuestion(submission)).status, 503)
})
