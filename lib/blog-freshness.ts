export interface BlogVerification {
  environment: string
  checkedOn: string
  scope: string
  sectionId: string
}

// Add a record only after running the scoped examples. Reproduction steps and
// observed runtime versions live in docs/verification/2026-09-16.md.
export const blogVerifications: Record<string, BlogVerification> = {
  'pagination-strategies-offset-vs-cursor': {
    environment: 'PostgreSQL 18.6',
    checkedOn: '2026-09-16',
    scope:
      'Composite cursor results across tied timestamps, partial pages, and cursor exhaustion.',
    sectionId: 'verified-examples',
  },
  'boxing-and-unboxing-in-csharp': {
    environment: '.NET 10.0.12',
    checkedOn: '2026-09-16',
    scope:
      'Value copying, exact-type unboxing, invalid casts, and collection values.',
    sectionId: 'verified-examples',
  },
  '3-ways-to-build-custom-middleware-in-aspnet-core': {
    environment: 'ASP.NET Core 10.0.12',
    checkedOn: '2026-09-16',
    scope:
      'Response timing header, middleware order, conventional activation, and transient IMiddleware activation.',
    sectionId: 'verified-examples',
  },
}

export function meaningfulUpdatedDate(published: string, modified?: string) {
  if (!modified) return undefined
  const publishedTime = Date.parse(published)
  const modifiedTime = Date.parse(modified)
  if (
    !Number.isFinite(publishedTime) ||
    !Number.isFinite(modifiedTime) ||
    modifiedTime <= publishedTime ||
    new Date(publishedTime).toISOString().slice(0, 10) ===
      new Date(modifiedTime).toISOString().slice(0, 10)
  )
    return undefined
  return modified
}

export function formatBlogDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
