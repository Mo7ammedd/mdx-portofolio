import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BlogHeaderProps {
  datePublished: string
  title: string
  readingTime?: number
  previousPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
}

export function BlogHeader({ datePublished, readingTime }: BlogHeaderProps) {
  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div
      data-blog-header
      className="not-prose mb-7 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/[0.07] pb-5"
    >
      <Link
        href="/blog"
        className="inline-flex min-h-9 items-center gap-1.5 text-xs text-zinc-400 no-underline transition-colors hover:text-zinc-100 motion-reduce:transition-none"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All writing
      </Link>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs leading-5 text-zinc-400">
        <time dateTime={datePublished}>{formattedDate}</time>
        {readingTime != null && readingTime > 0 && (
          <>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <span>{readingTime} min read</span>
          </>
        )}
      </div>
    </div>
  )
}
