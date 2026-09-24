import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { readingPaths } from '@/lib/reading-paths'
import { generateSEO } from '@/lib/seo'
import {
  ArticleReadBadge,
  ReadingPathProgress,
} from '@/components/ui/reading-library'

export const metadata = generateSEO({
  title: 'Reading paths',
  description:
    'Guided paths through database performance, C# and ASP.NET Core, and systems fundamentals, with prerequisites and a suggested reading order.',
  path: '/blog/paths',
})

export default async function ReadingPathsPage() {
  const posts = await getAllBlogPosts()
  return (
    <main>
      <Link href="/blog" className="text-link mb-5">
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All writing
      </Link>
      <h1 className="page-title">Reading paths</h1>
      <p className="page-description mt-5">
        Choose a topic and build on each article in order. Each path starts with
        what you should already know.
      </p>
      <div className="mt-10 space-y-8">
        {readingPaths.map((path) => {
          const steps = path.steps.flatMap((step) => {
            const post = posts.find((post) => post.slug === step.slug)
            return post ? [{ ...step, post }] : []
          })
          return (
            <section
              key={path.slug}
              id={path.slug}
              aria-labelledby={`${path.slug}-title`}
              className="scroll-mt-8 rounded-md border border-white/10 p-5 sm:p-6"
            >
              <p className="section-heading mb-3">
                {steps.length} articles ·{' '}
                {steps.reduce(
                  (total, step) => total + step.post.readingTime,
                  0,
                )}{' '}
                min
              </p>
              <h2
                id={`${path.slug}-title`}
                className="text-xl font-medium text-zinc-100"
              >
                {path.title}
              </h2>
              <p className="body-copy mt-3">{path.description}</p>
              <ReadingPathProgress slugs={steps.map((step) => step.slug)} />
              <p className="mt-4 border-l border-white/15 pl-3 text-xs leading-6 text-zinc-400">
                <span className="text-zinc-200">Before you start:</span>{' '}
                {path.prerequisites.join('; ')}.
              </p>
              <ol className="mt-5 divide-y divide-white/[0.07]">
                {steps.map((step, index) => (
                  <li key={step.slug}>
                    <Link
                      href={`/blog/${step.slug}`}
                      className="list-row flex gap-3 py-4"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 font-mono text-xs text-zinc-500"
                      >
                        0{index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="item-title">{step.post.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
                          {step.outcome}
                        </p>
                        <ArticleReadBadge slug={step.slug} />
                      </div>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-1 size-3.5 shrink-0 text-zinc-500"
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          )
        })}
      </div>
    </main>
  )
}
