import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement, Fragment, type ReactNode } from 'react'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'

import rehypeBlogPost from '../lib/rehype-blog-post.mjs'
import type { CompileOptions } from '@mdx-js/mdx'
import { CodeBlock } from '../components/ui/code-block'
import { Tabs, Tab } from '../components/ui/mdx-tabs'
import {
  TableOfContents,
  type BlogHeading,
} from '../components/ui/table-of-contents'

async function renderPost(
  source: string,
  path = '/project/app/blog/compiler-test/page.mdx',
  highlightCode = false,
) {
  const { compile, run } = await import('@mdx-js/mdx')
  const rehypePlugins: CompileOptions['rehypePlugins'] = [rehypeBlogPost]
  if (highlightCode) {
    const { default: prettyCode } = await import('rehype-pretty-code')
    rehypePlugins.unshift([prettyCode, { theme: 'github-dark' }])
  }
  const compiled = await compile(
    { value: source, path },
    { outputFormat: 'function-body', rehypePlugins },
  )
  const compiledPost = await run(compiled, runtime)
  let layout:
    | { slug: string; headings: BlogHeading[]; articleTitle: string }
    | undefined

  function BlogPostLayout({
    children,
    ...props
  }: {
    children?: ReactNode
    slug: string
    headings: BlogHeading[]
    articleTitle: string
  }) {
    layout = props
    return createElement(
      Fragment,
      null,
      props.articleTitle && createElement('h1', null, props.articleTitle),
      createElement(TableOfContents, { headings: props.headings }),
      createElement('article', null, children),
    )
  }

  const html = renderToStaticMarkup(
    createElement(compiledPost.default, {
      components: { BlogPostLayout, pre: CodeBlock, Tabs, Tab },
    }),
  )
  return { html, layout, metadata: compiledPost.metadata }
}

test('compiled articles render their table of contents without JavaScript and preserve metadata', async () => {
  const { html, layout, metadata } = await renderPost(
    [
      'export const metadata = { title: "Compiler test" }',
      '',
      '# Article title',
      '',
      '## **Cache** & `SQL`',
      '',
      '### [Query plans](https://example.com)',
      '',
      '#### Internal details',
      '',
      '```md',
      '## This is code, not a heading',
      '```',
    ].join('\n'),
  )

  assert.deepEqual(metadata, { title: 'Compiler test' })
  assert.deepEqual(layout, {
    slug: 'compiler-test',
    articleTitle: 'Article title',
    headings: [
      { id: 'cache-sql', text: 'Cache & SQL', level: 2 },
      { id: 'query-plans', text: 'Query plans', level: 3 },
    ],
  })
  assert.match(html, /<details[^>]*>/)
  assert.match(html, /href="#cache-sql"/)
  assert.match(html, /<h2 id="cache-sql">/)
  assert.match(html, /href="#query-plans"/)
  assert.match(html, /<h3 id="query-plans">/)
  assert.match(html, /<h4 id="internal-details">/)
  assert.doesNotMatch(html, /href="#internal-details"/)
  assert.doesNotMatch(html, /href="#this-is-code/)
})

test('the authored title is rendered once above the article, independently of the SEO title', async () => {
  const { html, layout, metadata } = await renderPost(
    'export const metadata = { title: "SEO title" }\n\n# **Cache** & `SQL`\n\nThe introduction.\n\n## Details',
  )
  assert.equal(layout?.articleTitle, 'Cache & SQL')
  assert.deepEqual(metadata, { title: 'SEO title' })
  assert.equal([...html.matchAll(/<h1>/g)].length, 1)
  assert.ok(html.indexOf('<h1>') < html.indexOf('<article>'))
  assert.match(html, /<article>\s*<p>The introduction\.<\/p>/)
})

test('code filenames and line metadata survive compilation without duplicate captions', async () => {
  const { html } = await renderPost(
    '# Code\n\n```sql title="posts.sql" {2} showLineNumbers\nSELECT id\nFROM posts;\n```',
    undefined,
    true,
  )
  assert.match(html, /Copy posts\.sql/)
  assert.equal([...html.matchAll(/>posts\.sql<\/span>/g)].length, 1)
  assert.doesNotMatch(html, /data-rehype-pretty-code-title/)
  assert.match(html, /data-highlighted-line=""/)
  assert.match(html, /data-line-numbers=""/)
  assert.match(html, /SELECT/)
})

test('every tab panel stays readable in the server-rendered fallback', async () => {
  const { html } = await renderPost(
    '# Examples\n\n<Tabs labels={["First", "Second"]}>\n<Tab>\n\nFirst implementation.\n\n</Tab>\n<Tab>\n\nSecond implementation.\n\n</Tab>\n</Tabs>',
  )
  assert.match(html, /First implementation\./)
  assert.match(html, /Second implementation\./)
  assert.match(html, /<div hidden="" role="tablist"/)
  assert.doesNotMatch(html, /<section[^>]*hidden/)
})

test('duplicate headings and existing numeric suffixes always have distinct destinations', async () => {
  const { html, layout } = await renderPost(
    '## Overview\n\n### Overview\n\n## Overview-1\n\n#### Overview\n\n## Overview',
  )
  const ids = [...html.matchAll(/<h[234] id="([^"]+)"/g)].map(
    (match) => match[1],
  )
  assert.deepEqual(ids, [
    'overview',
    'overview-1',
    'overview-1-1',
    'overview-2',
    'overview-3',
  ])
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(layout?.headings.every((heading) => ids.includes(heading.id)))

  const nextArticle = await renderPost(
    '## Overview',
    '/project/app/blog/another-article/page.mdx',
  )
  assert.equal(nextArticle.layout?.headings[0].id, 'overview')
  assert.equal(nextArticle.layout?.slug, 'another-article')
})

test('articles without sections omit the table of contents', async () => {
  const { html, layout } = await renderPost('# Title\n\nA short article.')
  assert.deepEqual(layout?.headings, [])
  assert.match(html, /<article>/)
  assert.doesNotMatch(html, /<details|On this page/)
})

test('heading fragments retain existing punctuation and inline-code behavior', async () => {
  const { layout } = await renderPost(
    '### 3. Factory-Based Middleware (`IMiddleware`)\n\n## C# & .NET\n\n## !!!',
  )
  assert.deepEqual(
    layout?.headings.map((heading) => heading.id),
    ['3-factory-based-middleware-imiddleware', 'c-net', 'section'],
  )
})

test('the layout transform is scoped to blog article routes', async () => {
  const { html, layout } = await renderPost(
    '## About',
    '/project/app/about/page.mdx',
  )
  assert.equal(layout, undefined)
  assert.match(html, /<h2>About<\/h2>/)
  assert.doesNotMatch(html, /<article|<details/)

  const windowsArticle = await renderPost(
    '## Windows paths',
    'C:\\project\\app\\blog\\windows-paths\\page.mdx',
  )
  assert.equal(windowsArticle.layout?.slug, 'windows-paths')
})
