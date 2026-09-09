import Image from 'next/image'
import Link from 'next/link'

import { HeaderControls } from './header-controls'

function PalestineFlagLine() {
  return (
    <div className="fixed top-0 right-0 left-0 z-[100] flex h-1 w-full">
      <div className="w-1/4 bg-black" />
      <div className="w-1/4 bg-white" />
      <div className="w-1/4 bg-green-600" />
      <div className="w-1/4 bg-red-600" />
    </div>
  )
}

export function Header() {
  return (
    <>
      <PalestineFlagLine />
      <header className="mb-8 flex flex-wrap items-center justify-between gap-x-2 gap-y-3 sm:mb-10 sm:gap-4">
        <Link
          href="/"
          aria-label="Mohammed Mostafa, home"
          className="group inline-flex min-w-0 items-center gap-2 rounded-lg no-underline sm:gap-3"
        >
          <Image
            alt=""
            src="/avatar.jpg"
            className="size-10 rounded-full border border-white/10 object-cover grayscale transition-[filter] group-hover:grayscale-0 motion-reduce:transition-none sm:size-12"
            width={48}
            height={48}
            priority
          />

          <div>
            <p className="text-sm font-medium tracking-tight text-zinc-100 sm:text-base">
              Mohammed Mostafa
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">Software Engineer</p>
          </div>
        </Link>

        <HeaderControls />
      </header>
    </>
  )
}

export default Header
