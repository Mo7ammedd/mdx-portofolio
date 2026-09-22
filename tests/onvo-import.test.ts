import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fetchOnvoPosts,
  insertOnvoQuestions,
  prepareOnvoImport,
  recoverOnvoHistory,
  withOnvoQuestion,
} from '../lib/ask/onvo-import.mjs'
import { validateQuestionId } from '../lib/ask/validation'

function post() {
  return {
    id: '101',
    author: { username: 'mo', id: 'private-author-id' },
    is_reply: true,
    flagged: false,
    body: '  إجابة بالعربية\nwith English too.  ',
    created_at: '2025-12-17T23:01:00.000Z',
    last_activity_at: '2026-06-26T18:35:58.335Z',
    question: {
      body: 'أهلاً؟',
      created_at: '2025-12-17T22:37:38.000Z',
      sender_vuse: 'private-sender-id',
    },
  }
}

function payload(items: unknown[]) {
  return { data: { items, has_more: true } }
}

test('Onvo imports preserve original text and dates and omit sender identities', () => {
  const source = post()
  const plan = prepareOnvoImport(payload([source]))
  const row = plan.rows[0]
  assert.equal(plan.total, 1)
  assert.equal(plan.shortQuestions, 1)
  assert.equal(plan.hasMore, true)
  assert.deepEqual(plan.skipped, [])
  assert.doesNotThrow(() => validateQuestionId(row.id))
  assert.deepEqual(row, {
    id: row.id,
    import_source: 'onvo:mo:101',
    question: source.question.body,
    answer: source.body,
    topic: 'general',
    status: 'answered',
    created_at: source.question.created_at,
    answered_at: source.created_at,
    updated_at: source.created_at,
  })
  assert.equal(JSON.stringify(row).includes('private-'), false)
})

test('repeated source posts keep stable IDs, deduplicate, and reject conflicting content', () => {
  const source = post()
  const first = prepareOnvoImport(payload([source])).rows[0]
  const repeated = prepareOnvoImport(payload([source, source]))
  assert.deepEqual(repeated.rows, [first])
  assert.equal(repeated.duplicates, 1)
  assert.equal(repeated.unique, 1)
  assert.equal(repeated.skipped.length, 0)
  assert.notEqual(
    first.id,
    prepareOnvoImport(payload([{ ...source, id: '102' }])).rows[0].id,
  )
  assert.throws(
    () =>
      prepareOnvoImport(
        payload([source, { ...source, body: 'Changed answer' }]),
      ),
    /Conflicting source posts/,
  )
})

test('imports report unsupported content instead of inventing, truncating, or misattributing answers', () => {
  const source = post()
  const unsupported = [
    { ...source, author: { username: 'someone-else' } },
    { ...source, is_reply: false },
    { ...source, reposted_by: { username: 'mo' } },
    { ...source, flagged: true },
    { ...source, media_url: 'https://example.com/photo.jpg' },
    { ...source, body: ' '.repeat(10) },
    { ...source, body: 'a'.repeat(8001) },
    { ...source, body: 'invalid\0text' },
    { ...source, question: { ...source.question, body: 'a'.repeat(1001) } },
    { ...source, created_at: 'not a date' },
    { ...source, created_at: '2025-01-01T00:00:00.000Z' },
  ]
  const result = prepareOnvoImport(
    payload(
      unsupported.map((item, index) => ({ ...item, id: String(index + 1) })),
    ),
  )
  assert.equal(result.rows.length, 0)
  assert.equal(result.skipped.length, unsupported.length)
  assert.throws(() => prepareOnvoImport({}), /data.items/)
  assert.throws(
    () => prepareOnvoImport(payload([{ ...source, id: null }])),
    /source ID/,
  )
})

test('pagination follows every returned cursor through an empty final page', async () => {
  const pages = [
    { items: [post()], next_cursor: 'next/page+20', has_more: true },
    {
      items: [{ ...post(), id: '102' }],
      next_cursor: 'page40',
      has_more: true,
    },
    { items: [], next_cursor: null, has_more: false },
  ]
  const cursors: Array<string | null> = []
  const result = await fetchOnvoPosts({
    request: async (
      input: Parameters<typeof fetch>[0],
      options?: RequestInit,
    ) => {
      const request = new Request(input, options)
      assert.equal(request.headers.get('authorization'), null)
      const url = new URL(request.url)
      assert.equal(url.searchParams.get('limit'), '20')
      cursors.push(url.searchParams.get('cursor'))
      return Response.json({ data: pages[cursors.length - 1] })
    },
  })
  assert.deepEqual(cursors, [null, 'next/page+20', 'page40'])
  assert.equal(result.data.items.length, 2)
  assert.equal(result.data.has_more, false)
  assert.equal(result.pagination.pages, 3)
})

test('rate limits honor Retry-After and a failed page never returns a partial import', async () => {
  const delays: number[] = []
  let attempts = 0
  const result = await fetchOnvoPosts({
    wait: async (milliseconds: number) => {
      delays.push(milliseconds)
    },
    request: async () => {
      attempts += 1
      return attempts === 1
        ? new Response(null, { status: 429, headers: { 'Retry-After': '2' } })
        : Response.json({
            data: { items: [post()], has_more: false, next_cursor: null },
          })
    },
  })
  assert.equal(result.data.items.length, 1)
  assert.deepEqual(delays, [2000])
  let calls = 0
  await assert.rejects(
    () =>
      fetchOnvoPosts({
        request: async () => {
          calls += 1
          return calls === 1
            ? Response.json({
                data: { items: [post()], has_more: true, next_cursor: '20' },
              })
            : new Response('private response detail', { status: 403 })
        },
      }),
    (error: Error) =>
      error.message.includes('No posts were imported') &&
      !error.message.includes('private response'),
  )
})

test('pagination refuses repeated cursors and missing pagination metadata', async () => {
  await assert.rejects(
    () =>
      fetchOnvoPosts({
        request: async () =>
          Response.json({
            data: { items: [post()], has_more: true, next_cursor: '20' },
          }),
      }),
    /did not advance/,
  )
  await assert.rejects(
    () =>
      fetchOnvoPosts({
        request: async () => Response.json({ data: { items: [post()] } }),
      }),
    /invalid paginated response/,
  )
})

test('legacy recovery verifies public threads and never publishes a private feed candidate', async () => {
  const old = {
    ...post(),
    post_id: '201',
    parent_message_id: null,
    question: null,
  }
  const recovered = { ...old, id: '99', post_id: '199' }
  const unavailable = { ...old, id: '97', post_id: '197' }
  const question = {
    id: '100',
    body: 'The original historical question?',
    created_at: old.created_at,
    parent_message_id: null,
    author: { username: 'onvo_guest' },
  }
  const requests: string[] = []
  const result = await recoverOnvoHistory(
    { data: { items: [old, old], has_more: false } },
    {
      request: async (input: Parameters<typeof fetch>[0]) => {
        const url = new URL(String(input))
        requests.push(url.pathname)
        if (url.pathname === '/v3/posts') {
          assert.deepEqual(
            JSON.parse(
              Buffer.from(
                url.searchParams.get('cursor')!,
                'base64url',
              ).toString(),
            ),
            { id: 101 },
          )
          return Response.json({
            data: {
              items: [recovered, unavailable],
              has_more: false,
              next_cursor: null,
            },
          })
        }
        if (url.pathname === '/v3/posts/201')
          return Response.json({ data: [question, old] })
        if (url.pathname === '/v3/posts/199')
          return Response.json({ data: [{ ...question, id: '98' }, recovered] })
        if (url.pathname === '/v3/posts/197')
          return new Response(null, { status: 404 })
        assert.fail('Unexpected Onvo request')
      },
    },
  )
  const plan = prepareOnvoImport(result)
  assert.equal(plan.rows.length, 2)
  assert.equal(plan.duplicates, 1)
  assert.deepEqual(result.recovery.unavailable, ['97'])
  assert.equal(result.recovery.restoredQuestions, 2)
  assert.equal(requests.filter((path) => path === '/v3/posts/201').length, 1)
  assert.equal(
    plan.rows.some(
      (row: { import_source: string }) => row.import_source === 'onvo:mo:97',
    ),
    false,
  )
})

test('thread recovery follows an explicit parent and reports media or ambiguous questions', () => {
  const source = { ...post(), parent_message_id: '100', question: null }
  const parent = {
    id: '100',
    body: 'A parent message?',
    created_at: source.created_at,
    author: { username: 'someone-else' },
  }
  const recovered = withOnvoQuestion(source, [
    parent,
    source,
    { ...source, id: '102' },
  ])
  assert.equal(recovered?.question?.body, parent.body)
  const media = withOnvoQuestion(source, [
    { ...parent, body: null, media_type: 'draw' },
    source,
  ])
  assert.equal(
    prepareOnvoImport(payload([media])).skipped[0].reason.includes('media'),
    true,
  )
  const ambiguous = { ...source, parent_message_id: null }
  assert.equal(
    withOnvoQuestion(ambiguous, [parent, ambiguous, { ...source, id: '102' }])
      ?.question,
    null,
  )
})

test('database imports ignore existing source records so reruns preserve moderated answers', async () => {
  const rows = prepareOnvoImport(payload([post()])).rows
  let calls = 0
  const imported = await insertOnvoQuestions(
    rows,
    { url: 'https://database.example.com', key: 'sb_secret_import_test' },
    async (input: Parameters<typeof fetch>[0], options?: RequestInit) => {
      calls += 1
      const request = new Request(input, options)
      assert.equal(request.method, 'POST')
      assert.equal(new URL(request.url).searchParams.get('on_conflict'), 'id')
      assert.equal(
        request.headers.get('prefer'),
        'resolution=ignore-duplicates,return=representation',
      )
      assert.equal(request.headers.get('authorization'), null)
      assert.equal(request.headers.get('apikey'), 'sb_secret_import_test')
      assert.deepEqual(await request.json(), rows)
      return Response.json([])
    },
  )
  assert.equal(calls, 1)
  assert.deepEqual(imported, [])
})

test('empty imports make no requests and database errors do not expose provider responses', async () => {
  const configuration = {
    url: 'https://database.example.com',
    key: 'sb_secret_test',
  }
  const empty = await insertOnvoQuestions([], configuration, async () => {
    assert.fail('An empty import must not send a request.')
  })
  assert.deepEqual(empty, [])
  const rows = prepareOnvoImport(payload([post()])).rows
  await assert.rejects(
    () =>
      insertOnvoQuestions(rows, configuration, async () =>
        Response.json({ details: 'private database detail' }, { status: 400 }),
      ),
    (error: Error) =>
      error.message.includes('202609230001_onvo_imports.sql') &&
      !error.message.includes('private database detail'),
  )
})
