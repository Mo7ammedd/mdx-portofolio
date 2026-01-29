'use client'

import { usePathname } from 'next/navigation'
import { Share2, Mail, Link2, Copy, Check } from 'lucide-react'
import { Icons } from '@/components/icons'
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
  const encodedDescription = description ? encodeURIComponent(description) : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      name: 'X (Twitter)',
      icon: Icons.x,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-zinc-900 dark:hover:text-zinc-100',
    },
    {
      name: 'LinkedIn',
      icon: Icons.linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-[#0077b5]',
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-[#1877f2]',
    },
    {
      name: 'Reddit',
      icon: RedditIcon,
      url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:text-[#ff4500]',
    },
    {
      name: 'Telegram',
      icon: TelegramIcon,
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:text-[#0088cc]',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      color: 'hover:text-zinc-900 dark:hover:text-zinc-100',
    },
  ]

  return (
    <div className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Share2 className="h-5 w-5" />
          <span className="text-base font-medium">Share this blog</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {shareLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${link.name}`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:scale-110 dark:border-zinc-800 dark:text-zinc-400 ${link.color}`}
            >
              <link.icon className="h-5 w-5" />
            </a>
          ))}
          <button
            onClick={handleCopyLink}
            aria-label="Copy link"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-all hover:scale-110 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

// Facebook Icon
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

// Reddit Icon
function RedditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  )
}

// Telegram Icon
function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}
