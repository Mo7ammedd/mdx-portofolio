'use client'

import { useId, useState } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { paginationWork } from '@/lib/pagination-model'

const TOTAL_ROWS = 100_000
const number = new Intl.NumberFormat('en-US')

export function PaginationDemo() {
  const id = useId()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const work = paginationWork(page, pageSize, TOTAL_ROWS)

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="pagination-demo not-prose my-8 overflow-hidden rounded-xl border border-white/15 bg-white/[0.015]"
    >
      <div className="border-b border-white/10 p-5 sm:p-6">
        <p className="section-heading mb-2">Interactive example</p>
        <h4 id={`${id}-title`} className="text-base font-medium text-zinc-100">
          How much work does one page take?
        </h4>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Move deeper into {number.format(TOTAL_ROWS)} ordered rows. Both
          strategies return the same page.
        </p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <label
              htmlFor={`${id}-page`}
              className="mb-2 block text-xs text-zinc-400"
            >
              Page number
            </label>
            <input
              id={`${id}-page`}
              type="number"
              min={1}
              max={work.totalPages}
              step={1}
              value={work.page}
              onChange={(event) => {
                const value = event.target.valueAsNumber
                if (Number.isFinite(value))
                  setPage(
                    Math.max(1, Math.min(Math.trunc(value), work.totalPages)),
                  )
              }}
              className="h-11 w-28 rounded-md border border-white/15 bg-black px-3 font-mono text-base text-zinc-100"
            />
          </div>
          <div>
            <label
              htmlFor={`${id}-size`}
              className="mb-2 block text-xs text-zinc-400"
            >
              Rows per page
            </label>
            <select
              id={`${id}-size`}
              value={pageSize}
              onChange={(event) => {
                const size = Number(event.target.value)
                setPageSize(size)
                setPage(Math.min(work.page, Math.ceil(TOTAL_ROWS / size)))
              }}
              className="h-11 rounded-md border border-white/15 bg-black px-3 text-sm text-zinc-100"
            >
              {[10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setPage(1)
              setPageSize(20)
            }}
            className="text-link gap-1.5"
          >
            <RotateCcw aria-hidden="true" className="size-3" />
            Reset
          </button>
        </div>
        <label htmlFor={`${id}-slider`} className="sr-only">
          Pagination depth
        </label>
        <input
          id={`${id}-slider`}
          type="range"
          min={1}
          max={work.totalPages}
          step={1}
          value={work.page}
          aria-valuetext={`Page ${work.page} of ${work.totalPages}`}
          onChange={(event) => setPage(Number(event.target.value))}
          className="mt-5 block h-8 w-full cursor-pointer accent-sky-300"
        />
        <div className="flex justify-between font-mono text-[11px] text-zinc-500">
          <span>Page 1</span>
          <span>Page {number.format(work.totalPages)}</span>
        </div>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <p className="text-xs font-medium text-amber-200">OFFSET</p>
          <p
            data-offset-reads
            className="mt-2 font-mono text-2xl tracking-tight text-zinc-100"
          >
            {number.format(work.offsetReads)}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            index entries visited
          </p>
          <div
            aria-hidden="true"
            className="my-3 h-2 overflow-hidden rounded-full bg-white/5"
          >
            <div
              className="h-full min-w-0.5 rounded-full bg-amber-300/70"
              style={{ width: `${(work.offsetReads / TOTAL_ROWS) * 100}%` }}
            />
          </div>
          <p className="text-xs leading-6 text-zinc-400">
            Skip {number.format(work.offset)}, then read {work.returned}.
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-sky-200">CURSOR</p>
          <p
            data-cursor-reads
            className="mt-2 font-mono text-2xl tracking-tight text-zinc-100"
          >
            {work.cursorReads}
            <span className="ml-2 font-sans text-xs text-zinc-400">
              + index seek
            </span>
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            entries read after finding the position
          </p>
          <div
            aria-hidden="true"
            className="my-3 h-2 overflow-hidden rounded-full bg-white/5"
          >
            <div
              className="h-full min-w-0.5 rounded-full bg-sky-300/70"
              style={{ width: `${(work.cursorReads / TOTAL_ROWS) * 100}%` }}
            />
          </div>
          <p className="text-xs leading-6 text-zinc-400">
            {work.offset
              ? `Seek to the known cursor after position ${number.format(work.offset)}.`
              : 'Start at the first index entry.'}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 sm:px-6">
        <p
          role="status"
          aria-atomic="true"
          className="flex items-center gap-2 text-sm text-zinc-200"
        >
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          Both return positions {number.format(work.first)}–
          {number.format(work.last)}.
        </p>
        <p className="mt-3 text-xs leading-6 text-zinc-400">
          Illustrative entry counts for a stable dataset with a matching index.
          The cursor is already known; moving this slider does not model
          arbitrary page jumps with a cursor. Index seek work is additional, and
          actual query plans and timings vary.
        </p>
        <noscript>
          <p className="mt-3 text-xs leading-6 text-zinc-400">
            Enable JavaScript to move the slider. At page 1,000 with 20 rows per
            page, OFFSET visits 20,000 entries; a cursor reads 20 after its
            index seek.
          </p>
        </noscript>
      </div>
    </section>
  )
}
