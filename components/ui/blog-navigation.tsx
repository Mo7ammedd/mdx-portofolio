'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface BlogNavigationProps {
  previousPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) return null

  return (
    <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:grid-cols-2">
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="theme-card group flex flex-col gap-2 rounded-xl p-4 no-underline transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 dark:text-zinc-500">
            <ArrowLeft className="h-3.5 w-3.5" />
            Previous
          </div>
          <span className="text-sm font-medium leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 line-clamp-2">
            {previousPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="theme-card group flex flex-col gap-2 rounded-xl p-4 no-underline text-right transition-all duration-200 hover:scale-[1.02] sm:col-start-2"
        >
          <div className="flex items-center justify-end gap-2 font-mono text-xs text-zinc-400 dark:text-zinc-500">
            Next
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}
