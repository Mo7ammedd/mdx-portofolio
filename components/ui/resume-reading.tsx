'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { Bookmark, X } from 'lucide-react'
import {
  parseReadingPosition,
  readingStorageKey,
  READING_SECTION_EVENT,
} from '@/lib/reading-progress'
import type { BlogHeading } from './table-of-contents'

const subscribe = () => () => {}
const serverSnapshot = () => null

function createEntrySnapshot(slug: string) {
  let read = false
  let initial: string | null = null
  return () => {
    if (!read) {
      read = true
      try {
        if (!window.location.hash)
          initial = localStorage.getItem(readingStorageKey(slug))
      } catch {}
    }
    return initial
  }
}

export function ResumeReading({
  slug,
  headings,
}: {
  slug: string
  headings: BlogHeading[]
}) {
  const [dismissed, setDismissed] = useState(false)
  // Freeze the offer at entry. Saving a new section must not make a reminder
  // appear during someone's first visit or move an existing reminder's target.
  const entry = useMemo(() => createEntrySnapshot(slug), [slug])
  const raw = useSyncExternalStore(subscribe, entry, serverSnapshot)
  const position = parseReadingPosition(
    raw,
    headings.map((heading) => heading.id),
  )
  const heading = headings.find((heading) => heading.id === position?.sectionId)

  useEffect(() => {
    let pending: string | null | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const persist = () => {
      if (timer) clearTimeout(timer)
      if (pending === undefined) return
      try {
        if (pending === null) localStorage.removeItem(readingStorageKey(slug))
        else
          localStorage.setItem(
            readingStorageKey(slug),
            JSON.stringify({
              version: 1,
              sectionId: pending,
              savedAt: Date.now(),
            }),
          )
      } catch {
        /* Reading stays usable when storage is blocked. */
      }
      pending = undefined
    }
    const onSection = (event: Event) => {
      const detail = (
        event as CustomEvent<{ slug: string; id: string; complete: boolean }>
      ).detail
      if (detail?.slug !== slug) return
      if (detail.complete) pending = null
      else if (headings.some((heading) => heading.id === detail.id))
        pending = detail.id
      else return
      if (timer) clearTimeout(timer)
      timer = setTimeout(persist, 800)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') persist()
    }
    window.addEventListener(READING_SECTION_EVENT, onSection)
    window.addEventListener('pagehide', persist)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      persist()
      window.removeEventListener(READING_SECTION_EVENT, onSection)
      window.removeEventListener('pagehide', persist)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [slug, headings])

  if (dismissed || !heading) return null
  return (
    <aside
      aria-label="Saved reading position"
      className="not-prose mb-5 flex items-start gap-3 rounded-lg border border-sky-300/15 bg-sky-300/[0.03] px-4 py-3"
    >
      <Bookmark
        aria-hidden="true"
        className="mt-1 size-4 shrink-0 text-sky-200"
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs leading-5 text-zinc-400">
          Continue where you left off
        </p>
        <a
          href={`#${heading.id}`}
          onClick={() => setDismissed(true)}
          className="inline-block py-1 text-sm leading-6 text-zinc-200 underline decoration-zinc-600 underline-offset-4"
        >
          {heading.text}
        </a>
      </div>
      <button
        type="button"
        aria-label="Dismiss reading reminder"
        onClick={() => setDismissed(true)}
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-white/5 hover:text-white"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </aside>
  )
}
