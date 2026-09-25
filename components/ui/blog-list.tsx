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
        <ol aria-label="Articles" className="mt-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid min-h-11 grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3 rounded-sm py-2 leading-7 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              >
                <time
                  dateTime={post.publishedTime}
                  className="text-sm text-zinc-400 tabular-nums"
                >
                  {formatDate(post.publishedTime)}
                </time>
                <h2 className="text-base font-normal text-zinc-200 decoration-zinc-500 underline-offset-4 group-hover:underline">
                  {post.title}
                </h2>
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
