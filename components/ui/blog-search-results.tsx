'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  searchBlogSections,
  searchTerms,
  type BlogSearchDocument,
} from '@/lib/blog-search'

let indexRequest: Promise<BlogSearchDocument[]> | undefined

function loadIndex() {
  if (!indexRequest) {
    indexRequest = fetch('/blog/search-index.json')
      .then(async (response) => {
        if (!response.ok) throw new Error('Search unavailable')
        return (await response.json()) as BlogSearchDocument[]
      })
      .catch((error) => {
        indexRequest = undefined
        throw error
      })
  }
  return indexRequest
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = searchTerms(query).map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
  )
  if (!terms.length) return text
  const pattern = new RegExp(`(${terms.join('|')})`, 'gi')
  return text.split(pattern).map((part, index) =>
    index % 2 ? (
      <mark key={index} className="rounded bg-sky-300/10 px-0.5 text-sky-200">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export function BlogSearchResults({
  query,
  topic = '',
  onNavigate,
}: {
  query: string
  topic?: string
  onNavigate?: () => void
}) {
  const [index, setIndex] = useState<BlogSearchDocument[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const enabled = query.trim().length > 0

  useEffect(() => {
    if (!enabled || index) return
    let active = true
    loadIndex()
      .then((data) => {
        if (active) setIndex(data)
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [enabled, index, attempt])

  const results = useMemo(
    () => searchBlogSections(index ?? [], query, topic),
    [index, query, topic],
  )
  if (!enabled) return null
  if (failed && !index)
    return (
      <div className="py-8 text-sm leading-6 text-zinc-400">
        <p role="status">Section search couldn’t load.</p>
        <button
          type="button"
          onClick={() => {
            setFailed(false)
            setAttempt((value) => value + 1)
          }}
          className="text-link underline underline-offset-4"
        >
          Try again
        </button>
      </div>
    )
  if (!index)
    return (
      <p role="status" className="py-8 text-sm text-zinc-400">
        Searching article sections…
      </p>
    )

  return (
    <div>
      <p
        role="status"
        aria-atomic="true"
        className="py-4 font-mono text-xs text-zinc-400"
      >
        {results.length
          ? `Showing ${results.length} matching ${results.length === 1 ? 'section' : 'sections'}`
          : 'No matching sections. Try different words or another topic.'}
      </p>
      <ol aria-label="Search results" className="divide-y divide-white/[0.07]">
        {results.map((result) => (
          <li key={`${result.slug}#${result.sectionId}`}>
            <Link
              href={`/blog/${result.slug}${result.sectionId ? `#${encodeURIComponent(result.sectionId)}` : ''}`}
              prefetch={false}
              onClick={onNavigate}
              className="list-row block py-5"
            >
              <p className="mb-1 text-xs leading-5 text-zinc-400">
                {result.articleTitle}
              </p>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-6 font-medium text-zinc-100">
                  <Highlight text={result.sectionTitle} query={query} />
                </p>
                <ArrowUpRight
                  aria-hidden="true"
                  className="mt-1 size-3.5 shrink-0 text-zinc-500"
                />
              </div>
              <p className="mt-2 text-sm leading-6 [overflow-wrap:anywhere] text-zinc-400">
                <Highlight text={result.excerpt} query={query} />
              </p>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
