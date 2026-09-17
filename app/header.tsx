import Image from 'next/image'
import { SiteLink } from '@/components/site-link'

import { HeaderControls } from './header-controls'

export function Header() {
  return (
    <header className="mb-12 flex items-center justify-between gap-3 border-b border-white/10 pb-5 sm:mb-16">
      <SiteLink
        href="/"
        aria-label="Mohammed Mostafa, home"
        className="group inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-sm no-underline"
      >
        <Image
          alt=""
          src="/avatar.jpg"
          className="size-8 rounded-full object-cover grayscale"
          width={32}
          height={32}
          priority
        />
        <span className="hidden font-mono text-xs tracking-tight text-zinc-400 transition-colors group-hover:text-white min-[420px]:inline">
          modev.me
        </span>
      </SiteLink>

      <HeaderControls />
    </header>
  )
}

export default Header
