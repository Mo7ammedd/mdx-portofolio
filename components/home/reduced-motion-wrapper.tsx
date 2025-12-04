'use client'

import { ReactNode, useEffect, useState } from 'react'

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
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    setMounted(true)

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  if (!mounted) {
    return <>{fallback}</>
  }

  if (prefersReducedMotion) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
