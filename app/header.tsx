'use client'

import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import Image from 'next/image'
import {  Copy, Check } from 'lucide-react'
import { Github } from '@/components/icons'

import { usePathname } from 'next/navigation'
import { useState } from 'react'

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
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgAH/8QAIhAAAgIBBAEFAAAAAAAAAAAAAQIDBAUGABESByExM3GR/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAP/xAAYEQADAQEAAAAAAAAAAAAAAAABAgMAEf/aAAwDAQACEQMRAD8AqY3C12zFWqZXJzFLW0csTPZkLKD5aCQvdEcd8dutvZxTrLUKWSGSrC8tNxYmVB3ygBAPOuQQd7v1/9k="
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

        <div className="flex items-center gap-4">
          {isBlogPost && (
            <button
              onClick={handleCopy}
              className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Copy blog link"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>
          )}
          <a
            href="https://github.com/mo7ammedd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
          </a>
        </div>
      </header>
    </>
  )
}

export default Header