'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface BlogNavigationProps {
  previousPost?: {
    slug: string
    title: string
  }
  nextPost?: {
    slug: string
    title: string
  }
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) return null

  return (
    <nav className="mt-16 grid grid-cols-1 gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:grid-cols-2">
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
        >
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </div>
          <span className="font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">
            {previousPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      
      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 text-right transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50 sm:col-start-2"
        >
          <div className="flex items-center justify-end gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </div>
          <span className="font-medium text-zinc-900 group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400">
            {nextPost.title}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}
