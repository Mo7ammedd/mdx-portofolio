import type { Element, Properties, Root, Text } from 'hast'
import type { BlogPost } from './blog-utils'
import { collectBlogContent } from './blog-content.mjs'
import { blogGlossary } from './blog-glossary.mjs'
import { blogExercises } from './blog-exercises.mjs'
import { matchNginxLocation, nginxLocations } from './nginx-routing'
import { WEBSITE_URL } from './constants'

type HtmlNode = Element | Text
interface StaticExpression {
  type: string
  value?: unknown
  body?: StaticExpression[]
  expression?: StaticExpression
  elements?: StaticExpression[]
}
interface ParsedNode {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  data?: { meta?: string }
  attributes?: {
    name?: string
    value?: string | null | { data?: { estree?: StaticExpression } }
  }[]
  children?: ParsedNode[]
}

const text = (value: string): Text => ({ type: 'text', value })
const element = (
  tagName: string,
  children: HtmlNode[] = [],
  properties: Properties = {},
): Element => ({ type: 'element', tagName, properties, children })
const paragraph = (value: string) => element('p', [text(value)])
const allowedTags = new Set(
  'a abbr b blockquote br caption code col colgroup dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i img kbd li mark ol p pre s samp section small span strong sub summary sup table tbody td th thead tr u ul'.split(
    ' ',
  ),
)
const droppedTags = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
])

function staticValue(node?: StaticExpression): unknown {
  if (node?.type === 'Literal') return node.value
  if (node?.type === 'ArrayExpression') return node.elements?.map(staticValue)
  return undefined
}

function attribute(node: ParsedNode, name: string): unknown {
  if (node.type === 'element') return node.properties?.[name]
  const attr = node.attributes?.find((item) => item.name === name)
  if (!attr) return undefined
  if (typeof attr.value === 'string') return attr.value
  if (attr.value === null) return true
  return staticValue(attr.value?.data?.estree?.body?.[0]?.expression)
}

function stringAttribute(node: ParsedNode, name: string) {
  const value = attribute(node, name)
  return typeof value === 'string' ? value : ''
}

function absoluteUrl(value: string, base: string, image = false) {
  if (!value) return undefined
  try {
    const url = new URL(value, base)
    if (
      ['http:', 'https:'].includes(url.protocol) ||
      (!image && url.protocol === 'mailto:')
    )
      return url.href
  } catch {}
  return undefined
}

/** Parse MDX without evaluating imports, JSX expressions, or article code. */
export async function renderBlogArticleForFeed(
  source: string,
  articleUrl: string,
): Promise<string> {
  const [{ compile }, { toHtml }] = await Promise.all([
    import('@mdx-js/mdx'),
    import('hast-util-to-html'),
  ])
  let html = ''
  const glossary = new Set<string>()

  function convertChildren(node: ParsedNode): HtmlNode[] {
    return node.children?.flatMap(convert) ?? []
  }

  function convert(node: ParsedNode): HtmlNode[] {
    if (node.type === 'text') return [text(node.value ?? '')]
    if (
      [
        'mdxjsEsm',
        'mdxFlowExpression',
        'mdxTextExpression',
        'comment',
      ].includes(node.type)
    )
      return []
    if (node.type === 'root') return convertChildren(node)
    const name = node.tagName ?? node.name ?? ''
    if (droppedTags.has(name)) return []

    if (name === 'Term') {
      const id = stringAttribute(node, 'id')
      const term = blogGlossary[id]
      if (!term) return convertChildren(node)
      glossary.add(id)
      return [
        element(
          'abbr',
          node.children?.length ? convertChildren(node) : [text(term.term)],
          { title: term.definition },
        ),
      ]
    }
    if (name === 'Exercise') {
      const exercise = blogExercises[stringAttribute(node, 'id')]
      if (!exercise) return []
      const answer = exercise.options.find(
        (option) => option.id === exercise.answer,
      )!
      return [
        element('section', [
          element('h4', [text(exercise.title)]),
          paragraph(exercise.question),
          ...(exercise.code
            ? [element('pre', [element('code', [text(exercise.code)])])]
            : []),
          element(
            'ol',
            exercise.options.map((option) =>
              element('li', [text(option.text)]),
            ),
          ),
          element('p', [
            element('strong', [text(`Answer: ${answer.text}.`)]),
            text(` ${answer.explanation} ${exercise.explanation}`),
          ]),
          element('p', [
            element('a', [text('Revisit the explanation')], {
              href: absoluteUrl(exercise.review, articleUrl),
            }),
          ]),
        ]),
      ]
    }
    if (name === 'PaginationDemo')
      return [
        element('section', [
          element('h4', [text('Pagination scan model')]),
          paragraph(
            'At page 1,000 with 20 rows per page, OFFSET visits 20,000 index entries. A cursor reads 20 entries after its index seek. This assumes a stable dataset, a matching index, and an already-known cursor; it is not a timing benchmark.',
          ),
          element('p', [
            element('a', [text('Try the interactive pagination model')], {
              href: `${articleUrl}#try-the-pagination-scan-model`,
            }),
          ]),
        ]),
      ]
    if (name === 'NginxRoutingDemo') {
      const example = matchNginxLocation('/assets/logo.svg')
      return [
        element('section', [
          element('h4', [text('Nginx location matching example')]),
          paragraph(
            'Request: /assets/logo.svg. These are flat locations on a case-sensitive server, with default slash merging and no rewrites.',
          ),
          element('pre', [
            element('code', [
              text(
                nginxLocations()
                  .map((rule) => `location ${rule.modifier} ${rule.pattern}`)
                  .join('\n'),
              ),
            ]),
          ]),
          element(
            'ol',
            example.trace.map((step) =>
              element('li', [text(`${step.label}: ${step.detail}`)]),
            ),
          ),
          paragraph(
            'Without ^~ on /assets/, the static-file regex wins for this request.',
          ),
          element('p', [
            element('a', [text('Try the Nginx routing playground')], {
              href: `${articleUrl}#try-location-matching`,
            }),
          ]),
        ]),
      ]
    }
    if (name === 'Cover' || name === 'img') {
      const src = absoluteUrl(stringAttribute(node, 'src'), articleUrl, true)
      const alt = stringAttribute(node, 'alt')
      if (!src) return alt ? [text(alt)] : []
      const image = element('img', [], {
        src,
        alt,
        style: 'max-width:100%;height:auto',
      })
      const caption = stringAttribute(node, 'caption')
      return name === 'Cover'
        ? [
            element('figure', [
              image,
              ...(caption ? [element('figcaption', [text(caption)])] : []),
            ]),
          ]
        : [image]
    }
    if (name === 'Callout')
      return [
        element('blockquote', [
          element('p', [
            element('strong', [text(stringAttribute(node, 'title') || 'Note')]),
          ]),
          ...convertChildren(node),
        ]),
      ]
    if (name === 'Steps') return [element('ol', convertChildren(node))]
    if (name === 'Step')
      return [
        element('li', [
          element('p', [
            element('strong', [text(stringAttribute(node, 'title'))]),
          ]),
          ...convertChildren(node),
        ]),
      ]
    if (name === 'Tabs') {
      const labels = attribute(node, 'labels')
      let index = 0
      const children =
        node.children?.flatMap((child) => {
          if (child.name !== 'Tab') return convert(child)
          const label =
            Array.isArray(labels) && typeof labels[index] === 'string'
              ? labels[index]
              : `Example ${index + 1}`
          index += 1
          return [
            element('section', [
              element('h4', [text(label)]),
              ...convertChildren(child),
            ]),
          ]
        }) ?? []
      return [
        element('section', [
          element('h3', [
            text(stringAttribute(node, 'label') || 'Alternative examples'),
          ]),
          ...children,
        ]),
      ]
    }
    if (!allowedTags.has(name)) return convertChildren(node)

    const props: Properties = {}
    for (const key of ['id', 'title', 'scope'] as const) {
      const value = stringAttribute(node, key)
      if (value) props[key] = value
    }
    for (const key of ['colSpan', 'rowSpan', 'start'] as const) {
      const value = Number(attribute(node, key))
      if (Number.isSafeInteger(value) && value > 0) props[key] = value
    }
    if (name === 'a') {
      props.href = absoluteUrl(stringAttribute(node, 'href'), articleUrl)
      if (!props.href) return convertChildren(node)
    }
    if (name === 'code') {
      const classes = attribute(node, 'className')
      if (Array.isArray(classes))
        props.className = classes.filter(
          (value): value is string =>
            typeof value === 'string' && /^language-[\w-]+$/.test(value),
        )
    }
    const converted = element(name, convertChildren(node), props)
    if (name === 'pre') {
      const meta = node.children?.find((child) => child.tagName === 'code')
        ?.data?.meta
      const title = meta?.match(/\btitle=(?:"([^"]+)"|'([^']+)')/)
      if (title)
        return [
          element('figure', [
            element('figcaption', [text(title[1] ?? title[2])]),
            converted,
          ]),
        ]
    }
    return [converted]
  }

  await compile(source, {
    rehypePlugins: [
      () => (tree: Root) => {
        collectBlogContent(tree)
        const children = convertChildren(tree as unknown as ParsedNode)
        if (glossary.size)
          children.push(
            element('section', [
              element('h2', [text('Glossary for this article')]),
              element(
                'dl',
                [...glossary].flatMap((id) => {
                  const term = blogGlossary[id]
                  return [
                    element('dt', [element('strong', [text(term.term)])]),
                    element('dd', [
                      paragraph(term.definition),
                      paragraph(term.example),
                    ]),
                  ]
                }),
              ),
            ]),
          )
        html = toHtml({ type: 'root', children }, { allowDangerousHtml: false })
      },
    ],
  })
  return html
}

function xmlText(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '')
    .replace(
      /[&<>"']/g,
      (character) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[character]!,
    )
}

function cdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

export function buildRssFeed(articles: { post: BlogPost; html: string }[]) {
  const latest = new Date(
    Math.max(
      0,
      ...articles.map(({ post }) =>
        Math.max(
          Date.parse(post.publishedTime),
          Date.parse(post.modifiedTime ?? post.publishedTime),
        ),
      ),
    ),
  )
  const items = articles
    .map(({ post, html }) => {
      const url = `${WEBSITE_URL}/blog/${post.slug}`
      const image = absoluteUrl(
        post.image ?? '/opengraph-image',
        WEBSITE_URL,
        true,
      )
      const content = `${image ? `<img src="${xmlText(image)}" alt="${xmlText(post.title)}" style="max-width:100%;height:auto" />` : ''}${html}<hr /><p><a href="${xmlText(url)}">Read on modev.me</a> · ${post.readingTime} min read</p>`
      return `<item>
      <title>${cdata(post.title)}</title>
      <description>${cdata(post.description)}</description>
      <content:encoded>${cdata(content)}</content:encoded>
      <link>${xmlText(url)}</link>
      <guid isPermaLink="true">${xmlText(url)}</guid>
      <pubDate>${new Date(post.publishedTime).toUTCString()}</pubDate>
      <atom:updated>${new Date(post.modifiedTime ?? post.publishedTime).toISOString()}</atom:updated>
      ${(post.tags ?? []).map((tag) => `<category>${xmlText(tag)}</category>`).join('\n')}
      <author>mohammedmostafanazih@gmail.com (Mohammed Mostafa)</author>
    </item>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mohammed Mostafa's Blog</title>
    <description>Articles on backend engineering, databases, networking, and operating systems.</description>
    <link>${WEBSITE_URL}/blog</link>
    <language>en</language>
    <lastBuildDate>${latest.toUTCString()}</lastBuildDate>
    <atom:link href="${WEBSITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image><url>${WEBSITE_URL}/avatar.jpg</url><title>Mohammed Mostafa's Blog</title><link>${WEBSITE_URL}/blog</link><width>144</width><height>144</height></image>
    ${items}
  </channel>
</rss>`
}
