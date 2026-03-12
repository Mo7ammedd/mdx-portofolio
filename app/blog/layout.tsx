'use client'

import { ScrollProgress } from '@/components/ui/scroll-progress'
import { StructuredData } from '@/components/structured-data'
import { generateBlogPostSchema } from '@/lib/schema'
import { usePathname } from 'next/navigation'
import { TextSizeProvider, TextSizeControl } from '@/components/ui/text-size-control'
import { BlogSocialShare } from '@/components/ui/blog-social-share'
import { BlogHeader } from '@/components/ui/blog-header'
import { BlogNavigation } from '@/components/ui/blog-navigation'
import { TableOfContents } from '@/components/ui/table-of-contents'
import { BackToTop } from '@/components/ui/back-to-top'

export default function LayoutBlogPost({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const getBlogPostData = (pathname: string) => {
    const slug = pathname.split('/').pop()
    const blogPosts: Record<string, any> = {
      '3-ways-to-build-custom-middleware-in-aspnet-core': {
        title: '3 Ways to Build Custom Middleware in ASP.NET Core',
        description: 'Learn three different approaches to building custom middleware in ASP.NET Core applications.',
        datePublished: '2024-03-15',
        dateModified: '2024-03-15',
        image: '/og/3-ways-to-build-custom-middleware-in-aspnet-core.png',
        readingTime: 8,
      },
      'boxing-and-unboxing-in-csharp': {
        title: 'Boxing and Unboxing in C#',
        description: 'Understanding boxing and unboxing concepts in C# programming language.',
        datePublished: '2023-08-22',
        dateModified: '2023-08-22',
        image: '/og/boxing-and-unboxing-in-csharp.png',
        readingTime: 6,
      },
      'difference-between-cluster-and-non-cluster-index': {
        title: 'Difference Between Cluster and Non-Cluster Index',
        description: 'Learn the key differences between clustered and non-clustered indexes in database systems.',
        datePublished: '2023-11-10',
        dateModified: '2023-11-10',
        image: '/og/difference-between-cluster-and-non-cluster-index.png',
        readingTime: 7,
      },
      'simukernel-operating-system-concepts': {
        title: 'SimuKernel: OS Concepts Explained',
        description: 'SimuKernel is a kernel simulator that allows you to explore the internals of an operating system.',
        datePublished: '2025-10-29',
        dateModified: '2025-10-29',
        image: '/og/simukernel-operating-system-concepts.png',
        readingTime: 5,
      },
      'nginx-deep-dive-architecture-configuration-production-patterns': {
        title: 'Nginx Deep Dive: Architecture, Configuration, and Production Patterns',
        description: 'Master Nginx from request flow to production-grade deployment.',
        datePublished: '2026-01-15',
        dateModified: '2026-01-15',
        image: '/og/nginx-deep-dive-architecture-configuration-production-patterns.png',
        readingTime: 12,
      },
      'pagination-strategies-offset-vs-cursor': {
        title: 'Pagination Strategies: OFFSET vs Cursor Pagination',
        description: 'A deep technical dive into OFFSET and cursor-based pagination strategies — covering database internals, B-tree traversal, performance characteristics, and real-world implementation patterns.',
        datePublished: '2026-03-13',
        dateModified: '2026-03-13',
        image: '/og/pagination-strategies-offset-vs-cursor.png',
        readingTime: 15,
      },
    }
    return blogPosts[slug || ''] || null
  }

  const getNavigationPosts = (currentSlug: string | undefined) => {
    if (!currentSlug) return { previousPost: undefined, nextPost: undefined }
    const slugs = [
      { slug: 'boxing-and-unboxing-in-csharp', title: 'Deep Dive into C# Boxing and Unboxing', date: '2023-08-22' },
      { slug: 'difference-between-cluster-and-non-cluster-index', title: 'Clustered vs Non-Clustered Database Indexes', date: '2023-11-10' },
      { slug: '3-ways-to-build-custom-middleware-in-aspnet-core', title: '3 Ways to Build Custom Middleware in ASP.NET Core', date: '2024-03-15' },
      { slug: 'simukernel-operating-system-concepts', title: 'SimuKernel: OS Concepts Explained', date: '2025-10-29' },
      { slug: 'nginx-deep-dive-architecture-configuration-production-patterns', title: 'Nginx Deep Dive: Architecture & Production', date: '2026-01-15' },
      { slug: 'pagination-strategies-offset-vs-cursor', title: 'Pagination Strategies: OFFSET vs Cursor Pagination', date: '2026-03-13' },
    ]
    const sortedSlugs = [...slugs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const currentIndex = sortedSlugs.findIndex(p => p.slug === currentSlug)
    if (currentIndex === -1) return { previousPost: undefined, nextPost: undefined }
    return {
      previousPost: currentIndex < sortedSlugs.length - 1 ? sortedSlugs[currentIndex + 1] : undefined,
      nextPost: currentIndex > 0 ? sortedSlugs[currentIndex - 1] : undefined,
    }
  }

  const blogPostData = getBlogPostData(pathname)
  const { previousPost, nextPost } = getNavigationPosts(pathname.split('/').pop())

  const authorData = {
    name: 'Mohammed Mostafa',
    jobTitle: 'Software Engineer',
    description: 'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript.',
    url: 'https://www.modev.me',
    email: 'mohammedmostafanazih@gmail.com',
    image: 'https://www.modev.me/avatar.jpg',
    sameAs: ['https://github.com/Mo7ammedd', 'https://linkedin.com/in/mohammed-mostafa', 'https://twitter.com/mohameddtv'],
    knowsAbout: ['ASP.NET Core', 'Node.js', 'TypeScript', 'JavaScript', 'C#', 'Software Engineering'],
    alumniOf: 'Suez Canal University',
    location: 'Egypt',
  }

  if (pathname === '/blog') return <>{children}</>

  return (
    <TextSizeProvider>
      {blogPostData && (
        <StructuredData
          data={generateBlogPostSchema({
            title: blogPostData.title,
            description: blogPostData.description,
            url: `https://www.modev.me${pathname}`,
            datePublished: blogPostData.datePublished,
            dateModified: blogPostData.dateModified,
            author: authorData,
            image: blogPostData.image,
          })}
        />
      )}

      <ScrollProgress
        className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-zinc-900 dark:bg-zinc-100"
        springOptions={{ bounce: 0 }}
      />

      {blogPostData && (
        <BlogHeader
          datePublished={blogPostData.datePublished}
          title={blogPostData.title}
          readingTime={blogPostData.readingTime}
          previousPost={previousPost}
          nextPost={nextPost}
        />
      )}

      <BackToTop />

      <main
        className="prose prose-zinc dark:prose-invert max-w-none mt-20 pb-20 transition-all duration-300
          prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight
          prose-h1:text-3xl prose-h1:font-bold
          prose-h2:text-2xl prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800 prose-h2:pb-2
          prose-h3:text-xl
          prose-p:leading-7
          prose-a:font-medium prose-a:no-underline prose-a:transition-colors
          prose-strong:font-semibold
          prose-code:font-mono prose-code:text-sm
          [&_:not(pre)>code]:bg-zinc-100 dark:[&_:not(pre)>code]:bg-zinc-800
          [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded
          [&_:not(pre)>code]:border [&_:not(pre)>code]:border-zinc-200 dark:[&_:not(pre)>code]:border-zinc-700
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0 [&_pre_code]:rounded-none
          prose-blockquote:border-l-4 prose-blockquote:border-zinc-400 dark:prose-blockquote:border-zinc-600
          prose-blockquote:bg-zinc-50 dark:prose-blockquote:bg-zinc-900/50 prose-blockquote:py-2 prose-blockquote:px-4
          prose-img:rounded-lg prose-img:shadow-md"
        style={{ fontSize: `calc(1rem * var(--blog-text-size, 100) / 100)` }}
      >
        <article className="mx-auto">
          <TextSizeControl readingTimeMinutes={blogPostData?.readingTime} />
          <TableOfContents />
          {children}
          <BlogNavigation previousPost={previousPost} nextPost={nextPost} />
          {blogPostData && (
            <BlogSocialShare title={blogPostData.title} description={blogPostData.description} />
          )}
        </article>
      </main>
    </TextSizeProvider>
  )
}
