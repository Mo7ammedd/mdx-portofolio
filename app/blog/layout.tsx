'use client'

import { ScrollProgress } from '@/components/ui/scroll-progress'
import { StructuredData } from '@/components/structured-data'
import { generateBlogPostSchema } from '@/lib/schema'
import { usePathname } from 'next/navigation'
import { TextSizeProvider, TextSizeControl } from '@/components/ui/text-size-control'
import { BlogSocialShare } from '@/components/ui/blog-social-share'
import { BlogHeader } from '@/components/ui/blog-header'

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Extract blog post data
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
    }
    
    return blogPosts[slug || ''] || null
  }

  const blogPostData = getBlogPostData(pathname)
  
  const authorData = {
    name: 'Mohammed Mostafa',
    jobTitle: 'Software Engineer',
    description: 'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript.',
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
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-gradient-to-b from-white to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:from-zinc-950" />
      <ScrollProgress
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-zinc-100 dark:to-zinc-100"
        springOptions={{
          bounce: 0,
        }}
      />

      <main 
        className="prose prose-zinc dark:prose-invert max-w-none 
        prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:font-bold prose-h1:text-zinc-900 dark:prose-h1:text-zinc-100
        prose-h2:text-2xl prose-h2:text-zinc-800 dark:prose-h2:text-zinc-200 prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800 prose-h2:pb-2
        prose-h3:text-xl prose-h3:text-zinc-800 dark:prose-h3:text-zinc-200
        prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-p:leading-7
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:font-semibold prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:font-mono prose-code:text-sm 
        prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800
        prose-blockquote:border-l-4 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-400 
        prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-2 prose-blockquote:px-4
        prose-li:text-zinc-700 dark:prose-li:text-zinc-300
        prose-img:rounded-lg prose-img:shadow-md
        mt-24 pb-20 transition-all duration-300"
        style={{ fontSize: `calc(1rem * var(--blog-text-size, 100) / 100)` }}
      >
        <article className="mx-auto">
          <TextSizeControl readingTimeMinutes={blogPostData?.readingTime} />
          {blogPostData && <BlogHeader datePublished={blogPostData.datePublished} />}
          {children}
          {blogPostData && (
            <BlogSocialShare 
              title={blogPostData.title} 
              description={blogPostData.description}
            />
          )}
        </article>
      </main>
    </TextSizeProvider>
  )
}
