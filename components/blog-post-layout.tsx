import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { StructuredData } from '@/components/structured-data'
import { BlogHeader } from '@/components/ui/blog-header'
import { BlogNavigation } from '@/components/ui/blog-navigation'
import { BlogSocialShare } from '@/components/ui/blog-social-share'
import { BlogSearchDialog } from '@/components/ui/blog-search-dialog'
import { ResumeReading } from '@/components/ui/resume-reading'
import { ArticleFragment } from '@/components/ui/article-fragment'
import {
  ReadingStorageNotice,
  SaveArticleButton,
} from '@/components/ui/reading-library'
import {
  ArticleReadingPath,
  ContinueReadingPath,
} from '@/components/ui/article-reading-path'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import {
  TableOfContents,
  type BlogHeading,
} from '@/components/ui/table-of-contents'
import {
  TextSizeControl,
  TextSizeProvider,
} from '@/components/ui/text-size-control'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { WEBSITE_URL } from '@/lib/constants'
import { generateBlogPostSchema } from '@/lib/schema'
import { getRelatedPosts } from '@/lib/related-posts'
import { getProjectsForArticle } from '@/lib/project-links'
import { blogVerifications } from '@/lib/blog-freshness'

const author = {
  name: 'Mohammed Mostafa',
  jobTitle: 'Software Engineer',
  description:
    'Software engineer working with ASP.NET Core, Node.js, Express.js, and TypeScript.',
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

export async function BlogPostLayout({
  children,
  slug,
  headings,
  articleTitle,
}: {
  children: ReactNode
  slug: string
  headings: BlogHeading[]
  articleTitle?: string
}) {
  const posts = await getAllBlogPosts()
  const postIndex = posts.findIndex((post) => post.slug === slug)
  const post = posts[postIndex]
  if (!post) notFound()

  const previousPost = postIndex >= 0 ? posts[postIndex + 1] : undefined
  const nextPost = postIndex > 0 ? posts[postIndex - 1] : undefined
  const relatedPosts = getRelatedPosts(post, posts)
  const relatedProjects = getProjectsForArticle(slug)

  return (
    <TextSizeProvider>
      <ArticleFragment slug={slug} />
      <StructuredData
        data={generateBlogPostSchema({
          title: post.title,
          description: post.description,
          url: `${WEBSITE_URL}/blog/${slug}`,
          datePublished: post.publishedTime,
          dateModified: post.modifiedTime ?? post.publishedTime,
          author,
          image: post.image,
        })}
      />

      <ScrollProgress
        className="fixed inset-x-0 top-0 z-40 h-px bg-zinc-400"
        springOptions={{ bounce: 0 }}
      />

      <main className="blog-post min-w-0">
        <div className="blog-reading-column">
          <BlogHeader
            datePublished={post.publishedTime}
            dateModified={post.modifiedTime}
            verification={blogVerifications[slug]}
            title={articleTitle || post.title}
            description={post.description}
            readingTime={post.readingTime}
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-4">
            <TextSizeControl />
            <div className="flex flex-wrap items-center gap-2">
              <BlogSearchDialog />
              <SaveArticleButton slug={slug} />
            </div>
          </div>
          <ReadingStorageNotice />
        </div>

        <aside className="blog-contents" aria-label="Article navigation">
          <TableOfContents key={slug} headings={headings} slug={slug} />
        </aside>

        <div className="blog-reading-column min-w-0 pt-7 sm:pt-8">
          <ResumeReading key={slug} slug={slug} headings={headings} />
          <ArticleReadingPath slug={slug} posts={posts} />
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
            className="blog-prose prose prose-zinc prose-invert prose-strong:font-semibold max-w-none"
          >
            {children}
          </article>

          <ContinueReadingPath slug={slug} posts={posts} />

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
                        <p className="item-title">{relatedPost.title}</p>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">
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
          <BlogSocialShare title={post.title} />
        </div>
      </main>
    </TextSizeProvider>
  )
}
