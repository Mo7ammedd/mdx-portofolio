import Link from 'next/link'
import { ArrowRight, ChevronDown, Route } from 'lucide-react'
import type { BlogPost } from '@/lib/blog-utils'
import { getArticleReadingPath } from '@/lib/reading-paths'

export function ArticleReadingPath({
  slug,
  posts,
}: {
  slug: string
  posts: BlogPost[]
}) {
  const context = getArticleReadingPath(slug)
  if (!context) return null
  const { path, index } = context
  return (
    <details className="not-prose group/path mb-6 rounded-lg border border-white/10 bg-white/[0.015]">
      <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2.5 px-4 py-3 text-xs text-zinc-400 [&::-webkit-details-marker]:hidden">
        <Route aria-hidden="true" className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 leading-5">
          <span className="text-zinc-200">{path.title}</span> · Step {index + 1}{' '}
          of {path.steps.length}
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform group-open/path:rotate-180"
        />
      </summary>
      <div className="border-t border-white/[0.07] px-4 pt-3 pb-4">
        <p className="text-xs leading-6 text-zinc-400">
          <span className="text-zinc-200">Before you start:</span>{' '}
          {path.prerequisites.join('; ')}.
        </p>
        <ol className="mt-3 space-y-2">
          {path.steps.map((step, position) => {
            const title = posts.find((post) => post.slug === step.slug)?.title
            if (!title) return null
            return (
              <li key={step.slug} className="flex gap-2 text-xs leading-6">
                <span aria-hidden="true" className="font-mono text-zinc-500">
                  {position + 1}.
                </span>
                {step.slug === slug ? (
                  <span aria-current="step" className="text-zinc-200">
                    {title}{' '}
                    <span className="text-zinc-500">(you are here)</span>
                  </span>
                ) : (
                  <Link
                    href={`/blog/${step.slug}`}
                    className="text-zinc-400 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                  >
                    {title}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
        <Link href={`/blog/paths#${path.slug}`} className="text-link mt-2">
          View this reading path{' '}
          <ArrowRight aria-hidden="true" className="size-3" />
        </Link>
      </div>
    </details>
  )
}

export function ContinueReadingPath({
  slug,
  posts,
}: {
  slug: string
  posts: BlogPost[]
}) {
  const context = getArticleReadingPath(slug)
  if (!context) return null
  const next = posts.find((post) => post.slug === context.next?.slug)
  return (
    <section
      aria-label="Continue your reading path"
      className="mt-10 rounded-lg border border-white/10 px-5 py-4"
    >
      <p className="section-heading mb-2">{context.path.title}</p>
      <Link
        href={next ? `/blog/${next.slug}` : '/blog/paths'}
        className="flex min-h-10 items-center justify-between gap-4 text-sm leading-6 text-zinc-200 hover:text-white"
      >
        <span>
          {next
            ? `Next: ${next.title}`
            : 'You’ve reached the end of this path. Explore another.'}
        </span>
        <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
      </Link>
    </section>
  )
}
