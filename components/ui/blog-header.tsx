import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import {
  formatBlogDate,
  meaningfulUpdatedDate,
  type BlogVerification,
} from '@/lib/blog-freshness'

interface BlogHeaderProps {
  datePublished: string
  dateModified?: string
  verification?: BlogVerification
  title: string
  description: string
  readingTime?: number
}

export function BlogHeader({
  datePublished,
  dateModified,
  verification,
  title,
  description,
  readingTime,
}: BlogHeaderProps) {
  const formattedDate = formatBlogDate(datePublished)
  const updated = meaningfulUpdatedDate(datePublished, dateModified)

  return (
    <header data-blog-header className="not-prose">
      <Link href="/blog" className="text-link mb-5">
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All writing
      </Link>

      <h1 className="page-title">{title}</h1>
      <p className="page-description mt-5">{description.trim()}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs leading-5 text-zinc-400">
        <time dateTime={datePublished}>{formattedDate}</time>
        {updated && (
          <>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <span>
              Updated <time dateTime={updated}>{formatBlogDate(updated)}</time>
            </span>
          </>
        )}
        {readingTime != null && readingTime > 0 && (
          <>
            <span aria-hidden="true" className="text-zinc-600">
              ·
            </span>
            <span>{readingTime} min read</span>
          </>
        )}
      </div>
      {verification && (
        <a
          href={`#${verification.sectionId}`}
          title={`${verification.scope} Checked ${formatBlogDate(verification.checkedOn)}.`}
          className="mt-3 inline-flex min-h-8 items-center gap-2 text-xs leading-5 text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-zinc-100"
        >
          <CheckCircle2
            aria-hidden="true"
            className="size-3.5 shrink-0 text-emerald-300/80"
          />
          Examples checked with {verification.environment}
        </a>
      )}
    </header>
  )
}
