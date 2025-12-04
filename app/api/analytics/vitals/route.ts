import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface WebVitalMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}


export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()

    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Web Vitals]', {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
      })
    }

   

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[Web Vitals Error]', error)
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    )
  }
}


export async function GET() {
  return NextResponse.json({
    message: 'Web Vitals endpoint active',
    metrics: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  })
}
