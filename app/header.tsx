'use client'

import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'
import { Copy, Check } from 'lucide-react'
import { Github } from '@/components/icons'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const PalestineFlagLine = () => {
  return (
    <div className="fixed top-0 right-0 left-0 z-[100] flex h-1 w-full">
      <div className="w-1/4 bg-black"></div>
      <div className="w-1/4 bg-white"></div>
      <div className="w-1/4 bg-green-600"></div>
      <div className="w-1/4 bg-red-600"></div>
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const isBlogPost = pathname.startsWith('/blog/')

  const handleCopy = () => {
    // Get the full URL including the domain
    const fullUrl = window.location.href
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

        <nav className="flex items-center gap-1">
          <Link
            href="/blog"
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              pathname.startsWith('/blog')
                ? 'font-medium text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            Blog
          </Link>

          {isBlogPost && (
            <button
              onClick={handleCopy}
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Copy blog link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              )}
            </button>
          )}

          <a
            href="https://github.com/mo7ammedd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Github />
          </a>
        </nav>
      </header>
    </>
  )
}

export default Header