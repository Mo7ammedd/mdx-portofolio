import { Metadata } from 'next'

export const siteConfig: Metadata = {
  // More specific and searchable title variations
  title: {
    default:
      'Mohammed Mostafa | Backend and Platform Software Engineer',
    template: '%s | Mohammed Mostafa',
  },
  description:
    'Backend and platform software engineer in Cairo building deployment platforms, agent runtimes, and application backends with C#, TypeScript, and Go.',
  keywords: [
    'Mohammed Mostafa',
    'Backend and Platform Software Engineer',
    'Cairo Egypt',
    'C#',
    'ASP.NET Core',
    'TypeScript',
    'Go',
    'Node.js',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Deployment platforms',
    'Agent runtimes',
    'Software engineering projects',
  ],
  authors: [{ name: 'Mohammed Mostafa', url: 'https://www.momostafa.tech' }],
  creator: 'Mohammed - Software Engineer',
  publisher: 'Mohammed Portfolio Website',

  // Add structured data hints and meta properties
  other: {
    // Profile metadata
    'og:profile:first_name': 'Mohammed',
    'og:profile:last_name': 'Mostafa',
    'og:profile:username': 'Mo7ammedd',

    // Professional info
    'article:author': 'Mohammed Mostafa',

    // App-specific
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#1c1c1c',
  },

  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://www.momostafa.tech',
    siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
    title: 'Mohammed Mostafa | Backend and Platform Software Engineer',
    description:
      'Backend and platform software engineer in Cairo. Deployment control planes, agent runtimes, database internals, and backend application development.',
    emails: ['mohammedmostafanazih@gmail.com'],
    countryName: 'Egypt',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mohameddtv',
    creator: '@mohameddtv',
    title: 'Mohammed Mostafa | Backend and Platform Software Engineer',
    description:
      'Backend and platform engineering: deployment control planes, agent runtimes, database internals, and application backends.',
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

  alternates: {
    canonical: 'https://www.momostafa.tech',
    languages: {
      'en-US': 'https://www.momostafa.tech',
    },
    types: {
      'application/rss+xml': 'https://www.momostafa.tech/blog/rss.xml',
    },
  },

  // Add verification tags if you have them
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? {
          'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }
      : {},
  },

  metadataBase: new URL('https://www.momostafa.tech/'),

  // Add category for better classification
  category: 'Professional Portfolio',
}
