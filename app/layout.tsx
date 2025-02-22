import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { ThemeProvider } from 'next-themes'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

// export const metadata: Metadata = {
//   title: siteConfig.title,
//   description: siteConfig.description,
//   keywords: siteConfig.keywords,
//   authors: [{ name: siteConfig.name }],
//   creator: siteConfig.name,
//   publisher: siteConfig.name,
//   openGraph: {
//     type: 'website',
//     locale: 'en_US',
//     url: siteConfig.website,
//     siteName: siteConfig.siteName,
//     title: siteConfig.ogTitle,
//     description: siteConfig.description,
//     images: [
//       {
//         url: siteConfig.ogImage,
//         width: 1200,
//         height: 630,
//         alt: siteConfig.ogTitle,
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: siteConfig.username,
//     creator: siteConfig.username,
//     title: siteConfig.title,
//     description: siteConfig.description,
//     images: [siteConfig.ogImage],
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
//   alternates: {
//     canonical: siteConfig.website,
//   },
//   metadataBase: new URL(siteConfig.website),
// }
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
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
            <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
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
