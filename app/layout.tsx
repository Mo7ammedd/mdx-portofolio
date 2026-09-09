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
import { generatePersonSchema, generateWebsiteSchema } from '@/lib/schema'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080808',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  ...siteConfig,
  other: {
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
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
    description:
      'Experienced Software Engineer specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Available for new opportunities.',
    url: 'https://www.modev.me',
    email: 'mohammedmostafanazih@gmail.com',
    image: 'https://www.modev.me/avatar.jpg',
    sameAs: [
      'https://github.com/Mo7ammedd',
      'https://linkedin.com/in/mohammed-mostafa',
      'https://twitter.com/mohameddtv',
      'https://www.modev.me',
      'https://www.modev.me/blog',
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
    url: 'https://www.modev.me',
    name: 'Mohammed Mostafa - Software Engineer Portfolio',
    description:
      'Professional Software Engineer Mohammed specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. View portfolio, projects, and contact information.',
  }

  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <head>
        {/* Security headers via meta tags */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* PWA manifest */}
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-background text-foreground font-sans antialiased`}
      >
        <StructuredData data={generatePersonSchema(personData)} />
        <StructuredData
          data={generateWebsiteSchema(
            websiteData.url,
            websiteData.name,
            websiteData.description,
          )}
        />
        <Analytics />
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          storageKey="theme"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <PalestineSolidarity />
          <div className="relative z-10 flex min-h-screen w-full flex-col">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-6 pt-12 pb-24 sm:pt-20">
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
