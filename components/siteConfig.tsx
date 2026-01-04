import type { Metadata } from 'next'

export const siteConfig: Metadata = {
  metadataBase: new URL('https://www.mohammedd.tech'),

  title: {
    default: 'Mohammed Mostafa | Mohammed Software Engineer | ASP.NET Core & Node.js Developer',
    template: '%s | Mohammed Mostafa - Software Engineer',
  },

  description:
    'Mohammed Mostafa — Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Backend engineer and full-stack developer from Egypt. Computer Science graduate from Suez Canal University.',

  keywords: [
    'Mohammed Mostafa',
    'Mohammed Software Engineer',
    'ASP.NET Core Developer',
    'Node.js Engineer',
    'Backend Engineer',
    'Full Stack Developer',
    'TypeScript Developer',
    'C# Developer',
    'Microservices',
    'REST APIs',
    'SQL Server',
    'Redis',
    'Egypt',
  ],

  authors: [{ name: 'Mohammed Mostafa', url: 'https://www.mohammedd.tech' }],
  creator: 'Mohammed Mostafa',
  publisher: 'Mohammed Mostafa',
  applicationName: 'Mohammed Mostafa Portfolio',

  referrer: 'origin-when-cross-origin',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mohammed Mostafa',
  },

  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://www.mohammedd.tech',
    siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
    title: 'Mohammed Mostafa | ASP.NET Core & Node.js Developer',
    description:
      'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Available for new opportunities.',
    images: [
      {
        url: 'https://www.mohammedd.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mohammed Mostafa Software Engineer Portfolio',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mohameddtv',
    creator: '@mohameddtv',
    title: 'Mohammed Mostafa | ASP.NET Core & Node.js Developer',
    description:
      'Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript.',
    images: ['https://www.mohammedd.tech/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  alternates: {
    canonical: 'https://www.mohammedd.tech',
    languages: {
      'en-US': 'https://www.mohammedd.tech',
    },
  },

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },

  manifest: '/site.webmanifest',

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/avatar.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    apple: [{ url: '/avatar.jpg', sizes: '180x180', type: 'image/jpeg' }],
  },

  other: {
    'og:profile:first_name': 'Mohammed',
    'og:profile:last_name': 'Mostafa',
    'og:profile:username': 'mohammed-software-engineer',
    profession: 'Software Engineer',
    specialization: 'ASP.NET Core, Node.js, TypeScript',
    status: 'Available for Opportunities',
    'article:author': 'Mohammed Mostafa',
    'og:email': 'mohammedmostafanazih@gmail.com',
    'og:country-name': 'Egypt',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#09090b',
    classification: 'Software Engineering Portfolio',
  },
}
