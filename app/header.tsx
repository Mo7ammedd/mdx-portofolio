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
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            alt="Mohammed's avatar"
            src="/avatar.jpg"
            className="aspect-square rounded-full object-cover grayscale hover:grayscale-0"
            width={80}
            height={80}
            priority
          />

          <div>
            <Link href="/" className="font-medium text-black dark:text-white">
              Mohamed Mostafa
            </Link>
            <p className="text-zinc-600 dark:text-zinc-500">Software Engineer</p>
          </div>
        </div>

        <HeaderControls />
      </header>
    </>
  )
}

export default Header
