import { Metadata } from 'next'

export const siteConfig: Metadata = {
  title: 'Hüsam | Software Engineer',
  description:
    'Software Engineer specializing in full-stack development with React, Next.js, Node.js, Express.js and TypeScript. Open to new opportunities.',
  keywords: [
    'Software Engineer',
    'Frontend Software Engineer',
    'Frontend Engineer',
    'Frontend Developer',
    'Full Stack Developer',
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'TypeScript',
    'JavaScript',
    'Problem Solving',
    'Web Development',
    'Open Source',
    'Opportunity',
  ],
  authors: [{ name: 'Hüsam' }],
  creator: 'Hüsam',
  publisher: 'Hüsam',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://husam.ninja',
    siteName: "Hüsam's Portfolio",
    title: '/og-image.png',
    description:
      'Software Engineer specializing in full-stack development with React, Next.js, Node.js, Express.js and TypeScript. Open to new opportunities.',
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
    site: '@husamql3',
    creator: '@husamql3',
    title: 'Hüsam | Software Engineer',
    description:
      'Software Engineer specializing in full-stack development with React, Next.js, Node.js, Express.js and TypeScript. Open to new opportunities.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://husam.ninja',
  },
  metadataBase: new URL('https://husam.ninja'),
}
