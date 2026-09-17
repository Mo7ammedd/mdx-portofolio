'use client'

import { usePathname } from 'next/navigation'

import { Github } from '@/components/icons'
import { isAskHost, SiteLink, useSiteHost } from '@/components/site-link'

export function HeaderControls() {
  const pathname = usePathname()
  const hostname = useSiteHost()
  const onAsk = pathname.startsWith('/ask') || isAskHost(hostname)

  return (
    <nav
      aria-label="Main navigation"
      className="flex shrink-0 items-center gap-2 sm:gap-6"
    >
      <SiteLink
        href="/"
        aria-current={!onAsk && pathname === '/' ? 'page' : undefined}
        className={`inline-flex min-h-11 items-center text-xs underline-offset-8 transition-colors hover:text-white ${
          !onAsk && pathname === '/'
            ? 'text-zinc-100 underline decoration-zinc-500'
            : 'text-zinc-400'
        }`}
      >
        Home
      </SiteLink>
      <SiteLink
        href="/projects"
        aria-current={pathname === '/projects' ? 'page' : undefined}
        className={`inline-flex min-h-11 items-center text-xs underline-offset-8 transition-colors hover:text-white ${
          pathname.startsWith('/projects')
            ? 'text-zinc-100 underline decoration-zinc-500'
            : 'text-zinc-400'
        }`}
      >
        Projects
      </SiteLink>
      <SiteLink
        href="/blog"
        aria-current={pathname === '/blog' ? 'page' : undefined}
        className={`inline-flex min-h-11 items-center text-xs underline-offset-8 transition-colors hover:text-white ${
          pathname.startsWith('/blog')
            ? 'text-zinc-100 underline decoration-zinc-500'
            : 'text-zinc-400'
        }`}
      >
        Writing
      </SiteLink>
      <SiteLink
        href="/ask"
        aria-current={onAsk ? 'page' : undefined}
        className={`inline-flex min-h-11 items-center text-xs underline-offset-8 transition-colors hover:text-white ${
          onAsk
            ? 'text-zinc-100 underline decoration-zinc-500'
            : 'text-zinc-400'
        }`}
      >
        Ask
      </SiteLink>

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
