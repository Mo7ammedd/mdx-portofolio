'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

/**
 * Performance monitoring component that tracks Core Web Vitals
 * 
 * Metrics tracked:
 * - FCP (First Contentful Paint): Time when first content is rendered
 * - LCP (Largest Contentful Paint): Time when largest content is rendered
 * - CLS (Cumulative Layout Shift): Visual stability measure
 * - FID (First Input Delay): Time from first interaction to browser response
 * - TTFB (Time to First Byte): Time from request to first byte received
 * - INP (Interaction to Next Paint): Responsiveness metric
 */
export function PerformanceMonitor() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      })
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // Send to your analytics service
      // Examples:
      // - Google Analytics
      // - Vercel Analytics (built-in)
      // - Custom endpoint
      
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      })

      // Example: Send to custom endpoint
      // fetch('/api/analytics/vitals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body,
      //   keepalive: true, // Important: ensures request completes even if page unloads
      // }).catch(console.error)

      // Example: Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_id: metric.id,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_rating: metric.rating,
        })
      }
    }
  })

  // Performance observer for additional metrics
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Track long tasks (tasks that block the main thread for >50ms)
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Performance] Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
            })
          }
        }
      }
    })

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // longtask not supported in this browser
    }

    // Track resource loading performance
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming
        
        // Flag slow resources (>1s)
        if (resource.duration > 1000) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Performance] Slow resource:', {
              name: resource.name,
              duration: resource.duration,
              type: resource.initiatorType,
            })
          }
        }
      }
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      // resource timing not supported
    }

    return () => {
      longTaskObserver.disconnect()
      resourceObserver.disconnect()
    }
  }, [])

  return null
}

/**
 * Get performance metrics on demand
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')

  return {
    // Navigation timing
    dns: navigation?.domainLookupEnd - navigation?.domainLookupStart,
    tcp: navigation?.connectEnd - navigation?.connectStart,
    ttfb: navigation?.responseStart - navigation?.requestStart,
    download: navigation?.responseEnd - navigation?.responseStart,
    domInteractive: navigation?.domInteractive - navigation?.fetchStart,
    domComplete: navigation?.domComplete - navigation?.fetchStart,
    loadComplete: navigation?.loadEventEnd - navigation?.fetchStart,

    // Paint timing
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,

    // Memory (if available)
    memory: (performance as any).memory
      ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        }
      : null,
  }
}
