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
        className={`text-link underline-offset-8 ${
          !onAsk && pathname === '/'
            ? 'text-primary underline decoration-primary/60'
            : 'text-zinc-400'
        }`}
      >
        Home
      </SiteLink>
      <SiteLink
        href="/projects"
        aria-current={pathname === '/projects' ? 'page' : undefined}
        className={`text-link underline-offset-8 ${
          pathname.startsWith('/projects')
            ? 'text-primary underline decoration-primary/60'
            : 'text-zinc-400'
        }`}
      >
        Projects
      </SiteLink>
      <SiteLink
        href="/blog"
        aria-current={pathname === '/blog' ? 'page' : undefined}
        className={`text-link underline-offset-8 ${
          pathname.startsWith('/blog')
            ? 'text-primary underline decoration-primary/60'
            : 'text-zinc-400'
        }`}
      >
        Writing
      </SiteLink>
      <SiteLink
        href="/ask"
        aria-current={onAsk ? 'page' : undefined}
        className={`text-link underline-offset-8 ${
          onAsk
            ? 'text-primary underline decoration-primary/60'
            : 'text-zinc-400'
        }`}
      >
        Ask
      </SiteLink>

      <a
        href="https://github.com/mo7ammedd"
        target="_blank"
        rel="noopener noreferrer"
        className="icon-button -mr-3 [&_svg]:size-4"
        aria-label="GitHub profile"
      >
        <Github />
      </a>
    </nav>
  )
}
