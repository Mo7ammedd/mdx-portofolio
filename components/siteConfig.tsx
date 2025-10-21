import { Metadata } from 'next'

export const siteConfig: Metadata = {
  title: {
    default: 'Mohammed Mostafa | Mohammed Software Engineer | ASP.NET Core & Node.js Developer',
    template: '%s | Mohammed Mostafa - Software Engineer',
  },
  description:
    'Mohammed Mostafa (Mohammed) - Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Backend engineer and full-stack developer from Egypt. Computer Science graduate from Suez Canal University. View Mohammed Mostafa portfolio, projects, and contact for opportunities.',
  keywords: [
    'Mohammed Mostafa',
    'Mohammed Mostafa Software Engineer',
    'Mohammed Software Engineer',
    'Mohammed Mostafa Portfolio',
    'Mohammed Mostafa Developer',
    'Mohammed Engineer',
    'Mohammed Developer',
    'Mohammed Backend Engineer',
    'Mohammed Mostafa Backend Engineer',
    'Software Engineer Mohammed Mostafa',
    'Software Engineer Mohammed',
    'Mohammed Full Stack Developer',
    'Mohammed Mostafa Egypt',
    'Software Engineer',
    'Backend Engineer',
    'Full Stack Developer',
    'ASP.NET Core Developer',
    'Node.js Engineer',
    'TypeScript Developer',
    'C# Developer',
    'Software Engineer Egypt',
    'Remote Software Engineer',
    'Freelance Developer',
    'Microservices Architecture',
    'RESTful APIs',
    'Suez Canal University',
    'Computer Science Graduate',
  ],
  authors: [{ name: 'Mohammed Mostafa', url: 'https://www.mohammedd.tech' }],
  creator: 'Mohammed - Software Engineer',
  publisher: 'Mohammed Portfolio Website',
  
  // Add structured data hints and meta properties
  other: {
    'og:profile:first_name': 'Mohammed',
    'og:profile:last_name': 'Mostafa',
    'og:profile:username': 'mohammed-software-engineer',
    'profession': 'Software Engineer',
    'specialization': 'ASP.NET Core, Node.js, TypeScript',
    'status': 'Available for Opportunities',
    'article:author': 'Mohammed Mostafa',
    'og:email': 'mohammedmostafanazih@gmail.com',
    'og:locality': 'Egypt',
    'og:region': 'Middle East',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#09090b',
  },
  
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://www.mohammedd.tech',
    siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
    title: 'Mohammed Mostafa | Mohammed Software Engineer | ASP.NET Core & Node.js Developer',
    description:
      'Mohammed Mostafa (Mohammed) - Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Backend engineer and full-stack developer from Egypt. Computer Science graduate from Suez Canal University. Available for new opportunities.',
    images: [
      {
        url: 'https://www.mohammedd.tech/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mohammed Mostafa Software Engineer Portfolio - ASP.NET Core & Node.js Developer',
        type: 'image/png',
      },
      {
        url: 'https://www.mohammedd.tech/avatar.jpg',
        width: 400,
        height: 400,
        alt: 'Mohammed Mostafa (Mohammed) - Software Engineer Professional Photo',
        type: 'image/jpeg',
      },
    ],
    emails: ['mohammedmostafanazih@gmail.com'],
    countryName: 'Egypt',
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@mohameddtv',
    creator: '@mohameddtv',
    title: 'Mohammed Mostafa | Mohammed Software Engineer | ASP.NET Core & Node.js Developer',
    description:
      'Mohammed Mostafa (Mohammed) - Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js and TypeScript. Backend engineer and full-stack developer available for opportunities.',
    images: ['https://www.mohammedd.tech/og-image.png'],
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
    canonical: 'https://www.mohammedd.tech',
    languages: {
      'en-US': 'https://www.mohammedd.tech',
    },
  },
  
  // Add verification tags if you have them
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    } : {},
  },
  
  metadataBase: new URL('https://www.mohammedd.tech/'),
  
  // Add category for better classification
  category: 'Professional Portfolio',
}