'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-8 left-6 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md transition-all duration-300 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/80 dark:hover:border-zinc-600 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
    </button>
  )
}
