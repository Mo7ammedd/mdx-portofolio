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
      creator: '@mohamedtv',
      images: meta.image ? [`https://www.mohammedd.tech${meta.image}`] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}
