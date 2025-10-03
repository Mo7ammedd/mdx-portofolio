import { NextResponse } from 'next/server'
import { getTopTracks } from '@/lib/spotify'

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300

export async function GET() {
  try {
    const tracks = await getTopTracks(10)
    return NextResponse.json(tracks)
  } catch (error) {
    console.error('Error fetching top tracks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch top tracks' },
      { status: 500 }
    )
  }
}