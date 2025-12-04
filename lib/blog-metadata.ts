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
  const baseKeywords = [
    'Mohammed Mostafa blog',
    'Software engineering',
    'Programming tutorial',
    'Web development',
    'Backend development',
    'ASP.NET Core',
    'Node.js',
    'TypeScript',
  ]
  const keywords = Array.from(new Set([...(meta.tags || []), ...baseKeywords]))
  
  return {
    metadataBase: new URL('https://www.mohammedd.tech'),
    title: `${meta.title} | Mohammed Mostafa`,
    description: meta.description,
    keywords,
    authors: [{ 
      name: meta.author?.name || 'Mohammed Mostafa', 
      url: meta.author?.url || 'https://www.mohammedd.tech' 
    }],
    creator: meta.author?.name || 'Mohammed Mostafa',
    publisher: 'Mohammed Mostafa',
    category: 'Technology',
    publishedTime: meta.publishDate,
    modifiedTime: meta.lastModified || meta.publishDate,
    applicationName: 'Mohammed Mostafa Portfolio',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'article',
      url,
      title: meta.title,
      description: meta.description,
      siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
      locale: 'en_US',
      publishedTime: meta.publishDate,
      modifiedTime: meta.lastModified || meta.publishDate,
      authors: [meta.author?.name || 'Mohammed Mostafa'],
      section: 'Technology',
      tags: meta.tags,
      images: meta.image ? [
        {
          url: `https://www.mohammedd.tech${meta.image}`,
          width: 1200,
          height: 630,
          alt: meta.title,
          type: 'image/png',
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mohameddtv',
      creator: '@mohameddtv',
      title: meta.title,
      description: meta.description,
      images: meta.image ? [
        {
          url: `https://www.mohammedd.tech${meta.image}`,
          alt: meta.title,
        }
      ] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        'en-US': url,
      },
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': 160,
      'max-video-preview': 30,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': 160,
      },
    },
  }
}

export function generateBlogPostStructuredData(meta: BlogPostMeta, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.title,
    description: meta.description,
    url: `https://www.mohammedd.tech/blog/${slug}`,
    datePublished: meta.publishDate,
    dateModified: meta.lastModified || meta.publishDate,
    author: {
      '@type': 'Person',
      name: meta.author?.name || 'Mohammed Mostafa',
      url: meta.author?.url || 'https://www.mohammedd.tech',
      image: meta.author?.image || 'https://www.mohammedd.tech/avatar.jpg',
      jobTitle: 'Software Engineer',
    },
    publisher: {
      '@type': 'Person',
      name: 'Mohammed Mostafa',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.mohammedd.tech/avatar.jpg',
        width: 400,
        height: 400,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.mohammedd.tech/blog/${slug}`,
    },
    image: meta.image ? `https://www.mohammedd.tech${meta.image}` : 'https://www.mohammedd.tech/og-image.png',
    keywords: meta.tags?.join(', '),
    articleSection: 'Technology',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(meta.readingTime && {
      timeRequired: meta.readingTime,
    }),
  }
}
