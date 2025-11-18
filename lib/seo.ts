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
  languageAlternates?: Record<string, string>
  localeAlternates?: string[]
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
  languageAlternates = {},
  localeAlternates = [],
}: SEOParams): Metadata {
  const url = `${WEBSITE_URL}${path}`
  const fullTitle = path === '/' ? title : `${title} | Mohammed Mostafa`
  const baseKeywords = [
    'Mohammed Mostafa',
    'Software Engineer',
    'ASP.NET Core',
    'Node.js',
    'TypeScript',
    'Web Developer',
    'Backend Engineer',
    'Full Stack Developer',
  ]
  const keywords = Array.from(new Set([...baseKeywords, ...tags]))
  const ogImageUrl = ogImage.startsWith('http') ? ogImage : `${WEBSITE_URL}${ogImage}`
  const appLanguages = { 'en-US': url, ...languageAlternates }
  
  return {
    metadataBase: new URL(WEBSITE_URL),
    applicationName: 'Mohammed Mostafa Portfolio',
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: 'Mohammed Mostafa', url: WEBSITE_URL }],
    creator: 'Mohammed Mostafa',
    publisher: 'Mohammed Mostafa',
    category: 'Professional Portfolio',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Mohammed Mostafa Portfolio',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      'max-image-preview': 'large',
      'max-snippet': 160,
      'max-video-preview': 30,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-image-preview': 'large',
        'max-snippet': 160,
      },
    },
    alternates: {
      canonical: url,
      languages: appLanguages,
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      title: fullTitle,
      description,
      url,
      siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
      locale: 'en_US',
      alternateLocale: localeAlternates,
      images: [
        {
          url: ogImageUrl,
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
      ...(type === 'website' && {
        profile: {
          firstName: 'Mohammed',
          lastName: 'Mostafa',
          username: 'mohammed-software-engineer',
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mohameddtv',
      creator: '@mohameddtv',
      title: fullTitle,
      description,
      images: [
        {
          url: ogImageUrl,
          alt: fullTitle,
        },
      ],
    },
    other: {
      'article:author': 'Mohammed Mostafa',
      'og:email': 'mohammedmostafanazih@gmail.com',
      'og:locality': 'Egypt',
      'og:region': 'Middle East',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? {
            'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
          }
        : {},
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
