export const READING_LIBRARY_KEY = 'blog-reading-library'

export interface ReadingEntry {
  savedAt?: number
  completedAt?: number
}

export type ReadingLibrary = Record<string, ReadingEntry>

export function parseReadingLibrary(raw: string | null): ReadingLibrary {
  if (!raw) return {}
  try {
    const value = JSON.parse(raw)
    if (
      value?.version !== 1 ||
      !value.entries ||
      typeof value.entries !== 'object' ||
      Array.isArray(value.entries)
    )
      return {}
    const result: ReadingLibrary = {}
    for (const [slug, entry] of Object.entries(value.entries)) {
      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
        !entry ||
        typeof entry !== 'object'
      )
        continue
      const valid: ReadingEntry = {}
      for (const field of ['savedAt', 'completedAt'] as const) {
        const date = (entry as ReadingEntry)[field]
        if (typeof date === 'number' && Number.isSafeInteger(date) && date > 0)
          valid[field] = date
      }
      if (valid.savedAt || valid.completedAt) result[slug] = valid
    }
    return result
  } catch {
    return {}
  }
}

export function toggleReadingEntry(
  library: ReadingLibrary,
  slug: string,
  field: keyof ReadingEntry,
  now = Date.now(),
): ReadingLibrary {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return library
  const next = { ...library }
  const entry = { ...next[slug] }
  if (entry[field]) delete entry[field]
  else entry[field] = now
  if (entry.savedAt || entry.completedAt) next[slug] = entry
  else delete next[slug]
  return next
}

export function completedPathCount(
  library: ReadingLibrary,
  slugs: readonly string[],
) {
  return [...new Set(slugs)].filter((slug) => library[slug]?.completedAt).length
}
