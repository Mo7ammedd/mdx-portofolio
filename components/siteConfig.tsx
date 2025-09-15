import { Metadata } from 'next'

export const siteConfig: Metadata = {
  // More specific and searchable title variations
  title: {
    default: 'Mohammed Mostafa | Software Engineer | ASP.NET Core & Node.js Developer',
    template: '%s | Mohammed Mostafa - Software Engineer',
  },
  description:
    'Mohammed Mostafa - Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Computer Science graduate from Suez Canal University. View my portfolio, projects, and contact me for opportunities.',
  keywords: [
    // Personal brand keywords
    'Mohammed Mostafa',
    'Mohammed Software Engineer',
    'Mohammed Developer Egypt',
    'Mohammed Mostafa Portfolio',
    'Software Engineer Egypt',
    
    // Technical expertise
    'ASP.NET Core Developer',
    'Node.js Engineer',
    'TypeScript Developer',
    'Express.js Specialist',
    'C# Developer',
    'Full Stack Developer',
    'Backend Engineer',
    'Web Developer',
    
    // Location-based
    'Software Engineer Egypt',
    'Developer Middle East',
    'Remote Software Engineer',
    
    // Opportunity keywords
    'Software Engineer for hire',
    'Available for opportunities',
    'Freelance developer',
    'Contract software engineer',
    'Remote developer available',
    
    // Technologies
    'Microservices',
    'Azure Cloud',
    'SQL Server',
    'Redis',
    'JWT Authentication',
    'RESTful APIs',
    'Database Design',
    'System Architecture',
    
    // Education
    'Suez Canal University',
    'Computer Science Graduate',
    'Fresh Graduate Developer',
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
    title: 'Mohammed Mostafa | Software Engineer | ASP.NET Core & Node.js',
    description:
      'Mohammed Mostafa - Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Computer Science graduate from Suez Canal University. Available for new opportunities.',
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
        alt: 'Mohammed Mostafa Professional Photo - Software Engineer',
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
    title: 'Mohammed Mostafa | Software Engineer | ASP.NET Core & Node.js Developer',
    description:
      'Mohammed Mostafa - Software Engineer specializing in ASP.NET Core, Node.js, Express.js and TypeScript. Computer Science graduate available for opportunities.',
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