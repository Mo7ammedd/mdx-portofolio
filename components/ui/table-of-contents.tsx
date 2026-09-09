'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const pathname = usePathname()
  const [contents, setContents] = useState<{
    pathname: string
    headings: Heading[]
  }>({ pathname: '', headings: [] })

  useEffect(() => {
    // Read after the article and HeadingAnchor IDs have committed.
    const frame = requestAnimationFrame(() => {
      const elements = document.querySelectorAll<HTMLHeadingElement>(
        'article h2, article h3',
      )
      const headings = Array.from(elements)
        .map((element) => {
          const label = element.cloneNode(true) as HTMLElement
          label
            .querySelectorAll('button, [aria-hidden="true"]')
            .forEach((node) => node.remove())

          return {
            id: element.id,
            text: label.textContent?.trim() || '',
            level: element.tagName === 'H3' ? 3 : 2,
          }
        })
        .filter((heading) => heading.id && heading.text)

      setContents({ pathname, headings })
    })

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  if (contents.pathname !== pathname || contents.headings.length === 0) {
    return null
  }

  return (
    <details
      key={pathname}
      className="not-prose group border-y border-white/[0.07]"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-300 [&::-webkit-details-marker]:hidden">
        <span>On this page</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <nav aria-label="On this page" className="pb-4">
        <ol className="space-y-1">
          {contents.headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block rounded-md py-1.5 text-xs leading-5 text-zinc-400 no-underline transition-colors hover:text-zinc-100 ${
                  heading.level === 3 ? 'pl-4' : ''
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}
