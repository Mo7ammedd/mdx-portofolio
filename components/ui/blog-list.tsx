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
      {/* Back link */}
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100 no-underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Writing
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              Thoughts on backend engineering, system design &amp; the craft.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 text-xs text-zinc-500 dark:text-zinc-500">
            <div className="text-right">
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {posts.length}
              </div>
              <div>articles</div>
            </div>
            <div
              className="h-8 w-px"
              style={{ background: 'rgba(161,161,170,0.2)' }}
            />
            <div className="text-right">
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {totalReadingTime}
              </div>
              <div>min total</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-6 h-px w-full"
          style={{ background: 'rgba(161,161,170,0.15)' }}
        />
      </div>

      {/* ── Tag filter ── */}
      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
              activeTag === null
                ? 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
            style={
              activeTag !== null
                ? {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }
                : {}
            }
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
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
              style={
                activeTag !== tag
                  ? {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }
                  : {}
              }
            >
              <Hash className="h-2.5 w-2.5" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* ── No results ── */}
      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-zinc-500">
          No articles tagged &ldquo;{activeTag}&rdquo;.
        </p>
      )}

      {/* ── Featured / latest post ── */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mb-6 block rounded-2xl p-6 transition-all duration-300 hover:scale-[1.005] no-underline"
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.25)',
          }}
        >
          {/* Latest badge + date row */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(228,228,231,0.8)',
              }}
            >
              Latest
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Calendar className="h-3 w-3" />
              {formatDate(featured.publishedTime)}
            </span>
          </div>

          {/* Title + arrow */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
              {featured.title}
            </h2>
            <ArrowUpRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-zinc-600 dark:text-zinc-400 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
            {featured.description}
          </p>

          {/* Footer row */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {featured.readingTime} min read
              </span>
            </div>
            {featured.tags && featured.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {featured.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(161,161,170,1)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      )}

      {/* ── Rest of posts ── */}
      {rest.length > 0 && (
        <div className="flex flex-col divide-y"
          style={{ borderColor: 'rgba(161,161,170,0.1)' }}>
          {rest.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-5 py-5 transition-all duration-200 hover:bg-white/[0.02] rounded-xl px-2 -mx-2 no-underline"
            >
              {/* Index number */}
              <span
                className="mt-0.5 w-6 flex-shrink-0 text-right text-xs font-mono tabular-nums text-zinc-600 dark:text-zinc-600 select-none pt-0.5"
              >
                {String(index + 2).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-100 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                    {post.title}
                  </h3>
                  <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-600 dark:text-zinc-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500 line-clamp-1">
                  {post.description}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-600">
                    <Calendar className="h-2.5 w-2.5" />
                    {formatDateShort(post.publishedTime)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-600">
                    <Clock className="h-2.5 w-2.5" />
                    {post.readingTime} min
                  </span>
                  {post.tags?.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(113,113,122,1)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
