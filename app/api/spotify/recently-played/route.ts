import { NextResponse } from 'next/server'
import { getRecentlyPlayed } from '@/lib/spotify'

export const runtime = 'edge'

export const revalidate = 300

export async function GET() {
  try {
    const tracks = await getRecentlyPlayed(10)
    
    const response = NextResponse.json(tracks)
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    
    return response
  } catch (error) {
    console.error('Error fetching recently played tracks:', error)
    
    return NextResponse.json([], {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  }
}