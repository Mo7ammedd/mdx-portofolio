import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { isAskHost, siteHref } from '../lib/ask/routing'
import {
  ASK_SESSION_SECONDS,
  createSession,
  passwordMatches,
  readJson,
  requireSameOrigin,
  requestFingerprint,
  verifySession,
} from '../lib/ask/security'
import { createFileStore, getAskStore } from '../lib/ask/storage'
import { filterAnswers, publicQuestion, type Question } from '../lib/ask/types'
import {
  AskError,
  validateQuestion,
  validateQuestionId,
  validateUpdate,
} from '../lib/ask/validation'

test('anonymous submissions validate meaningful content, topics, and the honeypot', () => {
  assert.deepEqual(
    validateQuestion({
      question: '  How should I learn SQL?  ',
      topic: 'databases',
      website: '',
    }),
    {
      question: 'How should I learn SQL?',
      topic: 'databases',
    },
  )
  for (const input of [
    null,
    [],
    'text',
    {},
    { question: '   ', topic: 'general' },
    { question: 'A'.repeat(1001), topic: 'general' },
    { question: 'A valid question here?', topic: 'unexpected' },
    {
      question: 'A valid question here?',
      topic: 'general',
      website: 'spam.example',
    },
    { question: 'A valid question here?', topic: 'general', website: {} },
  ])
    assert.throws(() => validateQuestion(input), AskError)
  assert.equal(
    validateQuestion({ question: 'A'.repeat(1000), topic: 'general' }).question
      .length,
    1000,
  )
})

test('moderation accepts only explicit transitions and nonempty, bounded answers', () => {
  assert.deepEqual(
    validateUpdate({
      action: 'publish',
      answer: ' Useful answer. ',
      topic: 'backend',
    }),
    { action: 'publish', answer: 'Useful answer.', topic: 'backend' },
  )
  assert.deepEqual(validateUpdate({ action: 'archive' }), { action: 'archive' })
  assert.deepEqual(validateUpdate({ action: 'restore' }), { action: 'restore' })
  for (const input of [
    { action: 'delete' },
    { action: 'publish', answer: '  ', topic: 'general' },
    { action: 'publish', answer: 'A'.repeat(8001), topic: 'general' },
    { action: 'publish', answer: 'An answer.', topic: 'unknown' },
  ])
    assert.throws(() => validateUpdate(input), AskError)
  assert.throws(() => validateQuestionId('id&status=eq.answered'), AskError)
  assert.doesNotThrow(() =>
    validateQuestionId('798df001-fcba-49cc-b755-a0d61d4eb197'),
  )
})

const answered: Question = {
  id: '798df001-fcba-49cc-b755-a0d61d4eb197',
  question: 'How do you approach database indexes?',
  topic: 'databases',
  answer: 'Start with the query plan and the workload.',
  status: 'answered',
  createdAt: '2026-09-16T12:00:00.000Z',
  answeredAt: '2026-09-17T12:00:00.000Z',
  updatedAt: '2026-09-17T12:00:00.000Z',
}

test('public data excludes pending and archived questions, drafts, and private timestamps', () => {
  assert.equal(publicQuestion({ ...answered, status: 'pending' }), null)
  assert.equal(publicQuestion({ ...answered, status: 'archived' }), null)
  assert.equal(publicQuestion({ ...answered, answer: null }), null)
  assert.equal(publicQuestion({ ...answered, answeredAt: null }), null)
  const result = publicQuestion(answered)!
  assert.deepEqual(Object.keys(result).sort(), [
    'answer',
    'answeredAt',
    'id',
    'question',
    'topic',
  ])
  assert.equal(result.answer, answered.answer)
})

test('answer search combines topic and all search terms without regex evaluation', () => {
  const questions = [publicQuestion(answered)!]
  assert.equal(filterAnswers(questions, 'QUERY database', 'all').length, 1)
  assert.equal(filterAnswers(questions, 'query', 'databases').length, 1)
  assert.equal(filterAnswers(questions, 'query', 'backend').length, 0)
  assert.equal(filterAnswers(questions, 'query missing', 'all').length, 0)
  assert.equal(filterAnswers(questions, '.*', 'all').length, 0)
  assert.equal(filterAnswers(questions, '   ', 'all').length, 1)
})

test('inbox sessions expire, reject tampering, and are invalidated by password rotation', () => {
  const secret = 'a-private-test-password-with-entropy'
  const now = Date.UTC(2026, 8, 17, 12)
  const token = createSession(secret, now)
  assert.equal(verifySession(token, secret, now), true)
  assert.equal(
    verifySession(token, secret, now + (ASK_SESSION_SECONDS - 1) * 1000),
    true,
  )
  assert.equal(
    verifySession(token, secret, now + ASK_SESSION_SECONDS * 1000),
    false,
  )
  assert.equal(verifySession(token, `${secret}-changed`, now), false)
  assert.equal(verifySession(`${token.slice(0, -1)}!`, secret, now), false)
  assert.equal(verifySession(`${token}.extra`, secret, now), false)
  assert.equal(verifySession(token.replace('v1', 'v2'), secret, now), false)
  assert.equal(verifySession(token, null, now), false)
  assert.equal(verifySession(undefined, secret, now), false)
  assert.equal(passwordMatches(secret, secret), true)
  assert.equal(passwordMatches('wrong', secret), false)
})

test('mutating requests reject absent, malformed, and cross-site origins', () => {
  const request = (origin?: string) =>
    new Request('https://ask.modev.me/api/ask/questions', {
      headers: origin ? { origin } : {},
    })
  assert.doesNotThrow(() => requireSameOrigin(request('https://ask.modev.me')))
  for (const origin of [
    undefined,
    'null',
    'invalid',
    'https://evil.example',
    'https://ask.modev.me.evil.example',
    'https://ask.modev.me:444',
  ]) {
    assert.throws(() => requireSameOrigin(request(origin)), AskError)
  }
})

test('JSON request parsing rejects excessive, malformed, and unsupported input', async () => {
  const request = (body: string, contentType = 'application/json') =>
    new Request('https://ask.modev.me', {
      method: 'POST',
      headers: { 'content-type': contentType },
      body,
    })
  assert.deepEqual(await readJson(request('{"question":"hello"}')), {
    question: 'hello',
  })
  await assert.rejects(
    readJson(request('invalid')),
    (error: unknown) => error instanceof AskError && error.status === 400,
  )
  await assert.rejects(
    readJson(request('"' + 'a'.repeat(30) + '"'), 20),
    (error: unknown) => error instanceof AskError && error.status === 413,
  )
  await assert.rejects(
    readJson(request('{}', 'text/plain')),
    (error: unknown) => error instanceof AskError && error.status === 415,
  )
})

test('fingerprints hash trusted Vercel addresses and ignore spoofed forwarding headers locally', () => {
  const previous = process.env.VERCEL
  try {
    delete process.env.VERCEL
    const first = new Request('https://ask.modev.me', {
      headers: { 'x-forwarded-for': '192.0.2.1' },
    })
    const second = new Request('https://ask.modev.me', {
      headers: { 'x-forwarded-for': '192.0.2.2' },
    })
    assert.equal(
      requestFingerprint(first, 'secret'),
      requestFingerprint(second, 'secret'),
    )
    process.env.VERCEL = '1'
    assert.notEqual(
      requestFingerprint(first, 'secret'),
      requestFingerprint(second, 'secret'),
    )
    assert.match(requestFingerprint(first, 'secret'), /^[a-f0-9]{64}$/)
    assert.notEqual(
      requestFingerprint(first, 'secret'),
      requestFingerprint(first, 'new-secret'),
    )
  } finally {
    if (previous === undefined) delete process.env.VERCEL
    else process.env.VERCEL = previous
  }
})

test('file storage persists submissions and serializes concurrent moderation and rate limits', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'modev-ask-unit-'))
  t.after(() => rm(directory, { recursive: true, force: true }))
  const path = join(directory, 'ask.json')
  const first = createFileStore(path)
  const second = createFileStore(path)
  await Promise.all(
    Array.from({ length: 12 }, (_, index) =>
      (index % 2 ? first : second).create({
        question: `Question ${index}: how do database indexes work?`,
        topic: 'databases',
      }),
    ),
  )
  const saved = await createFileStore(path).list()
  assert.equal(saved.length, 12)
  assert.equal(new Set(saved.map((question) => question.id)).size, 12)
  assert.equal((await first.list(true)).length, 0)

  const question = saved[0]
  assert.equal(await first.findPublished(question.id), null)
  await first.update(question.id, {
    action: 'publish',
    answer: 'Inspect the query plan first.',
    topic: 'backend',
  })
  assert.equal((await second.list(true))[0].topic, 'backend')
  assert.equal((await second.findPublished(question.id))?.topic, 'backend')
  assert.equal(
    publicQuestion((await second.list(true))[0])!.answer,
    'Inspect the query plan first.',
  )
  await second.update(question.id, { action: 'archive' })
  assert.equal((await first.list(true)).length, 0)
  assert.equal(await first.findPublished(question.id), null)
  await first.update(question.id, { action: 'restore' })
  const restored = (await second.list()).find(
    (item) => item.id === question.id,
  )!
  assert.equal(restored.status, 'pending')
  assert.equal(restored.answer, 'Inspect the query plan first.')
  assert.equal((await first.list(true)).length, 0)
  assert.equal(await first.findPublished(question.id), null)
  assert.equal(await first.findPublished('missing'), null)
  assert.equal(await first.update('missing', { action: 'archive' }), null)

  const attempts = await Promise.all(
    Array.from({ length: 12 }, () =>
      createFileStore(path).consumeLimit('test-limit', 5, 900),
    ),
  )
  assert.equal(attempts.filter((retry) => retry === 0).length, 5)
  assert.ok(
    attempts.filter((retry) => retry > 0).every((retry) => retry <= 900),
  )
  assert.ok((await second.consumeLimit('test-limit', 5, 900)) > 0)
  assert.equal(await second.consumeLimit('other-limit', 5, 900), 0)
  assert.equal(JSON.parse(await readFile(path, 'utf8')).questions.length, 12)
})

test('production and partial configuration never fall back to ephemeral file storage', () => {
  const environment: Record<string, string | undefined> = process.env
  const names = [
    'NODE_ENV',
    'VERCEL',
    'SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ] as const
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  )
  try {
    for (const name of names) delete process.env[name]
    environment.NODE_ENV = 'production'
    assert.throws(getAskStore, AskError)
    environment.NODE_ENV = 'development'
    process.env.VERCEL = '1'
    assert.throws(getAskStore, AskError)
    delete process.env.VERCEL
    process.env.SUPABASE_URL = 'https://example.supabase.co'
    assert.throws(getAskStore, AskError)
    delete process.env.SUPABASE_URL
    assert.doesNotThrow(getAskStore)
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test'
    assert.throws(getAskStore, AskError)
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name]
      else environment[name] = previous[name]
    }
  }
})

test('Supabase accepts the public URL with a server secret and preserves legacy authentication', async (t) => {
  const names = [
    'SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SECRET_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ] as const
  const previous = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  )
  const requests: Request[] = []
  t.mock.method(
    globalThis,
    'fetch',
    async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      requests.push(new Request(input, init))
      return Response.json([])
    },
  )
  try {
    delete process.env.SUPABASE_URL
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.SUPABASE_SECRET_KEY = 'sb_secret_server_test'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'legacy-test-jwt'
    await getAskStore().list(true)
    assert.equal(new URL(requests[0].url).origin, 'https://example.supabase.co')
    assert.equal(requests[0].headers.get('apikey'), 'sb_secret_server_test')
    assert.equal(requests[0].headers.get('authorization'), null)
    assert.equal(
      new URL(requests[0].url).searchParams.get('status'),
      'eq.answered',
    )

    delete process.env.SUPABASE_SECRET_KEY
    await getAskStore().list()
    assert.equal(requests[1].headers.get('apikey'), 'legacy-test-jwt')
    assert.equal(
      requests[1].headers.get('authorization'),
      'Bearer legacy-test-jwt',
    )
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name]
      else process.env[name] = previous[name]
    }
  }
})

test('navigation preserves local previews and sends portfolio and inbox links to the right host', () => {
  assert.equal(siteHref('/ask', 'localhost'), '/ask')
  assert.equal(siteHref('/ask/inbox', 'preview.vercel.app'), '/ask/inbox')
  assert.equal(siteHref('/ask', 'www.modev.me'), 'https://ask.modev.me/')
  assert.equal(
    siteHref('/ask#question-id', 'modev.me'),
    'https://ask.modev.me/#question-id',
  )
  assert.equal(siteHref('/ask', 'ask.modev.me'), '/')
  assert.equal(siteHref('/ask/inbox', 'ask.modev.me'), '/inbox')
  assert.equal(siteHref('/ask#question-id', 'ask.modev.me'), '/#question-id')
  assert.equal(
    siteHref('/projects', 'ask.modev.me'),
    'https://www.modev.me/projects',
  )
  assert.equal(
    siteHref('/blog/rss.xml', 'ask.modev.me'),
    'https://www.modev.me/blog/rss.xml',
  )
  assert.equal(
    siteHref('/', 'ask.localhost', 'http://ask.localhost:3000'),
    'http://localhost:3000/',
  )
  assert.equal(isAskHost('ask.modev.me.evil.example'), false)
})
