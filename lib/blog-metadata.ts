export interface BlogPostMeta {
  title: string
  description: string
  publishDate: string
  lastModified?: string
  readingTime?: string
  tags?: string[]
  author?: {
    name: string
    url: string
    image: string
  }
  image?: string
}

export interface BlogPostSchemaData {
  title: string
  description: string
  datePublished: string
  dateModified: string
  image: string
}

// Central blog post metadata for static generation and SEO
export const BLOG_POST_METADATA: Record<string, BlogPostSchemaData> = {
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

// Get all blog post slugs for static generation
export function getAllBlogSlugs(): string[] {
  return Object.keys(BLOG_POST_METADATA)
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

export function generateBlogMetadata(meta: BlogPostMeta, slug: string) {
  const url = `https://www.mohammedd.tech/blog/${slug}`
  
  return {
    title: `${meta.title} | Mohammed Mostafa`,
    description: meta.description,
    keywords: [
      ...(meta.tags || []),
      'Mohammed Mostafa blog',
      'Software engineering',
      'Programming tutorial',
      'Web development',
    ],
    authors: [{ 
      name: meta.author?.name || 'Mohammed Mostafa', 
      url: meta.author?.url || 'https://www.mohammedd.tech' 
    }],
    publishedTime: meta.publishDate,
    modifiedTime: meta.lastModified || meta.publishDate,
    openGraph: {
      type: 'article',
      url,
      title: meta.title,
      description: meta.description,
      publishedTime: meta.publishDate,
      modifiedTime: meta.lastModified || meta.publishDate,
      authors: [meta.author?.name || 'Mohammed Mostafa'],
      images: meta.image ? [
        {
          url: `https://www.mohammedd.tech${meta.image}`,
          width: 1200,
          height: 630,
          alt: meta.title,
        }
      ] : [],
      tags: meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      creator: '@mohameddtv',
      images: meta.image ? [`https://www.mohammedd.tech${meta.image}`] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}
