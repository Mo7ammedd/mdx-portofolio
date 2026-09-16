'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Rss, Search } from 'lucide-react'

import type { BlogPost } from '@/lib/blog-utils'
import { BlogSearchResults } from './blog-search-results'
import { meaningfulUpdatedDate } from '@/lib/blog-freshness'

const TOPIC_LABELS: Record<string, string> = {
  'aspnet-core': 'ASP.NET Core',
  'b-tree': 'B-tree',
  'cpu-scheduling': 'CPU scheduling',
  csharp: 'C#',
  dotnet: '.NET',
  devops: 'DevOps',
  nginx: 'Nginx',
  postgresql: 'PostgreSQL',
  rust: 'Rust',
  sql: 'SQL',
  'sql-server': 'SQL Server',
  tcp: 'TCP',
  udp: 'UDP',
}

function formatTopic(topic: string) {
  const label = topic.replaceAll('-', ' ')
  return TOPIC_LABELS[topic] ?? label.charAt(0).toUpperCase() + label.slice(1)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState('')
  const [activeTopic, setActiveTopic] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const topics = useMemo(
    () =>
      [...new Set(posts.flatMap((post) => post.tags ?? []))].sort((a, b) =>
        formatTopic(a).localeCompare(formatTopic(b)),
      ),
    [posts],
  )

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

    return posts.filter((post) => {
      if (activeTopic && !post.tags?.includes(activeTopic)) return false

      const searchable = [
        post.title,
        post.description,
        ...(post.tags ?? []).flatMap((tag) => [tag, formatTopic(tag)]),
      ]
        .join(' ')
        .toLowerCase()

      return terms.every((term) => searchable.includes(term))
    })
  }, [posts, query, activeTopic])

  const hasFilters = query.trim().length > 0 || activeTopic !== ''
  const clearFilters = () => {
    setQuery('')
    setActiveTopic('')
    searchRef.current?.focus()
  }

  return (
    <main aria-labelledby="writing-title">
      <div className="mb-8">
        <p className="section-heading mb-4">Notes & ideas</p>
        <div className="flex items-center justify-between gap-4">
          <h1
            id="writing-title"
            className="text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
          >
            Writing
          </h1>
          <a
            href="/blog/rss.xml"
            className="text-link"
            aria-label="Subscribe to the blog via RSS"
          >
            <Rss aria-hidden="true" className="size-3.5" />
            RSS
          </a>
        </div>
        <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-[15px]">
          Notes on backend engineering, systems, and the details behind reliable
          software.
        </p>
        <Link href="/blog/paths" className="text-link mt-2">
          Explore guided reading paths{' '}
          <ArrowUpRight aria-hidden="true" className="size-3" />
        </Link>
      </div>

      {posts.length > 0 && (
        <form
          role="search"
          aria-label="Find articles"
          onSubmit={(event) => event.preventDefault()}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative min-w-0 flex-1">
            <label htmlFor="article-search" className="sr-only">
              Search articles
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-3.5 left-3 size-4 text-zinc-500"
            />
            <input
              id="article-search"
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-controls="article-results"
              placeholder="Search articles and sections…"
              maxLength={160}
              autoComplete="off"
              className="h-11 w-full rounded-md border border-white/15 bg-transparent pr-3 pl-10 text-base text-zinc-200 outline-offset-4 transition-colors placeholder:text-zinc-400 hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-400 sm:text-sm"
            />
          </div>
          {topics.length > 0 && (
            <div className="relative sm:w-44">
              <label htmlFor="article-topic" className="sr-only">
                Filter by topic
              </label>
              <select
                id="article-topic"
                value={activeTopic}
                onChange={(event) => setActiveTopic(event.target.value)}
                aria-controls="article-results"
                className="bg-background h-11 w-full appearance-none truncate rounded-md border border-white/15 pr-9 pl-3 text-base text-zinc-300 outline-offset-4 transition-colors hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-zinc-400 sm:text-xs"
              >
                <option value="">All topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {formatTopic(topic)}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-3.5 right-3 size-4 text-zinc-500"
              />
            </div>
          )}
        </form>
      )}

      <div className="mt-5 flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-3">
        <p
          role="status"
          aria-atomic="true"
          className="font-mono text-[11px] text-zinc-400"
        >
          {query.trim() ? (
            'Full article search'
          ) : (
            <>
              {hasFilters
                ? `${filtered.length} of ${posts.length}`
                : posts.length}{' '}
              {posts.length === 1 ? 'article' : 'articles'}
            </>
          )}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="min-h-8 text-xs text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-100"
          >
            Clear filters
          </button>
        ) : (
          <span className="font-mono text-[11px] text-zinc-400">
            Newest first
          </span>
        )}
      </div>

      <div id="article-results">
        {query.trim() ? (
          <BlogSearchResults query={query} topic={activeTopic} />
        ) : filtered.length > 0 ? (
          <ol aria-label="Articles" className="divide-y divide-white/[0.07]">
            {filtered.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="list-row group block py-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-base leading-6 font-medium tracking-tight text-zinc-200 transition-colors group-hover:text-white">
                      {post.title}
                    </h2>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 size-3.5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-300"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-zinc-400">
                    {post.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] leading-5 text-zinc-400">
                    <time dateTime={post.publishedTime}>
                      {formatDate(post.publishedTime)}
                    </time>
                    <span aria-hidden="true" className="text-zinc-600">
                      ·
                    </span>
                    <span>{post.readingTime} min read</span>
                    {meaningfulUpdatedDate(
                      post.publishedTime,
                      post.modifiedTime,
                    ) && (
                      <>
                        <span aria-hidden="true" className="text-zinc-600">
                          ·
                        </span>
                        <span>Updated {formatDate(post.modifiedTime!)}</span>
                      </>
                    )}
                    {post.slug === posts[0]?.slug && (
                      <>
                        <span aria-hidden="true" className="text-zinc-600">
                          ·
                        </span>
                        <span className="text-zinc-300">Latest</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <div className="py-14 text-center">
            <h2 className="text-sm font-medium text-zinc-200">
              {posts.length === 0 ? 'No articles yet' : 'No articles found'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {posts.length === 0
                ? 'New writing will appear here.'
                : 'Try a different search or choose another topic.'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
