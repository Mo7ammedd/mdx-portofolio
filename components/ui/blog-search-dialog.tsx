'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { BlogSearchResults } from './blog-search-results'

export function BlogSearchDialog() {
  const [query, setQuery] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previousOverflow = useRef<string | null>(null)
  const id = useId()

  useEffect(
    () => () => {
      if (previousOverflow.current !== null)
        document.body.style.overflow = previousOverflow.current
    },
    [],
  )

  const close = () => dialogRef.current?.close()
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={() => {
          previousOverflow.current = document.body.style.overflow
          document.body.style.overflow = 'hidden'
          dialogRef.current?.showModal()
          inputRef.current?.focus()
        }}
        className="text-link gap-2 rounded-md px-2 hover:bg-white/5"
      >
        <Search aria-hidden="true" className="size-3.5" />
        Search articles
      </button>
      <dialog
        ref={dialogRef}
        id={id}
        aria-labelledby={`${id}-title`}
        onKeyDown={(event) => {
          // A search input consumes Escape to clear its value by default.
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            close()
          }
        }}
        onClose={() => {
          if (previousOverflow.current !== null) {
            document.body.style.overflow = previousOverflow.current
            previousOverflow.current = null
          }
          triggerRef.current?.focus({ preventScroll: true })
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close()
        }}
        className="not-prose m-auto w-[40rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/15 bg-zinc-950 p-0 text-zinc-100 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id={`${id}-title`} className="text-lg font-medium">
              Search article sections
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="flex size-11 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <label htmlFor={`${id}-input`} className="sr-only">
            Search all article content
          </label>
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="search"
            value={query}
            maxLength={160}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a concept, API, or code example…"
            autoComplete="off"
            aria-controls={`${id}-results`}
            className="h-12 w-full rounded-md border border-white/15 bg-black px-3 text-base text-zinc-100 placeholder:text-zinc-500"
          />
          <div
            id={`${id}-results`}
            className="max-h-[55dvh] overflow-y-auto overscroll-contain px-1"
          >
            {query.trim() ? (
              <BlogSearchResults query={query} onNavigate={close} />
            ) : (
              <p className="py-5 text-sm leading-6 text-zinc-400">
                Search across the full articles and jump to a matching section.
                Try “composite cursor”, “IMiddleware”, or “round robin”.
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  )
}
