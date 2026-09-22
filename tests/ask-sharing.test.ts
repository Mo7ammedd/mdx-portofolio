import assert from 'node:assert/strict'
import test, { type TestContext } from 'node:test'
import sharp from 'sharp'
import { GET as questionImage } from '../app/og/ask/[id]/route'
import { generateAskMetadata, previewText } from '../lib/ask/metadata'
import { getQuestionHref, isAskPath, siteHref } from '../lib/ask/routing'
import { getPublicQuestion } from '../lib/ask/storage'
import { publicQuestion, type Question } from '../lib/ask/types'

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

function mockDatabase(t: TestContext, question: Question | null = answered) {
  const values = {
    SUPABASE_URL: 'https://database.example.com',
    SUPABASE_SECRET_KEY: 'sb_secret_sharing_test',
  }
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  )
  Object.assign(process.env, values)
  t.after(() => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  const requests: Request[] = []
  t.mock.method(
    globalThis,
    'fetch',
    async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
      requests.push(new Request(input, init))
      return Response.json(
        question
          ? [
              {
                id: question.id,
                question: question.question,
                answer: question.answer,
                topic: question.topic,
                status: question.status,
                created_at: question.createdAt,
                answered_at: question.answeredAt,
                updated_at: question.updatedAt,
              },
            ]
          : [],
      )
    },
  )
  return requests
}

function imageRequest(id = answered.id) {
  return questionImage(new Request(`https://ask.modev.me/og/ask/${id}`), {
    params: Promise.resolve({ id }),
  })
}

test('shared question links reach the server and preserve host routing and the answer anchor', () => {
  const href = getQuestionHref(answered.id)
  assert.equal(isAskPath(href), true)
  for (const [hostname, expected] of [
    ['www.modev.me', `https://ask.modev.me/?question=${answered.id}`],
    ['modev.me', `https://ask.modev.me/?question=${answered.id}`],
    ['ask.modev.me', `/?question=${answered.id}`],
    ['ask.localhost', `/?question=${answered.id}`],
    ['localhost', `/ask?question=${answered.id}`],
    ['preview.vercel.app', `/ask?question=${answered.id}`],
  ]) {
    const resolved = siteHref(href, hostname)
    assert.equal(resolved, `${expected}#question-${answered.id}`)
    assert.equal(
      new URL(resolved, `https://${hostname}`).searchParams.get('question'),
      answered.id,
    )
  }
  assert.equal(isAskPath('/asking?question=anything'), false)
})

test('the main Ask page advertises its own card on both Open Graph and Twitter', () => {
  const metadata = generateAskMetadata()
  assert.equal(metadata.alternates?.canonical, 'https://ask.modev.me')
  assert.equal(metadata.openGraph?.url, 'https://ask.modev.me')
  assert.deepEqual(metadata.openGraph?.images, [
    {
      url: 'https://ask.modev.me/ask/opengraph-image',
      width: 1200,
      height: 630,
      alt: 'Ask me anything',
      type: 'image/png',
    },
  ])
  assert.deepEqual(metadata.twitter?.images, [
    'https://ask.modev.me/ask/opengraph-image',
  ])
})

test('question metadata identifies the question, uses its answer, and updates the image URL after edits', () => {
  const question = publicQuestion(answered)!
  const metadata = generateAskMetadata(question)
  const canonical = `https://ask.modev.me/?question=${question.id}`
  const image = `https://ask.modev.me/og/ask/${question.id}?v=${encodeURIComponent(question.answeredAt)}`
  assert.equal(metadata.title, question.question)
  assert.equal(metadata.description, question.answer)
  assert.equal(metadata.alternates?.canonical, canonical)
  assert.equal(metadata.openGraph?.url, canonical)
  assert.deepEqual(metadata.openGraph?.images, [
    {
      url: image,
      width: 1200,
      height: 630,
      alt: question.question,
      type: 'image/png',
    },
  ])
  assert.deepEqual(metadata.twitter?.images, [image])
  const edited = generateAskMetadata({
    ...question,
    answer: 'A revised answer.',
    answeredAt: '2026-09-18T12:00:00.000Z',
  })
  assert.equal(edited.description, 'A revised answer.')
  assert.notDeepEqual(edited.twitter?.images, metadata.twitter?.images)
})

test('long question and answer previews collapse whitespace and preserve Unicode characters', () => {
  const metadata = generateAskMetadata({
    ...publicQuestion(answered)!,
    question: `  ${'Question\n'.repeat(125)}  `,
    answer: ' Answer\t'.repeat(1000),
  })
  assert.equal(Array.from(metadata.title as string).length, 160)
  assert.equal(Array.from(metadata.description!).length, 240)
  assert.match(metadata.title as string, /…$/u)
  assert.doesNotMatch(metadata.description!, /[\n\t]/)
  assert.equal(previewText('  Hello\n\tthere! ', 80), 'Hello there!')
  assert.equal(previewText('😀'.repeat(10), 5), '😀😀😀😀…')
})

test('question previews query one published record and expose only its public fields', async (t) => {
  const requests = mockDatabase(t)
  const result = await getPublicQuestion(answered.id.toUpperCase())
  assert.deepEqual(result, publicQuestion(answered))
  assert.equal(requests.length, 1)
  const url = new URL(requests[0].url)
  assert.equal(url.searchParams.get('id'), `eq.${answered.id}`)
  assert.equal(url.searchParams.get('status'), 'eq.answered')
  assert.equal(url.searchParams.get('limit'), '1')
  assert.equal(requests[0].cache, 'no-store')
})

test('published question previews render a 1200 × 630 PNG without persistent caching', async (t) => {
  mockDatabase(t)
  const response = await imageRequest()
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type')!, /^image\/png/)
  assert.match(response.headers.get('cache-control')!, /no-store/)
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.deepEqual(bytes.subarray(0, 8), Buffer.from('89504e470d0a1a0a', 'hex'))
  assert.equal(bytes.readUInt32BE(16), 1200)
  assert.equal(bytes.readUInt32BE(20), 630)
})

test('Arabic question previews render offline in the neutral theme and escape text markup', async (t) => {
  const requests = mockDatabase(t, {
    ...answered,
    question: 'كيف تعمل فهارس <SQL> & قواعد البيانات؟ 🙂',
    answer:
      'ابدأ بخطة التنفيذ، ثم جرّب الاستعلام مع بيانات حقيقية. لا تفترض أن إضافة فهرس أسرع دائمًا.',
  })
  const response = await imageRequest()
  assert.equal(response.status, 200)
  const bytes = Buffer.from(await response.arrayBuffer())
  const image = sharp(bytes)
  const metadata = await image.metadata()
  assert.equal(metadata.width, 1200)
  assert.equal(metadata.height, 630)
  const background = await image
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .removeAlpha()
    .raw()
    .toBuffer()
  assert.deepEqual([...background], [28, 28, 28])
  assert.equal(
    requests.length,
    1,
    'Only the database is fetched; fonts must be bundled.',
  )
})

test('malformed question IDs return 404 before reaching the database', async (t) => {
  const requests = mockDatabase(t)
  const response = await imageRequest('id&status=eq.pending')
  assert.equal(response.status, 404)
  assert.match(response.headers.get('cache-control')!, /no-store/)
  assert.equal(requests.length, 0)
})

for (const [label, question] of Object.entries({
  missing: null,
  pending: { ...answered, status: 'pending' as const },
  archived: { ...answered, status: 'archived' as const },
  unanswered: { ...answered, answer: null },
  unpublished: { ...answered, answeredAt: null },
})) {
  test(`${label} questions cannot render a public preview`, async (t) => {
    mockDatabase(t, question)
    const response = await imageRequest()
    assert.equal(response.status, 404)
    assert.equal(await response.text(), 'Question not found.')
    assert.match(response.headers.get('cache-control')!, /no-store/)
  })
}

test('database outages return an uncached preview error without private provider details', async (t) => {
  mockDatabase(t)
  t.mock.method(globalThis, 'fetch', async () =>
    Response.json({ error: 'private provider details' }, { status: 500 }),
  )
  const response = await imageRequest()
  assert.equal(response.status, 503)
  assert.match(response.headers.get('cache-control')!, /no-store/)
  assert.equal(
    await response.text(),
    'The question preview is temporarily unavailable.',
  )
})
