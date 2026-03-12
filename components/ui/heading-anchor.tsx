'use client'

import { useRef, useState, useMemo } from 'react'
import { Hash } from 'lucide-react'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

function getChildText(children: React.ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getChildText).join('')
  if (children !== null && typeof children === 'object' && 'props' in children) {
    return getChildText((children as any).props?.children)
  }
  return ''
}

interface HeadingAnchorProps {
  level: 2 | 3 | 4
  className?: string
  children?: React.ReactNode
}

export function HeadingAnchor({ level, className, children }: HeadingAnchorProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)

  const id = useMemo(() => slugify(getChildText(children)), [children])

  const handleCopyAnchor = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.href.split('#')[0]}#${id}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)

    // Also scroll smoothly
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const Tag = `h${level}` as 'h2' | 'h3' | 'h4'

  return (
    <Tag id={id} ref={ref} className={`group flex items-center gap-2 ${className}`}>
      {children}
      <button
        onClick={handleCopyAnchor}
        className="flex-shrink-0 rounded p-0.5 opacity-0 transition-all group-hover:opacity-100 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        title="Copy link to section"
        aria-label="Copy link to section"
      >
        {copied ? (
          <span className="text-xs text-emerald-500 font-medium">✓</span>
        ) : (
          <Hash className="h-4 w-4" />
        )}
      </button>
    </Tag>
  )
}
