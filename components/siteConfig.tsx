import { Metadata } from 'next'

export const siteConfig: Metadata = {
  metadataBase: new URL('https://www.mohammedd.tech'),
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
    'Azure Cloud Engineer',
    'SQL Server Developer',
    'Redis Specialist',
  ],
  authors: [{ name: 'Mohammed Mostafa', url: 'https://www.mohammedd.tech' }],
  creator: 'Mohammed Mostafa - Software Engineer',
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
    startupImage: [
      {
        url: '/avatar.jpg',
        media: '(device-width: 375px) and (device-height: 812px)',
      },
    ],
  },
  
  // Add structured data hints and meta properties
  other: {
    'og:profile:first_name': 'Mohammed',
    'og:profile:last_name': 'Mostafa',
    'og:profile:username': 'mohammed-software-engineer',
    'og:profile:gender': 'male',
    'profession': 'Software Engineer',
    'specialization': 'ASP.NET Core, Node.js, TypeScript',
    'status': 'Available for Opportunities',
    'article:author': 'Mohammed Mostafa',
    'og:email': 'mohammedmostafanazih@gmail.com',
    'og:locality': 'Egypt',
    'og:region': 'Middle East',
    'og:country-name': 'Egypt',
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
  
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
    } : {},
  },
  
  category: 'Professional Portfolio',
  
  classification: 'Software Engineering Portfolio',
  
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/avatar.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/avatar.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
  },
  
  manifest: '/site.webmanifest',
}