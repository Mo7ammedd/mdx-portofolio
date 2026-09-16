export const READING_SECTION_EVENT = 'blog-reading-section'
export const readingStorageKey = (slug: string) => `blog-reading:${slug}`

export interface ReadingPosition {
  version: 1
  sectionId: string
  savedAt: number
}

export function parseReadingPosition(
  raw: string | null,
  ids: readonly string[],
  now = Date.now(),
): ReadingPosition | null {
  if (!raw) return null
  try {
    const position = JSON.parse(raw) as Partial<ReadingPosition> | null
    if (
      !position ||
      position.version !== 1 ||
      typeof position.sectionId !== 'string' ||
      !ids.includes(position.sectionId) ||
      typeof position.savedAt !== 'number' ||
      !Number.isFinite(position.savedAt) ||
      position.savedAt > now + 300_000 ||
      now - position.savedAt > 90 * 24 * 60 * 60 * 1000
    )
      return null
    return position as ReadingPosition
  } catch {
    return null
  }
}
