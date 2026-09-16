'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { READING_SECTION_EVENT } from '@/lib/reading-progress'

/** Enhance the compiled links; the navigation also works without JavaScript. */
export function TableOfContentsObserver({
  children,
  slug,
}: {
  children: ReactNode
  slug?: string
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('[data-section-link]'),
    )
    const ids = [...new Set(links.map((link) => link.hash.slice(1)))]
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null)
    const desktop = window.matchMedia('(min-width: 1120px)')
    let activeId = ''
    let completed = false
    const article = document.getElementById('article-content')
    let frame = 0

    const update = () => {
      frame = 0
      // Binary search avoids measuring every section on long articles on scroll.
      let low = 0
      let high = sections.length - 1
      let current = -1
      while (low <= high) {
        const middle = (low + high) >>> 1
        if (sections[middle].getBoundingClientRect().top <= 140) {
          current = middle
          low = middle + 1
        } else {
          high = middle - 1
        }
      }
      const id = sections[current]?.id ?? ''
      const complete =
        !!article &&
        window.scrollY > 0 &&
        article.getBoundingClientRect().bottom <= window.innerHeight
      if (id === activeId && complete === completed) return
      activeId = id
      completed = complete
      if (slug)
        window.dispatchEvent(
          new CustomEvent(READING_SECTION_EVENT, {
            detail: { slug, id, complete },
          }),
        )

      for (const link of links) {
        if (link.hash.slice(1) !== id) {
          link.removeAttribute('aria-current')
          continue
        }
        link.setAttribute('aria-current', 'location')
        const group = link.closest<HTMLDetailsElement>('[data-toc-subsections]')
        if (group) group.open = true

        if (desktop.matches && link.closest('.blog-toc-desktop')) {
          const nav = link.closest('nav')!
          const bounds = nav.getBoundingClientRect()
          const item = link.getBoundingClientRect()
          if (item.top < bounds.top) nav.scrollTop += item.top - bounds.top - 8
          else if (item.bottom > bounds.bottom)
            nav.scrollTop += item.bottom - bounds.bottom + 8
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    const closeMobileContents = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('[data-section-link]')
      const disclosure = link?.closest<HTMLDetailsElement>('[data-toc-mobile]')
      if (disclosure) disclosure.open = false
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    root.addEventListener('click', closeMobileContents)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      root.removeEventListener('click', closeMobileContents)
    }
  }, [slug])

  return (
    <div ref={rootRef} className="not-prose">
      {children}
    </div>
  )
}
