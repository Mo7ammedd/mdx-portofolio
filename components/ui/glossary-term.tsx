'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { blogGlossary } from '@/lib/blog-glossary.mjs'

export function GlossaryTerm({
  id,
  children,
}: {
  id: string
  children?: ReactNode
}) {
  const popoverId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLSpanElement>(null)
  const term = blogGlossary[id]

  function position() {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel || !panel.matches(':popover-open')) return
    const bounds = trigger.getBoundingClientRect()
    const { width, height } = panel.getBoundingClientRect()
    const left = Math.max(
      16,
      Math.min(bounds.left, window.innerWidth - width - 16),
    )
    const proposedTop =
      bounds.bottom + height + 12 <= window.innerHeight - 16
        ? bounds.bottom + 12
        : bounds.top - height - 12
    const top = Math.max(
      16,
      Math.min(proposedTop, window.innerHeight - height - 16),
    )
    panel.style.left = `${left}px`
    panel.style.top = `${top}px`
    panel.style.transform = 'none'
  }

  useEffect(() => {
    window.addEventListener('resize', position)
    return () => window.removeEventListener('resize', position)
  }, [])

  if (!term) return children ?? id
  return (
    <span className="glossary-term">
      <button
        ref={triggerRef}
        type="button"
        data-glossary-term={id}
        popoverTarget={popoverId}
        aria-haspopup="dialog"
        className="inline cursor-help rounded-sm p-0 font-[inherit] text-[inherit] underline decoration-sky-300/50 decoration-dotted underline-offset-4 hover:decoration-sky-200"
      >
        {children ?? term.term}
      </button>
      <span
        ref={panelRef}
        id={popoverId}
        popover="auto"
        role="dialog"
        aria-labelledby={`${popoverId}-title`}
        aria-describedby={`${popoverId}-definition`}
        tabIndex={-1}
        onToggle={(event) => {
          if (event.newState === 'open') {
            position()
            panelRef.current?.focus({ preventScroll: true })
          }
        }}
        className="glossary-popover not-prose rounded-xl border border-white/20 bg-zinc-950 p-5 font-sans text-sm leading-6 text-zinc-300 shadow-2xl"
      >
        <span className="mb-3 flex items-start justify-between gap-3">
          <strong
            id={`${popoverId}-title`}
            className="pt-1 text-base font-medium text-zinc-100"
          >
            {term.term}
          </strong>
          <button
            type="button"
            popoverTarget={popoverId}
            popoverTargetAction="hide"
            aria-label="Close definition"
            className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </span>
        <span id={`${popoverId}-definition`} className="block">
          {term.definition}
        </span>
        <span className="mt-3 block border-l border-sky-300/30 pl-3 text-xs leading-6 text-zinc-400">
          {term.example}
        </span>
        <a href={`/blog/glossary#${id}`} className="text-link mt-3">
          Browse glossary <ArrowUpRight aria-hidden="true" className="size-3" />
        </a>
      </span>
    </span>
  )
}
