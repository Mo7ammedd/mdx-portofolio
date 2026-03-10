'use client'

import { usePathname } from 'next/navigation'
import { Copy, Check } from 'lucide-react'
import { Magnetic } from '@/components/ui/magnetic'
import { useState } from 'react'

interface BlogSocialShareProps {
  title: string
  description?: string
}

export function BlogSocialShare({ title }: BlogSocialShareProps) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const url = `https://www.modev.me${pathname}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    { label: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}` },
    { label: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'Reddit', url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` },
  ]

  return (
    <div className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-zinc-400 dark:text-zinc-500 mr-2">Share</span>
        {shareLinks.map((link) => (
          <Magnetic key={link.label} springOptions={{ bounce: 0 }} intensity={0.3}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-600 no-underline transition-colors duration-200 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
            >
              {link.label}
            </a>
          </Magnetic>
        ))}
        <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-600 transition-colors duration-200 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
          >
            {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy link</>}
          </button>
        </Magnetic>
      </div>
    </div>
  )
}
