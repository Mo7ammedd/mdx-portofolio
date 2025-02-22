'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="mb-8 flex items-center gap-3">
      <Image
        alt=""
        src="https://avatars.githubusercontent.com/u/128194288?v=4"
        className="rounded-full grayscale hover:grayscale-0"
        width={80}
        height={80}
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
    </header>
  )
}
