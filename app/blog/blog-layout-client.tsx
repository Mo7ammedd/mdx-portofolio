'use client'

import { usePathname } from 'next/navigation'

import { StructuredData } from '@/components/structured-data'
import { BlogHeader } from '@/components/ui/blog-header'
import { BlogNavigation } from '@/components/ui/blog-navigation'
import { BlogSocialShare } from '@/components/ui/blog-social-share'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { TableOfContents } from '@/components/ui/table-of-contents'
import {
  TextSizeControl,
  TextSizeProvider,
} from '@/components/ui/text-size-control'
import type { BlogPost } from '@/lib/blog-utils'
import { generateBlogPostSchema } from '@/lib/schema'

const author = {
  name: 'Mohammed Mostafa',
  jobTitle: 'Software Engineer',
  description:
    'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript.',
  url: 'https://www.modev.me',
  email: 'mohammedmostafanazih@gmail.com',
  image: 'https://www.modev.me/avatar.jpg',
  sameAs: [
    'https://github.com/Mo7ammedd',
    'https://linkedin.com/in/mohammed-mostafa',
    'https://twitter.com/mohameddtv',
  ],
  knowsAbout: [
    'ASP.NET Core',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'C#',
    'Software Engineering',
  ],
  alumniOf: 'Suez Canal University',
  location: 'Egypt',
}

export function BlogLayoutClient({
  children,
  posts,
}: {
  children: React.ReactNode
  posts: BlogPost[]
}) {
  const pathname = usePathname()

  if (pathname === '/blog') return <>{children}</>

  const postIndex = posts.findIndex((post) => pathname === `/blog/${post.slug}`)
  const post = posts[postIndex]
  const previousPost = postIndex >= 0 ? posts[postIndex + 1] : undefined
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : undefined

  return (
    <TextSizeProvider>
      {post && (
        <StructuredData
          data={generateBlogPostSchema({
            title: post.title,
            description: post.description,
            url: `https://www.modev.me${pathname}`,
            datePublished: post.publishedTime,
            dateModified: post.modifiedTime ?? post.publishedTime,
            author,
            image: post.image,
          })}
        />
      )}

      <ScrollProgress
        className="fixed inset-x-0 top-1 z-40 h-px bg-zinc-400"
        springOptions={{ bounce: 0 }}
      />

      <main className="min-w-0">
        {post && (
          <BlogHeader
            datePublished={post.publishedTime}
            title={post.title}
            readingTime={post.readingTime}
          />
        )}

        <div className="my-6 space-y-3 sm:mb-8">
          <TextSizeControl />
          <TableOfContents />
        </div>

        <article
          id="article-content"
          className="prose prose-zinc prose-invert prose-strong:font-semibold max-w-none [&_pre_code]:rounded-none [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
          style={{ fontSize: 'calc(1rem * var(--blog-text-size, 100) / 100)' }}
        >
          {children}
        </article>

        <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
        {post && <BlogSocialShare title={post.title} />}
      </main>
    </TextSizeProvider>
  )
}
