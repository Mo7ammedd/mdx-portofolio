'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Github } from '@/components/icons'

export function HeaderControls() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="flex shrink-0 items-center gap-1"
    >
      <Link
        href="/blog"
        aria-current={pathname === '/blog' ? 'page' : undefined}
        className={`rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
          pathname.startsWith('/blog')
            ? 'font-medium text-zinc-100'
            : 'text-zinc-400 hover:text-zinc-100'
        }`}
      >
        Blog
      </Link>

      <a
        href="https://github.com/mo7ammedd"
        target="_blank"
        rel="noopener noreferrer"
        className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
        aria-label="GitHub profile"
      >
        <Github />
      </a>
    </nav>
  )
}
