import Link from 'next/link'

import type { BlogPost } from '@/lib/blog-utils'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function BlogList({ posts }: { posts: BlogPost[] }) {
  return (
    <main aria-labelledby="writing-title">
      <h1
        id="writing-title"
        className="text-[28px] leading-9 font-medium tracking-tight text-zinc-100"
      >
        Writing
      </h1>
      <p className="mt-4 text-base leading-7 text-zinc-300">
        I write about backend engineering, databases, networking, and operating
        systems.
      </p>

      {posts.length > 0 ? (
        <ol
          aria-label="Articles"
          className="mt-8 divide-y divide-white/10 border-y border-white/10"
        >
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                aria-labelledby={`${post.slug}-title`}
                className="group grid gap-y-2 rounded-sm py-6 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-x-6 sm:py-7"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-6 text-zinc-400 sm:flex-col sm:items-start sm:gap-1 sm:pt-0.5">
                  <time dateTime={post.publishedTime} className="tabular-nums">
                    {formatDate(post.publishedTime)}
                  </time>
                  <span aria-hidden="true" className="sm:hidden">
                    ·
                  </span>
                  <span>{post.readingTime} min read</span>
                </div>
                <div className="min-w-0">
                  <h2
                    id={`${post.slug}-title`}
                    className="text-lg leading-7 font-medium tracking-[-0.015em] text-zinc-100 decoration-zinc-500 underline-offset-4 group-hover:underline"
                  >
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-2 text-[15px] leading-7 text-zinc-400">
                      {post.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-8 text-base leading-7 text-zinc-400">
          No articles yet.
        </p>
      )}

      <nav
        aria-label="Writing resources"
        className="mt-8 flex flex-wrap items-center gap-x-5"
      >
        <Link href="/blog/paths" className="text-link text-sm">
          Reading paths
        </Link>
        <Link href="/blog/saved" className="text-link text-sm">
          Saved articles
        </Link>
        <Link href="/blog/glossary" className="text-link text-sm">
          Glossary
        </Link>
      </nav>
    </main>
  )
}
