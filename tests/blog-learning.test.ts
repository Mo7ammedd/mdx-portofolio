import assert from 'node:assert/strict'
import test from 'node:test'
import { matchNginxLocation, normalizedRequestPath } from '../lib/nginx-routing'
import {
  completedPathCount,
  parseReadingLibrary,
  toggleReadingEntry,
} from '../lib/reading-library'
import { buildRssFeed, renderBlogArticleForFeed } from '../lib/blog-feed'
import { collectBlogContent } from '../lib/blog-content.mjs'
import { blogExercises } from '../lib/blog-exercises.mjs'
import { blogGlossary } from '../lib/blog-glossary.mjs'

test('flat Nginx matching honors exact locations, longest prefixes and regex declaration order', () => {
  const cases: [string, boolean, string][] = [
    ['/health?check=ready', true, 'health'],
    ['/assets/logo.svg', true, 'assets'],
    ['/assets/logo.svg', false, 'static'],
    ['/api/users', true, 'api'],
    ['/api/users.css', true, 'static'],
    ['/api/v2/users.css', true, 'versioned-api'],
    ['/ASSETS/logo.PNG', true, 'static'],
    ['/apiary', true, 'fallback'],
    ['/health/', true, 'fallback'],
    ['/', true, 'fallback'],
  ]
  for (const [url, protectedPrefix, winner] of cases) {
    const result = matchNginxLocation(url, protectedPrefix)
    assert.equal(result.winner.id, winner, url)
    assert.ok(result.trace.length >= 2)
  }
  assert.ok(
    !matchNginxLocation('/assets/logo.svg').trace.some((step) =>
      step.label.startsWith('Test ~'),
    ),
  )
  assert.ok(
    !matchNginxLocation('/api/v2/users.css').trace.some((step) =>
      step.label.startsWith('Test ~*'),
    ),
  )
})

test('Nginx input normalization decodes before matching and rejects invalid paths without running requests', () => {
  assert.equal(
    normalizedRequestPath('/assets//icons/../logo%2Esvg?x=.php#ignored'),
    '/assets/logo.svg',
  )
  assert.equal(normalizedRequestPath('/api/users/..'), '/api/')
  assert.equal(
    normalizedRequestPath('https://example.test/api/%76%32/users?q=1'),
    '/api/v2/users',
  )
  assert.equal(matchNginxLocation('/%68ealth').winner.id, 'health')
  assert.equal(matchNginxLocation('/assets%2Flogo.svg').winner.id, 'assets')
  for (const value of [
    '',
    'assets/logo.svg',
    'javascript:alert(1)',
    '/%GG',
    '/%00',
    '/../health',
    '/a\\b',
    '/raw space',
  ]) {
    assert.throws(() => normalizedRequestPath(value), Error, value)
  }
})

test('bookmarks and completion survive independent toggles and unrelated path entries do not count', () => {
  const saved = toggleReadingEntry({}, 'indexing', 'savedAt', 100)
  const completed = toggleReadingEntry(saved, 'indexing', 'completedAt', 200)
  assert.deepEqual(saved, { indexing: { savedAt: 100 } })
  assert.deepEqual(completed.indexing, { savedAt: 100, completedAt: 200 })
  const unsaved = toggleReadingEntry(completed, 'indexing', 'savedAt', 300)
  assert.deepEqual(unsaved.indexing, { completedAt: 200 })
  assert.equal(
    completedPathCount({ ...unsaved, extra: { completedAt: 1 } }, [
      'indexing',
      'pagination',
      'indexing',
    ]),
    1,
  )
  assert.deepEqual(toggleReadingEntry(unsaved, 'indexing', 'completedAt'), {})
  assert.deepEqual(
    parseReadingLibrary(JSON.stringify({ version: 1, entries: completed })),
    completed,
  )
})

test('reading library ignores corrupt data while preserving valid saved and completed flags', () => {
  for (const raw of [
    'bad json',
    'null',
    '[]',
    '{"version":2,"entries":{}}',
    '{"version":1,"entries":[]}',
  ])
    assert.deepEqual(parseReadingLibrary(raw), {})
  assert.deepEqual(
    parseReadingLibrary(
      '{"version":1,"entries":{"good":{"savedAt":123,"completedAt":-1},"__proto__":{"savedAt":1},"bad":{"completedAt":"yes"},"empty":null,"also-good":{"completedAt":456}}}',
    ),
    { good: { savedAt: 123 }, 'also-good': { completedAt: 456 } },
  )
})

test('RSS parses titled fences, plain fences, native tables and Markdown without interpreting code as HTML', async () => {
  const html = await renderBlogArticleForFeed(
    [
      '# Article',
      '## Details',
      '```html title="demo.html" {1} showLineNumbers\n<script>alert("inside code")</script>\n```',
      '```\n1 < 2 && 3 > 2\n```',
      '1. First\n2. **Second**',
      '[Section](#details) and ![Diagram](/diagram.png)',
      '<table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>Value</td></tr></tbody></table>',
    ].join('\n\n'),
    'https://www.modev.me/blog/example',
  )
  assert.match(html, /<figcaption>demo.html<\/figcaption>/)
  assert.match(html, /<code class="language-html">/)
  assert.match(html, /inside code/)
  assert.doesNotMatch(html, /<script>|```|showLineNumbers/)
  assert.match(html, /<ol>\s*<li>First/)
  assert.match(html, /<strong>Second<\/strong>/)
  assert.match(html, /href="https:\/\/www.modev.me\/blog\/example#details"/)
  assert.match(html, /src="https:\/\/www.modev.me\/diagram.png"/)
  assert.match(html, /<table><thead><tr><th>Name/)
})

test('RSS expands MDX learning components and every tab without executing authored JavaScript', async () => {
  const html = await renderBlogArticleForFeed(
    [
      'import missing from "a-module-that-does-not-exist"',
      'export const metadata = (() => { throw new Error("must not run") })()',
      '# Article',
      '<Callout title="Remember">\n\nKeep this explanation.\n\n</Callout>',
      '<Steps>\n<Step title="First step">\n\nDo the work.\n\n</Step>\n</Steps>',
      '<Tabs label="Languages" labels={["C#", "SQL"]}>\n<Tab>\n\nFirst alternative.\n\n</Tab>\n<Tab>\n\nSecond alternative.\n\n</Tab>\n</Tabs>',
      '<Cover src="/diagram.png" alt="Diagram" caption="Caption preserved" />',
      'Read about <Term id="mvcc">MVCC</Term>.',
      '<Exercise id="boxing-copy" />',
      '<PaginationDemo />',
      '<NginxRoutingDemo />',
      '{(() => { throw new Error("must not run") })()}',
      '<script>alert("drop this")</script>',
      '<a href="javascript:alert(1)" onClick={missing}>Unsafe link</a>',
    ].join('\n\n'),
    'https://www.modev.me/blog/example',
  )
  for (const content of [
    'Keep this explanation.',
    'First step',
    'First alternative.',
    'Second alternative.',
    '<h4>C#</h4>',
    '<h4>SQL</h4>',
    'Caption preserved',
    'Glossary for this article',
    blogGlossary.mvcc.definition,
    'Answer: 42.',
    '20,000',
    'Nginx location matching example',
  ])
    assert.ok(html.includes(content), content)
  assert.doesNotMatch(
    html,
    /must not run|a-module-that-does-not-exist|javascript:|onClick|<script|<Callout|<Tabs|<Exercise|<Term|<Cover/,
  )
})

test('RSS preserves stable article dates and safely splits CDATA terminators', () => {
  const rss = buildRssFeed([
    {
      post: {
        slug: 'example',
        title: 'A ]]> B',
        description: 'C & D',
        publishedTime: '2026-01-01T00:00:00Z',
        modifiedTime: '2026-09-17T00:00:00Z',
        readingTime: 5,
        tags: ['C# & .NET'],
      },
      html: '<p>Literal ]]&gt; text.</p>',
    },
  ])
  assert.match(rss, /<pubDate>Thu, 01 Jan 2026 00:00:00 GMT<\/pubDate>/)
  assert.match(
    rss,
    /<lastBuildDate>Thu, 17 Sep 2026 00:00:00 GMT<\/lastBuildDate>/,
  )
  assert.match(rss, /<atom:updated>2026-09-17T00:00:00.000Z<\/atom:updated>/)
  assert.match(rss, /<category>C# &amp; .NET<\/category>/)
  assert.ok(rss.includes('A ]]]]><![CDATA[> B'))
  assert.doesNotMatch(rss, /<enclosure/)
})

test('search includes referenced exercise content and glossary definitions under the authored section', async () => {
  const { compile } = await import('@mdx-js/mdx')
  let content: ReturnType<typeof collectBlogContent> | undefined
  await compile(
    '## Practice\n\n<Term id="mvcc" />\n\n<Exercise id="boxing-copy" />',
    {
      rehypePlugins: [
        () => (tree) => {
          content = collectBlogContent(tree)
        },
      ],
    },
  )
  assert.equal(content?.sections[1].id, 'practice')
  assert.ok(content?.sections[1].content.includes(blogGlossary.mvcc.definition))
  assert.ok(
    content?.sections[1].content.includes(
      blogExercises['boxing-copy'].question,
    ),
  )
  assert.ok(content?.sections[1].content.includes('Console.WriteLine'))
})
