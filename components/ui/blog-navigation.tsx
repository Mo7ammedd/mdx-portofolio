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

const glassStyle = {
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 4px 32px rgba(0, 0, 0, 0.2)',
}

export function BlogNavigation({ previousPost, nextPost }: BlogNavigationProps) {
  if (!previousPost && !nextPost) return null

  return (
    <nav className="mt-16 grid grid-cols-1 gap-3 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:grid-cols-2">
      {previousPost ? (
        <Link
          href={`/blog/${previousPost.slug}`}
          className="group flex flex-col gap-2 rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]"
          style={glassStyle}
        >
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </div>
          <span className="text-sm font-medium text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 line-clamp-2">
            {previousPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group flex flex-col gap-2 rounded-xl p-4 text-right transition-all duration-200 hover:scale-[1.02] sm:col-start-2"
          style={glassStyle}
        >
          <div className="flex items-center justify-end gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-medium text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300 line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : null}
    </nav>
  )
}
