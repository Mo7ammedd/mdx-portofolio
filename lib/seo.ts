import { Metadata } from 'next'
import { WEBSITE_URL } from './constants'

interface SEOParams {
  title: string
  description: string
  path: string
  ogImage?: string
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  type?: 'website' | 'article'
  tags?: string[]
}

export function generateSEO({
  title,
  description,
  path,
  ogImage = '/og-image.png',
  noIndex = false,
  publishedTime,
  modifiedTime,
  type = 'website',
  tags = [],
}: SEOParams): Metadata {
  const url = `${WEBSITE_URL}${path}`
  const fullTitle = path === '/' ? title : `${title} | Mohammed Mostafa`
  
  return {
    title: fullTitle,
    description,
    keywords: [
      'Mohammed Mostafa',
      'Software Engineer',
      'ASP.NET Core',
      'Node.js',
      'TypeScript',
      'Web Developer',
      ...tags,
    ],
    authors: [{ name: 'Mohammed Mostafa', url: WEBSITE_URL }],
    creator: 'Mohammed Mostafa',
    publisher: 'Mohammed Mostafa',
    robots: {
      index: !noIndex,
      follow: !noIndex,
      'max-image-preview': 'large',
      'max-snippet': 160,
      'max-video-preview': 30,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      title: fullTitle,
      description,
      url,
      siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
      locale: 'en_US',
      images: [
        {
          url: `${WEBSITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: 'image/png',
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: ['Mohammed Mostafa'],
        section: 'Technology',
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mohameddtv',
      creator: '@mohameddtv',
      title: fullTitle,
      description,
      images: [`${WEBSITE_URL}${ogImage}`],
    },
    other: {
      'article:author': 'Mohammed Mostafa',
      'og:email': 'mohammedmostafanazih@gmail.com',
      'og:locality': 'Egypt',
      'og:region': 'Middle East',
    },
  }
}

export function generateCanonicalUrl(path: string): string {
  return `${WEBSITE_URL}${path}`
}

export function generateBlogPostSEO({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  tags = [],
}: {
  title: string
  description: string
  slug: string
  publishedTime: string
  modifiedTime?: string
  tags?: string[]
}): Metadata {
  return generateSEO({
    title,
    description,
    path: `/blog/${slug}`,
    ogImage: `/og/${slug}.png`,
    type: 'article',
    publishedTime,
    modifiedTime,
    tags: ['blog', 'tutorial', 'programming', ...tags],
  })
}
