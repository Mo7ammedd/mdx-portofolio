import { NextResponse } from 'next/server'
import { getTopTracks } from '@/lib/spotify'

// Use Edge Runtime for faster response times
export const runtime = 'edge'

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300

export async function GET() {
  try {
    const tracks = await getTopTracks(10)
    
    // Return with cache headers
    const response = NextResponse.json(tracks)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Error fetching top tracks:', error)
    
    // Return empty array with 200 status instead of 500
    // This prevents the widget from breaking
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}