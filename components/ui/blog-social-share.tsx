'use client'

import { usePathname } from 'next/navigation'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface BlogSocialShareProps {
  title: string
  description?: string
}

export function BlogSocialShare({ title }: BlogSocialShareProps) {
  const pathname = usePathname()
  const [copyFeedback, setCopyFeedback] = useState<{
    url: string
    status: 'copying' | 'copied' | 'error'
  } | null>(null)
  const url = `https://www.modev.me${pathname ?? '/blog'}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const copyStatus = copyFeedback?.url === url ? copyFeedback.status : 'idle'

  const handleCopyLink = async () => {
    setCopyFeedback({ url, status: 'copying' })

    try {
      await navigator.clipboard.writeText(url)
      setCopyFeedback({ url, status: 'copied' })
    } catch {
      setCopyFeedback({ url, status: 'error' })
    }
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
      label: 'Reddit',
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
  ]

  return (
    <div className="not-prose mt-8 border-t border-white/[0.07] pt-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <span className="text-xs text-zinc-400">Share</span>
        {shareLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share ${title} on ${link.label}`}
            className="inline-flex min-h-9 items-center text-xs text-zinc-400 no-underline transition-colors hover:text-zinc-100 motion-reduce:transition-none"
          >
            {link.label}
          </a>
        ))}
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={copyStatus === 'copying'}
          aria-label="Copy article link"
          aria-busy={copyStatus === 'copying'}
          className="inline-flex min-h-9 items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-100 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
        >
          {copyStatus === 'copied' ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copyStatus === 'copied'
            ? 'Copied'
            : copyStatus === 'copying'
              ? 'Copying…'
              : 'Copy link'}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          copyStatus === 'error'
            ? 'mt-2 text-xs leading-5 text-zinc-400'
            : 'sr-only'
        }
      >
        {copyStatus === 'copied'
          ? 'Link copied to clipboard.'
          : copyStatus === 'error'
            ? 'Couldn’t copy the link. Copy the address from your browser.'
            : ''}
      </p>
    </div>
  )
}
