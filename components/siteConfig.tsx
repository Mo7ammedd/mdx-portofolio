import { Metadata } from 'next'

export const siteConfig: Metadata = {
  // More specific and searchable title variations
  title: {
    default: 'Mohammed Mostafa | Backend Software Engineer (.NET, Node.js, SQL Server)',
    template: '%s | Mohammed Mostafa',
  },
  description:
    'Mohammed Mostafa, backend software engineer in Egypt. 5+ years building microservices, REST APIs, and distributed systems with ASP.NET Core, Node.js, and TypeScript. Projects and technical articles.',
  keywords: [
    // Personal brand keywords
    'Mohammed Mostafa',
    'Mohammed Mostafa Software Engineer',
    'Mohammed Developer Egypt',
    'Mohammed Mostafa Portfolio',
    'modev.me',
    
    // Technical expertise - Long tail
    'ASP.NET Core Developer',
    'ASP.NET Core Web API Developer',
    'Node.js Backend Engineer',
    'TypeScript Full Stack Developer',
    'Express.js REST API Developer',
    'C# development',
    'Backend Software Engineer',
    'Microservices architecture',
    
    // Location-based SEO
    'Software Engineer Egypt',
    'Backend Developer Cairo',
    'Remote Software Engineer Middle East',
    'Egyptian Software Engineer',
    
    // Professional status
    'Available for opportunities',
    'Remote developer',
    
    // Technologies & Skills
    'Azure Cloud Developer',
    'SQL Server',
    'Redis caching',
    'JWT Authentication Implementation',
    'RESTful API Design',
    'Database design',
    'System Architecture Design',
    'Docker Containerization',
    'RabbitMQ Message Queue',
    'Entity Framework Core',
    'Clean Architecture',
    'CQRS Pattern',
    'Domain Driven Design',
    
    // Content keywords
    'Software Engineering Blog',
    'ASP.NET Core Tutorials',
    'Node.js Best Practices',
    'Backend Development Guide',
    
    // Education & Experience
    'Suez Canal University Computer Science',
    '5 years software development experience',
    'Backend development',
  ],
  authors: [{ name: 'Mohammed Mostafa', url: 'https://www.modev.me' }],
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
    url: 'https://www.modev.me',
    siteName: 'Mohammed Mostafa - Software Engineer Portfolio',
    title: 'Mohammed Mostafa | Backend Software Engineer (.NET, Node.js)',
    description:
      'Backend software engineer in Egypt with 5+ years building microservices and distributed systems using ASP.NET Core, Node.js, and TypeScript.',
    emails: ['mohammedmostafanazih@gmail.com'],
    countryName: 'Egypt',
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@mohameddtv',
    creator: '@mohameddtv',
    title: 'Mohammed Mostafa | Backend Software Engineer',
    description:
      'Backend software engineer with 5+ years building microservices and distributed systems using ASP.NET Core, Node.js, and TypeScript.',
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
    canonical: 'https://www.modev.me',
    languages: {
      'en-US': 'https://www.modev.me',
    },
    types: {
      'application/rss+xml': 'https://www.modev.me/blog/rss.xml',
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
  
  metadataBase: new URL('https://www.modev.me/'),
  
  // Add category for better classification
  category: 'Professional Portfolio',
}
