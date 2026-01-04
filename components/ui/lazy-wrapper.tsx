'use client'

import { useState, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number
}

export function LazyWrapper({
  children,
  fallback = <div className="h-32 animate-pulse bg-zinc-200 dark:bg-zinc-800" />,
  rootMargin = '50px',
  threshold = 0.1,
}: LazyWrapperProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return <div ref={ref}>{isIntersecting ? children : fallback}</div>
}
