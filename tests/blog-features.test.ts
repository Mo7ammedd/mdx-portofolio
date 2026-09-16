import assert from 'node:assert/strict'
import test from 'node:test'
import { searchBlogSections, type BlogSearchDocument } from '../lib/blog-search'
import { buildBlogSearchIndex } from '../lib/blog-search-index'
import { paginationWork } from '../lib/pagination-model'
import {
  parseReadingPosition,
  readingStorageKey,
} from '../lib/reading-progress'
import { getArticleReadingPath, readingPaths } from '../lib/reading-paths'
import { blogVerifications, meaningfulUpdatedDate } from '../lib/blog-freshness'
import rehypeBlogPost from '../lib/rehype-blog-post.mjs'

let indexRequest: ReturnType<typeof buildBlogSearchIndex> | undefined
const getIndex = () => (indexRequest ??= buildBlogSearchIndex())

test('search reaches body-only API references and excludes MDX imports and metadata code', async () => {
  const index = await getIndex()
  assert.equal(index.length, 7)
  const result = searchBlogSections(index, 'proxy_read_timeout')
  assert.ok(result.length)
  assert.ok(
    result.some(
      (hit) =>
        hit.slug.startsWith('nginx-') &&
        hit.sectionId &&
        hit.excerpt.includes('proxy_read_timeout'),
    ),
  )
  assert.deepEqual(searchBlogSections(index, 'generateBlogPostSEO'), [])
  assert.ok(
    searchBlogSections(index, 'IMiddleware')[0].sectionTitle.includes(
      'IMiddleware',
    ),
  )
  assert.ok(
    searchBlogSections(index, 'tiebreaker').some(
      (hit) => hit.slug === 'pagination-strategies-offset-vs-cursor',
    ),
  )
})

test('search respects multiple terms, topic filters, literal punctuation, and bounded results', () => {
  const documents: BlogSearchDocument[] = [
    {
      slug: 'sql',
      title: 'Database notes',
      description: 'Querying data',
      tags: ['database'],
      sections: [
        {
          id: 'cursors',
          title: 'Composite cursors',
          content: 'PostgreSQL uses a unique tiebreaker for tuple comparisons.',
        },
        { id: 'cache', title: 'Caching', content: 'An unrelated discussion.' },
      ],
    },
    {
      slug: 'csharp',
      title: 'Runtime notes',
      description: 'Types',
      tags: ['csharp'],
      sections: [
        {
          id: 'generic',
          title: 'List<int> and C#',
          content: 'A List<int> preserves values.',
        },
      ],
    },
  ]
  assert.equal(
    searchBlogSections(documents, 'POSTGRESQL tiebreaker')[0].sectionId,
    'cursors',
  )
  assert.deepEqual(searchBlogSections(documents, 'tiebreaker missing'), [])
  assert.deepEqual(searchBlogSections(documents, 'tiebreaker', 'csharp'), [])
  assert.equal(searchBlogSections(documents, 'List<int>')[0].slug, 'csharp')
  assert.equal(searchBlogSections(documents, 'C#')[0].slug, 'csharp')
  assert.equal(searchBlogSections(documents, 'database')[0].slug, 'sql')
  assert.deepEqual(searchBlogSections(documents, '   '), [])
  assert.equal(searchBlogSections(documents, 'notes', '', 1).length, 1)
})

test('section indexing preserves duplicate heading IDs, inline text, code, and tab fallback content without executing expressions', async () => {
  const { compile } = await import('@mdx-js/mdx')
  const compiled = await compile(
    {
      path: '/project/app/blog/search-fixture/page.mdx',
      value:
        'export const secret = "metadata-token"\n\n# Title\n\nIntro text.\n\n## **Cache** & `SQL`\n\nBody one.\n\n### Cache & SQL\n\n```sql\nSELECT important_api;\n```\n\n<Tabs labels={["A", "B"]}>\n<Tab>\n\nFirst implementation.\n\n</Tab>\n<Tab>\n\nSecond implementation.\n\n</Tab>\n</Tabs>\n\n{dangerousCall()}\n\n#### Details\n\nA final detail.',
    },
    { rehypePlugins: [rehypeBlogPost] },
  )
  const sections = compiled.data.blogSections as BlogSearchDocument['sections']
  assert.deepEqual(
    sections.map((section) => section.id),
    ['', 'cache-sql', 'cache-sql-1', 'details'],
  )
  assert.equal(sections[1].title, 'Cache & SQL')
  assert.match(sections[2].content, /SELECT important_api;/)
  assert.match(sections[2].content, /First implementation/)
  assert.match(sections[2].content, /Second implementation/)
  assert.doesNotMatch(
    JSON.stringify(sections),
    /metadata-token|dangerousCall|labels=/,
  )
})

test('pagination models one indexed page fetch, including first, deep, partial and clamped pages', () => {
  assert.deepEqual(paginationWork(1, 20, 100_000), {
    page: 1,
    totalPages: 5000,
    offset: 0,
    returned: 20,
    offsetReads: 20,
    cursorReads: 20,
    first: 1,
    last: 20,
  })
  const deep = paginationWork(1000, 20, 100_000)
  assert.equal(deep.offsetReads, 20_000)
  assert.equal(deep.cursorReads, 20)
  assert.equal(deep.first, 19_981)
  const final = paginationWork(999, 10, 103)
  assert.equal(final.page, 11)
  assert.equal(final.returned, 3)
  assert.equal(final.last, 103)
  assert.equal(paginationWork(-1, 20, 100).page, 1)
  assert.throws(() => paginationWork(1, 0, 100), RangeError)
  assert.throws(() => paginationWork(Infinity, 20, 100), RangeError)
  assert.throws(() => paginationWork(1.5, 20, 100), RangeError)
})

test('reading positions reject corrupt, stale, future, and removed section data', () => {
  const now = Date.UTC(2026, 8, 16)
  const valid = { version: 1, sectionId: 'cursors', savedAt: now - 1000 }
  assert.deepEqual(
    parseReadingPosition(JSON.stringify(valid), ['cursors'], now),
    valid,
  )
  assert.equal(parseReadingPosition('{bad', ['cursors'], now), null)
  assert.equal(parseReadingPosition('null', ['cursors'], now), null)
  assert.equal(
    parseReadingPosition(JSON.stringify(valid), ['renamed'], now),
    null,
  )
  assert.equal(
    parseReadingPosition(
      JSON.stringify({ ...valid, version: 2 }),
      ['cursors'],
      now,
    ),
    null,
  )
  assert.equal(
    parseReadingPosition(
      JSON.stringify({ ...valid, savedAt: now - 91 * 86400000 }),
      ['cursors'],
      now,
    ),
    null,
  )
  assert.equal(
    parseReadingPosition(
      JSON.stringify({ ...valid, savedAt: now + 86400000 }),
      ['cursors'],
      now,
    ),
    null,
  )
  assert.notEqual(readingStorageKey('first'), readingStorageKey('second'))
})

test('reading paths have real articles, prerequisites and deterministic next steps', async () => {
  const index = await getIndex()
  const slugs = new Set(index.map((document) => document.slug))
  for (const path of readingPaths) {
    assert.ok(path.prerequisites.length > 0)
    assert.ok(path.steps.length >= 2)
    assert.equal(
      new Set(path.steps.map((step) => step.slug)).size,
      path.steps.length,
    )
    assert.ok(path.steps.every((step) => slugs.has(step.slug)))
  }
  const context = getArticleReadingPath(
    'difference-between-cluster-and-non-cluster-index',
  )!
  assert.equal(context.previous, undefined)
  assert.equal(context.next.slug, 'pagination-strategies-offset-vs-cursor')
  assert.equal(getArticleReadingPath(context.next.slug)?.next, undefined)
  assert.equal(getArticleReadingPath('missing'), null)
})

test('freshness labels have verification sections and only later editorial dates are shown', async () => {
  const index = await getIndex()
  for (const [slug, verification] of Object.entries(blogVerifications)) {
    const section = index
      .find((document) => document.slug === slug)
      ?.sections.find((section) => section.id === verification.sectionId)
    assert.ok(section, `verification destination: ${slug}`)
    assert.ok(section.content.includes(verification.environment))
    assert.ok(Number.isFinite(Date.parse(verification.checkedOn)))
  }
  assert.equal(meaningfulUpdatedDate('2026-03-13', '2026-09-16'), '2026-09-16')
  assert.equal(meaningfulUpdatedDate('2026-03-13', '2026-03-12'), undefined)
  assert.equal(
    meaningfulUpdatedDate('2026-03-13', '2026-03-13T18:00:00Z'),
    undefined,
  )
  assert.equal(meaningfulUpdatedDate('2026-03-13', 'invalid'), undefined)
  assert.equal(meaningfulUpdatedDate('2026-03-13'), undefined)
})
