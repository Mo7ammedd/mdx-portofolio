import { NextRequest, NextResponse } from 'next/server'

// Use Edge Runtime for better performance
export const runtime = 'edge'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}

/**
 * API endpoint to collect Web Vitals metrics
 * 
 * This endpoint receives performance metrics from the client
 * and can forward them to analytics services or store them.
 * 
 * Currently logs metrics - extend to send to your analytics platform:
 * - Google Analytics
 * - Mixpanel
 * - Custom database
 * - DataDog / New Relic
 */
export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()

    // Validate metric
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // Log in development/staging
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Web Vitals]', {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      })
    }

    // In production, you can:
    // 1. Send to analytics service
    // 2. Store in database
    // 3. Send to monitoring service
    
    // Example: Send to external analytics
    // await fetch('https://your-analytics-endpoint.com/vitals', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     ...metric,
    //     timestamp: new Date().toISOString(),
    //     userAgent: request.headers.get('user-agent'),
    //   }),
    // })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Web Vitals Error]', error)
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to retrieve aggregated metrics (optional)
 */
export async function GET() {
  // This could return aggregated performance data
  // For now, return a simple message
  return NextResponse.json({
    message: 'Web Vitals endpoint active',
    metrics: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  })
}
