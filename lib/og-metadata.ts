export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

export const DEFAULT_OG_IMAGE = '/opengraph-image'

export function getBlogOGImagePath(slug: string): string {
  return `/og/${encodeURIComponent(slug)}`
}
