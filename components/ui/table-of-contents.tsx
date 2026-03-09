'use client'

import { useState, useEffect } from 'react'
import { AlignLeft, ChevronDown } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const elements = document.querySelectorAll('article h2, article h3')
    const items: Heading[] = Array.from(elements).map((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '') || ''
      }
      return {
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      }
    })
    setHeadings(items)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -80% 0%' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900/50"
      >
        <div className="flex items-center gap-2">
          <AlignLeft className="h-4 w-4" />
          <span className="font-medium">On this page</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="space-y-0.5 border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={() => setIsOpen(false)}
              className={`block rounded-md py-1.5 text-sm transition-colors ${
                heading.level === 3 ? 'pl-4' : 'pl-0'
              } ${
                activeId === heading.id
                  ? 'font-medium text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              }`}
            >
              {heading.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
