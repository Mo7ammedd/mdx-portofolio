'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Github } from '@/components/icons'

export function HeaderControls() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="flex shrink-0 items-center gap-4 sm:gap-6"
    >
      <Link
        href="/"
        aria-current={pathname === '/' ? 'page' : undefined}
        className={`inline-flex min-h-11 items-center text-xs underline-offset-8 transition-colors hover:text-white ${
          pathname === '/'
            ? 'text-zinc-100 underline decoration-zinc-500'
            : 'text-zinc-400'
        }`}
      >
        Home
      </Link>
      <Link
        href="/blog"
        aria-current={pathname === '/blog' ? 'page' : undefined}
        className={`inline-flex min-h-11 items-center text-xs underline-offset-8 transition-colors hover:text-white ${
          pathname.startsWith('/blog')
            ? 'text-zinc-100 underline decoration-zinc-500'
            : 'text-zinc-400'
        }`}
      >
        Writing
      </Link>

      <a
        href="https://github.com/mo7ammedd"
        target="_blank"
        rel="noopener noreferrer"
        className="-mr-3 flex size-11 items-center justify-center text-zinc-400 transition-colors hover:text-white [&_svg]:size-4"
        aria-label="GitHub profile"
      >
        <Github />
      </a>
    </nav>
  )
}
