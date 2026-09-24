import { slugifyHeading } from './heading-slug.mjs'
import { blogExercises } from './blog-exercises.mjs'
import { blogGlossary } from './blog-glossary.mjs'

export function getNodeText(node) {
  if (node.type === 'text') return node.value
  if (node.name === 'Term' && !node.children?.length) {
    const id = node.attributes?.find(
      (attribute) => attribute.name === 'id',
    )?.value
    return typeof id === 'string' ? (blogGlossary[id]?.term ?? '') : ''
  }
  return node.children?.map(getNodeText).join('') ?? ''
}

/** One source of heading IDs for the rendered article, contents, and search. */
export function collectBlogContent(tree) {
  const headings = []
  const sections = [{ id: '', title: 'Introduction', content: '' }]
  const usedIds = new Set()
  let current = sections[0]

  function visit(node) {
    if (
      ['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression'].includes(node.type)
    )
      return

    if (node.type === 'element' && /^h[1-4]$/.test(node.tagName)) {
      const text = getNodeText(node).trim()
      if (node.tagName === 'h1') return
      const baseId = node.properties.id || slugifyHeading(text) || 'section'
      let id = baseId
      let suffix = 1
      while (usedIds.has(id)) id = `${baseId}-${suffix++}`
      usedIds.add(id)
      node.properties.id = id
      const level = Number(node.tagName[1])
      if (level <= 3 && text) headings.push({ id, text, level })
      current = { id, title: text || 'Section', content: '' }
      sections.push(current)
      return
    }

    const reference = node.attributes?.find(
      (attribute) => attribute.name === 'id',
    )?.value
    if (node.name === 'Exercise' && typeof reference === 'string') {
      const exercise = blogExercises[reference]
      if (exercise)
        current.content += ` ${[exercise.title, exercise.question, exercise.code ?? '', ...exercise.options.flatMap((option) => [option.text, option.explanation]), exercise.explanation].join(' ')} `
    }
    if (
      node.name === 'Term' &&
      typeof reference === 'string' &&
      blogGlossary[reference]
    ) {
      current.content += `${getNodeText(node)} (${blogGlossary[reference].definition}) `
      return
    }
    if (node.type === 'text') current.content += node.value
    if (node.type === 'element' && node.tagName === 'img') {
      current.content += ` ${node.properties.alt || ''} `
    }
    if (node.type === 'mdxJsxFlowElement') {
      // Index authored labels and captions, never executable JSX expressions.
      for (const name of ['title', 'caption']) {
        const attribute = node.attributes?.find(
          (attribute) => attribute.name === name,
        )
        if (typeof attribute?.value === 'string')
          current.content += ` ${attribute.value} `
      }
    }
    node.children?.forEach(visit)
    if (
      node.type === 'mdxJsxFlowElement' ||
      (node.type === 'element' &&
        ['p', 'pre', 'li', 'tr', 'td', 'th', 'br', 'figure'].includes(
          node.tagName,
        ))
    ) {
      current.content += ' '
    }
  }

  visit(tree)
  for (const section of sections)
    section.content = section.content.replace(/\s+/g, ' ').trim()
  return { headings, sections }
}
