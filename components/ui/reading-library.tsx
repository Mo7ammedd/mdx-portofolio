'use client'

import { useSyncExternalStore } from 'react'
import { Bookmark, BookmarkCheck, Check, Circle } from 'lucide-react'
import {
  completedPathCount,
  parseReadingLibrary,
  READING_LIBRARY_KEY,
  toggleReadingEntry,
  type ReadingEntry,
  type ReadingLibrary,
} from '@/lib/reading-library'

const CHANGE_EVENT = 'blog-reading-library-change'
const serverSnapshot = {
  entries: {} as ReadingLibrary,
  persistent: true,
  ready: false,
}
let cached = serverSnapshot
let cachedRaw: string | null | undefined
let unavailable = false

function getSnapshot() {
  if (unavailable) return cached
  try {
    const raw = window.localStorage.getItem(READING_LIBRARY_KEY)
    if (raw !== cachedRaw || !cached.ready) {
      cachedRaw = raw
      cached = {
        entries: parseReadingLibrary(raw),
        persistent: true,
        ready: true,
      }
    }
  } catch {
    unavailable = true
    cached = { ...cached, persistent: false, ready: true }
  }
  return cached
}

function subscribe(onChange: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === READING_LIBRARY_KEY || event.key === null) {
      if (unavailable) cachedRaw = undefined
      unavailable = false
      onChange()
    }
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', storage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', storage)
  }
}

export function useReadingLibrary() {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot)
}

function toggle(slug: string, field: keyof ReadingEntry) {
  const entries = toggleReadingEntry(getSnapshot().entries, slug, field)
  try {
    const raw = JSON.stringify({ version: 1, entries })
    window.localStorage.setItem(READING_LIBRARY_KEY, raw)
    cachedRaw = raw
    unavailable = false
    cached = { entries, persistent: true, ready: true }
  } catch {
    unavailable = true
    cached = { entries, persistent: false, ready: true }
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function SaveArticleButton({ slug }: { slug: string }) {
  const { entries, ready } = useReadingLibrary()
  const saved = !!entries[slug]?.savedAt
  const Icon = saved ? BookmarkCheck : Bookmark
  return (
    <button
      type="button"
      aria-label="Save article"
      aria-pressed={saved}
      disabled={!ready}
      onClick={() => toggle(slug, 'savedAt')}
      className="text-link gap-2 rounded-md px-2 hover:bg-white/5 disabled:opacity-50"
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {saved ? 'Saved' : 'Save article'}
    </button>
  )
}

export function ReadingStorageNotice() {
  const { ready, persistent } = useReadingLibrary()
  if (!ready || persistent) return null
  return (
    <p role="status" className="mt-2 text-xs leading-6 text-amber-200/80">
      Browser storage is unavailable. Your changes last for this visit.
    </p>
  )
}

export function ArticleCompletion({ slug }: { slug: string }) {
  const { entries, ready } = useReadingLibrary()
  const complete = !!entries[slug]?.completedAt
  const Icon = complete ? Check : Circle
  return (
    <div className="mb-4 border-b border-white/10 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-6 text-zinc-400">
          Keep track of what you’ve read.
        </p>
        <button
          type="button"
          aria-label="Mark article as read"
          aria-pressed={complete}
          disabled={!ready}
          onClick={() => toggle(slug, 'completedAt')}
          className="text-link gap-2 rounded-md border border-white/15 px-3 hover:bg-white/5 disabled:opacity-50"
        >
          <Icon aria-hidden="true" className="size-3.5" />
          {complete ? 'Read · undo' : 'Mark as read'}
        </button>
      </div>
      <ReadingStorageNotice />
    </div>
  )
}

export function ReadingPathProgress({ slugs }: { slugs: string[] }) {
  const { entries } = useReadingLibrary()
  const count = completedPathCount(entries, slugs)
  return (
    <p
      className="mt-3 flex items-center gap-2 text-xs leading-6 text-zinc-400"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        aria-hidden="true"
        className="h-1 w-12 overflow-hidden rounded-full bg-white/10"
      >
        <span
          className="block h-full bg-sky-300/70"
          style={{
            width: `${slugs.length ? (count / slugs.length) * 100 : 0}%`,
          }}
        />
      </span>
      {count} of {slugs.length} articles completed
    </p>
  )
}

export function ArticleReadBadge({ slug }: { slug: string }) {
  const { entries } = useReadingLibrary()
  if (!entries[slug]?.completedAt) return null
  return (
    <span className="inline-flex items-center gap-1 text-xs text-sky-200">
      <Check aria-hidden="true" className="size-3" />
      Read
    </span>
  )
}

export function RemoveSavedArticle({
  slug,
  title,
}: {
  slug: string
  title: string
}) {
  return (
    <button
      type="button"
      onClick={() => toggle(slug, 'savedAt')}
      aria-label={`Remove saved article: ${title}`}
      className="text-link underline decoration-zinc-700 underline-offset-4"
    >
      Remove
    </button>
  )
}
