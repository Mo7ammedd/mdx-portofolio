'use client'

import { ScrollProgress } from '@/components/ui/scroll-progress'
import { StructuredData } from '@/components/structured-data'
import { generateBlogPostSchema } from '@/lib/schema'
import { usePathname } from 'next/navigation'

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
      },
      'boxing-and-unboxing-in-csharp': {
        title: 'Boxing and Unboxing in C#',
        description: 'Understanding boxing and unboxing concepts in C# programming language.',
        datePublished: '2024-11-15',
        dateModified: '2024-11-15',
        image: '/og/boxing-and-unboxing-in-csharp.png',
      },
      'difference-between-cluster-and-non-cluster-index': {
        title: 'Difference Between Cluster and Non-Cluster Index',
        description: 'Learn the key differences between clustered and non-clustered indexes in database systems.',
        datePublished: '2024-11-01',
        dateModified: '2024-11-01',
        image: '/og/difference-between-cluster-and-non-cluster-index.png',
      },
    }
    
    return blogPosts[slug || ''] || null
  }

  const blogPostData = getBlogPostData(pathname)
  
  const authorData = {
    name: 'Mohammed Mostafa',
    jobTitle: 'Software Engineer',
    description: 'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript.',
    url: 'https://www.mohammedd.tech',
    email: 'mohammedmostafanazih@gmail.com',
    image: 'https://www.mohammedd.tech/avatar.jpg',
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
    <>
      {blogPostData && (
        <StructuredData 
          data={generateBlogPostSchema({
            title: blogPostData.title,
            description: blogPostData.description,
            url: `https://www.mohammedd.tech${pathname}`,
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

      <main className="prose prose-gray prose-h4:prose-base dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium mt-24 pb-20">{children}</main>
    </>
  )
}
