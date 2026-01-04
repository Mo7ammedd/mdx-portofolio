import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'

import './globals.css'

import { siteConfig } from '@/components/siteConfig'
import { Header } from './header'
import { Footer } from './footer'
import { PalestineSolidarity } from '@/components/palestine-solidarity'
import { StructuredData } from '@/components/structured-data'
import dynamic from 'next/dynamic'
import { Providers } from './providers'
import { generatePersonSchema, generateWebsiteSchema, generateProfessionalServiceSchema, generateOrganizationSchema } from '@/lib/schema'
import { generateFAQSchema } from '@/lib/faq-schema'

// Lazy load analytics and monitoring - not needed for initial render
const Analytics = dynamic(() => import('@/components/analytics').then(mod => ({ default: mod.Analytics })))
const PerformanceMonitor = dynamic(() => import('@/components/performance-monitor').then(mod => ({ default: mod.PerformanceMonitor })))

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  ...siteConfig,
  other: {
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'theme-color': '#09090b',
  },
}

// Add revalidation for ISR
export const revalidate = 3600 // Revalidate every hour

// Use system fonts to avoid network requests and improve LCP
const geist = localFont({
  src: [
    {
      path: '../public/fonts/GeistVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
})

const geistMono = localFont({
  src: [
    {
      path: '../public/fonts/GeistMonoVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Structured data for the person (you)
  const personData = {
    name: 'Mohammed Mostafa',
    jobTitle: 'Software Engineer',
    description: 'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Available for new opportunities.',
    url: 'https://www.mohammedd.tech',
    email: 'mohammedmostafanazih@gmail.com',
    image: 'https://www.mohammedd.tech/avatar.jpg',
    sameAs: [
      'https://github.com/Mo7ammedd',
      'https://linkedin.com/in/mohammed-mostafa',
      'https://twitter.com/mohameddtv',
    ],
    knowsAbout: [
      'ASP.NET Core',
      'Node.js',
      'TypeScript',
      'JavaScript',
      'C#',
      'Express.js',
      'Software Engineering',
      'Web Development',
      'Backend Development',
      'Full Stack Development',
      'Azure',
      'SQL Server',
      'Redis',
    ],
    alumniOf: 'Suez Canal University',
    location: 'Egypt',
  }

  const websiteData = {
    url: 'https://www.mohammedd.tech',
    name: 'Mohammed Mostafa - Software Engineer Portfolio',
    description: 'Professional Software Engineer Mohammed specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. View portfolio, projects, and contact information.',
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical external domains - prioritize over DNS prefetch */}
        <link rel="preconnect" href="https://i.scdn.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch as fallback for non-critical domains */}
        <link rel="dns-prefetch" href="https://i.scdn.co" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Mohammed Mostafa - Blog RSS Feed" href="/rss.xml" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <StructuredData data={generatePersonSchema(personData)} />
        <StructuredData data={generateWebsiteSchema(websiteData.url, websiteData.name, websiteData.description)} />
        <StructuredData data={generateProfessionalServiceSchema(personData)} />
        <StructuredData data={generateOrganizationSchema()} />
        <StructuredData data={generateFAQSchema()} />
        <Analytics />
        <PerformanceMonitor />
        <Providers>
          <PalestineSolidarity />
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20 pb-16">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
