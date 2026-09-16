'use client'

import { useEffect } from 'react'

/** Finish explicit fragment navigation after fonts and reading preferences settle. */
export function ArticleFragment({ slug }: { slug: string }) {
  useEffect(() => {
    let frame = 0
    let generation = 0
    let observer: ResizeObserver | undefined

    const cancel = () => {
      generation += 1
      window.cancelAnimationFrame(frame)
      frame = 0
      observer?.disconnect()
    }
    const align = () => {
      cancel()
      const current = generation
      const hash = window.location.hash
      if (!hash) return
      let id: string
      try {
        id = decodeURIComponent(hash.slice(1))
      } catch {
        return
      }
      void document.fonts.ready.then(() => {
        if (current !== generation) return
        let focused = false
        const schedule = () => {
          if (frame) return
          frame = window.requestAnimationFrame(() => {
            frame = window.requestAnimationFrame(() => {
              frame = 0
              if (current !== generation || window.location.hash !== hash)
                return
              const target = document.getElementById(id)
              if (!target) return
              target.scrollIntoView({ block: 'start', behavior: 'instant' })
              if (focused) return
              if (!target.hasAttribute('tabindex')) {
                target.setAttribute('tabindex', '-1')
                target.addEventListener(
                  'blur',
                  () => target.removeAttribute('tabindex'),
                  { once: true },
                )
              }
              target.focus({ preventScroll: true })
              focused = true
            })
          })
        }
        // Hydration and saved text sizes can reflow the article after the
        // first jump. Keep its destination aligned until the reader interacts.
        const article = document.getElementById('article-content')
        if (article) {
          observer = new ResizeObserver(schedule)
          observer.observe(article.closest('.blog-post') ?? article)
        }
        schedule()
      })
    }

    align()
    window.addEventListener('hashchange', align)
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('pointerdown', cancel)
    window.addEventListener('keydown', cancel)
    return () => {
      cancel()
      window.removeEventListener('hashchange', align)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('pointerdown', cancel)
      window.removeEventListener('keydown', cancel)
    }
  }, [slug])

  return null
}
