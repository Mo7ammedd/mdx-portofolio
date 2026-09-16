export interface BlogSearchSection {
  id: string
  title: string
  content: string
}

export interface BlogSearchDocument {
  slug: string
  title: string
  description: string
  tags: string[]
  sections: BlogSearchSection[]
}

export interface BlogSearchResult {
  slug: string
  articleTitle: string
  sectionId: string
  sectionTitle: string
  excerpt: string
}

export function searchTerms(query: string) {
  return [
    ...new Set(query.trim().toLowerCase().split(/\s+/).filter(Boolean)),
  ].slice(0, 12)
}

function excerptFor(content: string, terms: string[]) {
  const lower = content.toLowerCase()
  const positions = terms
    .map((term) => lower.indexOf(term))
    .filter((position) => position >= 0)
  let start = positions.length ? Math.max(0, Math.min(...positions) - 60) : 0
  if (start > 0) start = content.indexOf(' ', start) + 1 || start
  const end = Math.min(content.length, start + 220)
  return `${start ? '…' : ''}${content.slice(start, end).trim()}${end < content.length ? '…' : ''}`
}

export function searchBlogSections(
  documents: readonly BlogSearchDocument[],
  query: string,
  topic = '',
  limit = 24,
): BlogSearchResult[] {
  const terms = searchTerms(query)
  if (!terms.length || limit <= 0) return []
  const matches: (BlogSearchResult & { score: number })[] = []

  for (const document of documents) {
    if (topic && !document.tags.includes(topic)) continue
    const metadata =
      `${document.title} ${document.description} ${document.tags.join(' ').replaceAll('-', ' ')}`.toLowerCase()
    const sectionMatches = document.sections
      .flatMap((section) => {
        const title = section.title.toLowerCase()
        const body = section.content.toLowerCase()
        if (
          !terms.every((term) =>
            `${title} ${body} ${metadata}`.includes(term),
          ) ||
          !terms.some((term) => `${title} ${body}`.includes(term))
        )
          return []
        const score =
          terms.reduce(
            (total, term) =>
              total +
              (title.includes(term) ? 12 : 0) +
              (body.includes(term) ? 3 : 0),
            0,
          ) + (title.includes(query.trim().toLowerCase()) ? 8 : 0)
        return [
          {
            slug: document.slug,
            articleTitle: document.title,
            sectionId: section.id,
            sectionTitle: section.title,
            excerpt: excerptFor(section.content || document.description, terms),
            score,
          },
        ]
      })
      .sort((a, b) => b.score - a.score)

    // Keep broad searches useful: a few relevant sections from each article.
    if (sectionMatches.length) matches.push(...sectionMatches.slice(0, 3))
    else if (terms.every((term) => metadata.includes(term))) {
      matches.push({
        slug: document.slug,
        articleTitle: document.title,
        sectionId: '',
        sectionTitle: 'Article overview',
        excerpt: document.description,
        score: 1,
      })
    }
  }

  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ slug, articleTitle, sectionId, sectionTitle, excerpt }) => ({
      slug,
      articleTitle,
      sectionId,
      sectionTitle,
      excerpt,
    }))
}
