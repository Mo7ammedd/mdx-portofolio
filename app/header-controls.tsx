'use client'

import Link from 'next/link'
import { Check, Copy, Moon, Sun } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Github } from '@/components/icons'

function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      aria-label="Toggle theme"
      type="button"
    >
      {mounted && isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

export function HeaderControls() {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const isBlogPost = pathname.startsWith('/blog/')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <nav className="flex items-center gap-1">
      <Link
        href="/blog"
        className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
          pathname.startsWith('/blog')
            ? 'font-medium text-zinc-900 dark:text-zinc-100'
            : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
        }`}
      >
        Blog
      </Link>

      {isBlogPost && (
        <button
          onClick={handleCopy}
          className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Copy blog link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          )}
        </button>
      )}

      <a
        href="https://github.com/mo7ammedd"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        aria-label="GitHub profile"
      >
        <Github />
      </a>

      <ThemeToggle />
    </nav>
  )
}
