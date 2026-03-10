'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { ArrowLeft, Clock, Calendar, ArrowUpRight, Hash } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-utils'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function getTotalReadingTime(posts: BlogPost[]) {
  return posts.reduce((acc, p) => acc + p.readingTime, 0)
}

function getAllTags(posts: BlogPost[]): string[] {
  const tagSet = new Set<string>()
  posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)))
  return Array.from(tagSet).sort()
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => getAllTags(posts), [posts])
  const totalReadingTime = useMemo(() => getTotalReadingTime(posts), [posts])

  const filtered = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags?.includes(activeTag)) : posts),
    [posts, activeTag],
  )

  const [featured, ...rest] = filtered

  return (
    <div className="min-h-screen pb-32">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-zinc-500 no-underline transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <div className="mb-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Blogging about backend engineering, system design, and scalable software.
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        Notes on backend systems, performance, and building software that scales.
      </p>
          </div>

          <div className="flex items-center gap-5 text-xs text-zinc-500">
            <div className="text-right">
              <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {posts.length}
              </div>
              <div>articles</div>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="text-right">
              <div className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                {totalReadingTime}
              </div>
              <div>min total</div>
            </div>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-zinc-100 dark:bg-zinc-800/60" />
      </div>

      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTag(null)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
              activeTag === null
                ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-200 text-zinc-500 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border border-zinc-200 text-zinc-500 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              <Hash className="h-2.5 w-2.5" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-zinc-500">
          No articles tagged &ldquo;{activeTag}&rdquo;.
        </p>
      )}

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="theme-card group mb-4 block rounded-2xl p-6 no-underline transition-all duration-300 hover:scale-[1.005]"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Latest
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
              <Calendar className="h-3 w-3" />
              {formatDate(featured.publishedTime)}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-bold leading-snug tracking-tight text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
              {featured.title}
            </h2>
            <ArrowUpRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {featured.description}
          </p>

          <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              {featured.readingTime} min read
            </span>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {rest.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group -mx-2 flex items-start gap-4 rounded-xl px-2 py-4 no-underline transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
            >
              <span className="mt-0.5 w-6 flex-shrink-0 select-none text-right font-mono text-xs tabular-nums text-zinc-300 dark:text-zinc-700">
                {String(index + 2).padStart(2, '0')}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                    {post.title}
                  </h3>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1 text-xs leading-relaxed text-zinc-500 line-clamp-1">
                  {post.description}
                </p>

                <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />
                    {formatDateShort(post.publishedTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {post.readingTime} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
