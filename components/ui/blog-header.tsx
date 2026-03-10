'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'

interface BlogHeaderProps {
  datePublished: string
  title: string
  readingTime?: number
  previousPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
}

export function BlogHeader({ datePublished, readingTime, previousPost, nextPost }: BlogHeaderProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-6 py-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-sm text-zinc-500 no-underline transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Blog
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={previousPost ? `/blog/${previousPost.slug}` : '#'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              previousPost
                ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                : 'pointer-events-none text-zinc-300 dark:text-zinc-700'
            }`}
            title={previousPost?.title}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link
            href={nextPost ? `/blog/${nextPost.slug}` : '#'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              nextPost
                ? 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                : 'pointer-events-none text-zinc-300 dark:text-zinc-700'
            }`}
            title={nextPost?.title}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={datePublished}>{formatDate(datePublished)}</time>
        </span>
        {readingTime && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        )}
      </div>
    </>
  )
}
