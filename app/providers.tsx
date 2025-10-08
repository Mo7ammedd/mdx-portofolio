'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

/**
 * Separate providers into their own client component
 * This helps with code splitting and reduces main thread blocking
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      enableSystem={true}
      attribute="class"
      storageKey="theme"
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  )
}
