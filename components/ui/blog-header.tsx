'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Share2, Check, Calendar, Clock } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface BlogHeaderProps {
  datePublished: string
  title: string
  readingTime?: number
  previousPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
}

export function BlogHeader({ datePublished, title, readingTime, previousPost, nextPost }: BlogHeaderProps) {


  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <>
      {/* Sticky top nav bar */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Link
          href="/blog"
          className="flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Blog
        </Link>

        <div className="flex items-center gap-1">
     

          <Link
            href={previousPost ? `/blog/${previousPost.slug}` : '#'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              previousPost
                ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                : 'pointer-events-none text-zinc-700'
            }`}
            title={previousPost?.title}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <Link
            href={nextPost ? `/blog/${nextPost.slug}` : '#'}
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              nextPost
                ? 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                : 'pointer-events-none text-zinc-700'
            }`}
            title={nextPost?.title}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Date + reading time below the article title */}
      <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <time dateTime={datePublished}>{formatDate(datePublished)}</time>
        </span>
        {readingTime && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {readingTime} min read
          </span>
        )}
      </div>
    </>
  )
}
