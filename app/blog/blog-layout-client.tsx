'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

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
import { getRelatedPosts } from '@/lib/related-posts'
import { getProjectsForArticle } from '@/lib/project-links'

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
  const relatedPosts = post ? getRelatedPosts(post, posts) : []
  const relatedProjects = post ? getProjectsForArticle(post.slug) : []

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
        className="fixed inset-x-0 top-0 z-40 h-px bg-zinc-400"
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

        {relatedProjects.length > 0 && (
          <aside
            aria-label="Related projects"
            className="mb-8 rounded-md border border-white/10 bg-white/[0.02] px-4 py-3"
          >
            {relatedProjects.map((project) => (
              <div
                key={project.slug}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-link text-zinc-300"
                  data-project-name={project.title}
                  data-link-type="case_study"
                >
                  Explore {project.title}{' '}
                  <ArrowUpRight aria-hidden="true" className="size-3" />
                </Link>
                {project.slug === 'simukernel' && (
                  <Link
                    href="/projects/simukernel#scheduler"
                    className="text-link"
                    data-project-name={project.title}
                    data-link-type="demo"
                  >
                    Try the scheduling playground{' '}
                    <ArrowUpRight aria-hidden="true" className="size-3" />
                  </Link>
                )}
              </div>
            ))}
          </aside>
        )}

        <article
          id="article-content"
          className="prose prose-zinc prose-invert prose-strong:font-semibold max-w-none [&_pre_code]:rounded-none [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
          style={{ fontSize: 'calc(1rem * var(--blog-text-size, 100) / 100)' }}
        >
          {children}
        </article>

        {relatedPosts.length > 0 && (
          <section
            aria-labelledby="related-reading-title"
            className="mt-10 border-t border-white/10 pt-6"
          >
            <h2 id="related-reading-title" className="section-heading mb-2">
              Related reading
            </h2>
            <ul className="divide-y divide-white/[0.07]">
              {relatedPosts.map((relatedPost) => (
                <li key={relatedPost.slug}>
                  <Link
                    href={`/blog/${relatedPost.slug}`}
                    className="list-row flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm leading-6 text-zinc-200">
                        {relatedPost.title}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-zinc-400">
                        {relatedPost.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 size-3.5 shrink-0 text-zinc-500"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
        <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
        {post && <BlogSocialShare title={post.title} />}
      </main>
    </TextSizeProvider>
  )
}
