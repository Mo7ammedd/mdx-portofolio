import {
  collectBlogContent,
  getNodeText as headingText,
} from './blog-content.mjs'

function visit(node, callback) {
  callback(node)
  node.children?.forEach((child) => visit(child, callback))
}

function headingsAttribute(headings) {
  return {
    type: 'mdxJsxAttribute',
    name: 'headings',
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(headings),
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ArrayExpression',
                elements: headings.map((heading) => ({
                  type: 'ObjectExpression',
                  properties: Object.entries(heading).map(([key, value]) => ({
                    type: 'Property',
                    kind: 'init',
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: { type: 'Literal', value: key },
                    value: { type: 'Literal', value },
                  })),
                })),
              },
            },
          ],
        },
      },
    },
  }
}

/**
 * Compile blog heading IDs and navigation together, then pass them to the
 * server layout registered in mdx-components.tsx. Imports and metadata exports
 * stay at the module level; no article data needs a client-side pathname lookup.
 *
 * @type {import('unified').Plugin<[], import('hast').Root>}
 */
export default function rehypeBlogPost() {
  return (tree, file) => {
    const slug = file.path
      ?.replaceAll('\\', '/')
      .match(/(?:^|\/)app\/blog\/([^/]+)\/page\.mdx$/)?.[1]
    if (!slug) return

    visit(tree, (node) => {
      // Put pretty-code's optional filename in the copy toolbar, so it has
      // one label instead of a separate caption above the same code block.
      if (
        node.type === 'element' &&
        node.tagName === 'figure' &&
        'data-rehype-pretty-code-figure' in node.properties
      ) {
        const title = node.children.find(
          (child) =>
            child.type === 'element' &&
            'data-rehype-pretty-code-title' in child.properties,
        )
        const pre = node.children.find(
          (child) => child.type === 'element' && child.tagName === 'pre',
        )
        if (title && pre) {
          pre.properties['data-filename'] = headingText(title)
          node.children = node.children.filter((child) => child !== title)
        }
      }
    })

    const { headings, sections } = collectBlogContent(tree)
    file.data.blogSections = sections

    const declarations = tree.children.filter(
      (node) => node.type === 'mdxjsEsm',
    )
    const content = tree.children.filter((node) => node.type !== 'mdxjsEsm')
    const titleIndex = content.findIndex(
      (node) => node.type === 'element' && node.tagName === 'h1',
    )
    const articleTitle =
      titleIndex >= 0 ? headingText(content[titleIndex]).trim() : ''
    if (articleTitle) content.splice(titleIndex, 1)
    tree.children = [
      ...declarations,
      {
        type: 'mdxJsxFlowElement',
        name: 'BlogPostLayout',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'slug', value: slug },
          {
            type: 'mdxJsxAttribute',
            name: 'articleTitle',
            value: articleTitle,
          },
          headingsAttribute(headings),
        ],
        children: content,
      },
    ]
  }
}
