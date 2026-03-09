import Link from 'next/link'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react'

export const metadata = {
  title: 'Blog — Mohammed Mostafa',
  description: 'Articles on backend engineering, .NET, Node.js, system design, and more.',
}

const glassStyle = {
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 4px 32px rgba(0, 0, 0, 0.2)',
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="mb-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Blog
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {posts.length} articles on backend engineering, system design, and more.
        </p>
      </div>

      {/* Posts list */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01]"
            style={glassStyle}
          >
            <div className="flex flex-col gap-3">
              {/* Title */}
              <h2 className="text-base font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                {post.title}
              </h2>

              {/* Description */}
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {post.description}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedTime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min read
                </span>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag className="h-3 w-3 text-zinc-500" />
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(161,161,170,1)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
