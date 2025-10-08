'use client'

import { ReactNode, useEffect, useState } from 'react'

/**
 * Wrapper that respects user's reduced motion preference
 * Completely skips animation library loading if user prefers reduced motion
 */
export function ReducedMotionWrapper({ 
  children, 
  fallback 
}: { 
  children: ReactNode
  fallback: ReactNode 
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    setMounted(true)

    // Listen for changes
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  // During SSR or before mount, show fallback
  if (!mounted) {
    return <>{fallback}</>
  }

  // If user prefers reduced motion, skip animations entirely
  if (prefersReducedMotion) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
