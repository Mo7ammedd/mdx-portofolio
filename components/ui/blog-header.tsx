'use client'

import { Calendar } from 'lucide-react'

interface BlogHeaderProps {
  datePublished: string
}

export function BlogHeader({ datePublished }: BlogHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="mb-8 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <Calendar className="h-4 w-4" />
      <time dateTime={datePublished}>{formatDate(datePublished)}</time>
    </div>
  )
}
