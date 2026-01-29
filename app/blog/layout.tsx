'use client'

import { ScrollProgress } from '@/components/ui/scroll-progress'
import { StructuredData } from '@/components/structured-data'
import { generateBlogPostSchema } from '@/lib/schema'
import { usePathname } from 'next/navigation'
import { TextSizeProvider, TextSizeControl } from '@/components/ui/text-size-control'

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
        datePublished: '2024-12-01',
        dateModified: '2024-12-01',
        image: '/og/3-ways-to-build-custom-middleware-in-aspnet-core.png',
        readingTime: 8,
      },
      'boxing-and-unboxing-in-csharp': {
        title: 'Boxing and Unboxing in C#',
        description: 'Understanding boxing and unboxing concepts in C# programming language.',
        datePublished: '2024-11-15',
        dateModified: '2024-11-15',
        image: '/og/boxing-and-unboxing-in-csharp.png',
        readingTime: 6,
      },
      'difference-between-cluster-and-non-cluster-index': {
        title: 'Difference Between Cluster and Non-Cluster Index',
        description: 'Learn the key differences between clustered and non-clustered indexes in database systems.',
        datePublished: '2024-11-01',
        dateModified: '2024-11-01',
        image: '/og/difference-between-cluster-and-non-cluster-index.png',
        readingTime: 7,
      },
      'simukernel-operating-system-concepts': {
        title: 'SimuKernel: OS Concepts Explained',
        description: 'SimuKernel is a kernel simulator that allows you to explore the internals of an operating system.',
        datePublished: '2024-12-10',
        dateModified: '2024-12-10',
        image: '/og/simukernel-operating-system-concepts.png',
        readingTime: 5,
      },
      'nginx-deep-dive-architecture-configuration-production-patterns': {
        title: 'Nginx Deep Dive: Architecture, Configuration, and Production Patterns',
        description: 'Master Nginx from request flow to production-grade deployment.',
        datePublished: '2025-01-28',
        dateModified: '2025-01-28',
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
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-gray-300 dark:bg-zinc-600"
        springOptions={{
          bounce: 0,
        }}
      />

      <main 
        className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-m-20 prose-lead:text-zinc-600 dark:prose-lead:text-zinc-400 prose-strong:font-semibold prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 mt-24 pb-20 transition-all duration-300"
        style={{ fontSize: `calc(1rem * var(--blog-text-size, 100) / 100)` }}
      >
        <article className="mx-auto">
          <TextSizeControl readingTimeMinutes={blogPostData?.readingTime} />
          {children}
        </article>
      </main>
    </TextSizeProvider>
  )
}
