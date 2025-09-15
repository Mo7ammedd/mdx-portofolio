import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import './globals.css'

import { siteConfig } from '@/components/siteConfig'
import { Header } from './header'
import { Footer } from './footer'
import { PalestineSolidarity } from '@/components/palestine-solidarity'
import { StructuredData } from '@/components/structured-data'
import { Analytics } from '@/components/analytics'
import { generatePersonSchema, generateWebsiteSchema, generateProfessionalServiceSchema, generateOrganizationSchema } from '@/lib/schema'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' }, // zinc-950 color
  ],
  colorScheme: 'dark light',
}

export const metadata: Metadata = {
  ...siteConfig,
  other: {
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'theme-color': '#09090b',
  },
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <StructuredData data={generatePersonSchema(personData)} />
        <StructuredData data={generateWebsiteSchema(websiteData.url, websiteData.name, websiteData.description)} />
        <StructuredData data={generateProfessionalServiceSchema(personData)} />
        <StructuredData data={generateOrganizationSchema()} />
        <Analytics />
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <PalestineSolidarity />
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20 pb-16">
              <Header />
              {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
