import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface BlogNavigationProps {
  previousPost?: { slug: string; title: string }
  nextPost?: { slug: string; title: string }
}

export function BlogNavigation({
  previousPost,
  nextPost,
}: BlogNavigationProps) {
  if (!previousPost && !nextPost) return null

  return (
    <nav
      aria-label="Article navigation"
      className="not-prose mt-12 grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-5 sm:grid-cols-2 sm:gap-8"
    >
      {previousPost && (
        <Link
          href={`/blog/${previousPost.slug}`}
          aria-label={`Older article: ${previousPost.title}`}
          className="group flex min-w-0 flex-col gap-2 py-1 no-underline"
        >
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Older article
          </span>
          <span className="text-sm leading-6 text-zinc-200 transition-colors group-hover:text-white group-focus-visible:text-white motion-reduce:transition-none">
            {previousPost.title}
          </span>
        </Link>
      )}

      {nextPost && (
        <Link
          href={`/blog/${nextPost.slug}`}
          aria-label={`Newer article: ${nextPost.title}`}
          className="group flex min-w-0 flex-col gap-2 py-1 no-underline sm:col-start-2 sm:items-end sm:text-right"
        >
          <span className="flex items-center gap-1.5 text-xs text-zinc-400">
            Newer article
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </span>
          <span className="text-sm leading-6 text-zinc-200 transition-colors group-hover:text-white group-focus-visible:text-white motion-reduce:transition-none">
            {nextPost.title}
          </span>
        </Link>
      )}
    </nav>
  )
}
