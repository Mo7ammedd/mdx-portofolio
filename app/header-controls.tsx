'use client'

import { usePathname } from 'next/navigation'

import { SiteLink } from '@/components/site-link'

const links = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Writing' },
]

export function HeaderControls() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-4 sm:gap-6"
    >
      {links.map(({ href, label }) => (
        <SiteLink
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className={`text-link text-sm underline-offset-8 ${
            pathname === href || pathname.startsWith(`${href}/`)
              ? 'text-primary decoration-primary/60 underline'
              : 'text-zinc-400'
          }`}
        >
          {label}
        </SiteLink>
      ))}
    </nav>
  )
}
