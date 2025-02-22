'use client'

import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'
import { Github } from '@/components/icons'

const PalestineFlagLine = () => {
  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-1 w-full">
      <div className="w-1/4 bg-black"></div>
      <div className="w-1/4 bg-white"></div>
      <div className="w-1/4 bg-green-600"></div>
      <div className="w-1/4 bg-red-600"></div>
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
            <TextEffect
              as="p"
              preset="fade"
              per="char"
              className="text-zinc-600 dark:text-zinc-500"
              delay={0.5}
            >
              Software Engineer
            </TextEffect>
          </div>
        </div>

        <a
          href="https://github.com/mo7ammedd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
        </a>
      </header>
    </>
  )
}

export default Header
