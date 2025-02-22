import { Metadata } from 'next'

export const siteConfig: Metadata = {
  title: 'Hüsam | Software Engineer',
  description:
    'Software Engineer specializing in full-stack development with React, Next.js, Node.js, Express.js and TypeScript. Open to new opportunities.',
  keywords: [
    'Software Engineer',
    'Backend Software Engineer',
    'Backend Engineer',
    'Backend Developer',
    'Full Stack Developer',
    'Asp.Net Core',
    'Azure',
    'Node.js',
    'Express.js',
    'TypeScript',
    'JavaScript',
    'C#',
    'Problem Solving',
    'Web Development',
    'Open Source',
    'Opportunity',
  ],
  authors: [{ name: 'Mohammed' }],
  creator: 'Mohammed',
  publisher: 'Mohammed',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.mohammedd.tech',
    siteName: "Mohammed's Portfolio",
    title: '/og-image.png',
    description:
      'Software Engineer specializing in Asp.Net Core, Node.js, Express.js and TypeScript. Open to new opportunities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '/og-image.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mohamedtv',
    creator: '@mohamedtv',
    title: 'Mohammed | Software Engineer',
    description:
      'Software Engineer specializing in Asp.Net Core, Node.js, Express.js and TypeScript. Open to new opportunities.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.mohammedd.tech',
  },
  metadataBase: new URL('https://www.mohammedd.tech/'),
}
