'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Share2, Check, Calendar } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface BlogHeaderProps {
  datePublished: string
  title: string
  previousPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
}

export function BlogHeader({ datePublished, title, previousPost, nextPost }: BlogHeaderProps) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const url = `https://www.modev.me${pathname}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
          <button
            onClick={handleShare}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
            title="Copy link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
          </button>

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

      {/* Date line under the article title */}
      <div className="mb-8 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        <Calendar className="h-4 w-4" />
        <time dateTime={datePublished}>{formatDate(datePublished)}</time>
      </div>
    </>
  )
}
