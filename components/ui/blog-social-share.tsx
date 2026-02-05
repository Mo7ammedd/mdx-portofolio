'use client'

import { usePathname } from 'next/navigation'
import { Share2, Copy, Check } from 'lucide-react'
import { Magnetic } from '@/components/ui/magnetic'
import { useState } from 'react'

interface BlogSocialShareProps {
  title: string
  description?: string
}

export function BlogSocialShare({ title, description }: BlogSocialShareProps) {
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
    {
      label: 'Twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Reddit',
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
  ]

  return (
    <div className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Share2 className="h-5 w-5" />
          <span className="text-base font-medium">Share this article</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {shareLinks.map((link) => (
            <Magnetic key={link.label} springOptions={{ bounce: 0 }} intensity={0.3}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {link.label}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                >
                  <path
                    d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </Magnetic>
          ))}
          <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
            <button
              onClick={handleCopyLink}
              className="group relative inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {copied ? (
                <>
                  Copied <Check className="h-3 w-3" />
                </>
              ) : (
                <>
                  Copy Link <Copy className="h-3 w-3" />
                </>
              )}
            </button>
          </Magnetic>
        </div>
      </div>
    </div>
  )
}