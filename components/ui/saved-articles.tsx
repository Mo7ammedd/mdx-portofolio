'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-utils'
import {
  ArticleReadBadge,
  ReadingStorageNotice,
  RemoveSavedArticle,
  useReadingLibrary,
} from './reading-library'

export function SavedArticles({ posts }: { posts: BlogPost[] }) {
  const { entries, ready } = useReadingLibrary()
  const saved = posts
    .filter((post) => entries[post.slug]?.savedAt)
    .sort((a, b) => entries[b.slug].savedAt! - entries[a.slug].savedAt!)
  return (
    <div className="mt-8">
      <ReadingStorageNotice />
      {!ready ? (
        <p className="text-sm leading-7 text-zinc-400">
          Loading your saved articles…
        </p>
      ) : saved.length ? (
        <>
          <p
            role="status"
            className="section-heading border-b border-white/10 pb-4"
          >
            {saved.length} saved {saved.length === 1 ? 'article' : 'articles'}
          </p>
          <ol aria-label="Saved articles" className="divide-y divide-white/10">
            {saved.map((post) => (
              <li key={post.slug} className="py-5">
                <Link
                  href={`/blog/${post.slug}`}
                  className="list-row block py-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base leading-6 text-zinc-200">
                      {post.title}
                    </h2>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-zinc-500"
                    />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {post.description}
                  </p>
                </Link>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>{post.readingTime} min read</span>
                    <ArticleReadBadge slug={post.slug} />
                  </div>
                  <RemoveSavedArticle slug={post.slug} title={post.title} />
                </div>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <div className="rounded-lg border border-white/10 px-5 py-8">
          <Bookmark aria-hidden="true" className="mb-4 size-5 text-zinc-400" />
          <h2 className="text-base text-zinc-200">No saved articles yet</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-400">
            Use “Save article” while reading to keep it here for later.
          </p>
          <Link href="/blog" className="text-link mt-3">
            Browse articles{' '}
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </Link>
        </div>
      )}
      <noscript>
        <p className="mt-3 text-sm leading-7 text-zinc-400">
          Enable JavaScript to use bookmarks stored in this browser.{' '}
          <a href="/blog" className="underline">
            Browse all articles
          </a>
          .
        </p>
      </noscript>
    </div>
  )
}
