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
    return NextResponse.json(
      { error: 'Failed to fetch top tracks' },
      { status: 500 }
    )
  }
}