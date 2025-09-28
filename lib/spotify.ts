import { cache } from './cache'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks'
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played'

export interface SpotifyTrack {
  id: string
  name: string
  artist: string
  album: string
  image: string
  url: string
  preview_url?: string
  played_at?: string
}

interface SpotifyApi {
  access_token: string
}

const getAccessToken = async (): Promise<string> => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    throw new Error('Spotify credentials not configured. Please set up your environment variables.')
  }

  // Check cache first
  const cachedToken = cache.get<string>('spotify_access_token')
  if (cachedToken) {
    return cachedToken
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASIC}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN!,
    }),
    next: { revalidate: 3600 } // Cache access token for 1 hour
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Failed to get access token: ${response.status} ${errorData}`)
  }

  const data: SpotifyApi = await response.json()
  
  // Cache the token for 50 minutes (tokens expire in 1 hour)
  cache.set('spotify_access_token', data.access_token, 3000)
  
  return data.access_token
}

export const getTopTracks = async (limit = 10): Promise<SpotifyTrack[]> => {
  const cacheKey = `top_tracks_${limit}`
  
  // Check cache first
  const cachedTracks = cache.get<SpotifyTrack[]>(cacheKey)
  if (cachedTracks) {
    return cachedTracks
  }

  const access_token = await getAccessToken()
  
  const response = await fetch(`${TOP_TRACKS_ENDPOINT}?limit=${limit}&time_range=short_term`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 300 } // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error('Failed to fetch top tracks')
  }

  const data = await response.json()
  
  const tracks = data.items.map((item: any): SpotifyTrack => ({
    id: item.id,
    name: item.name,
    artist: item.artists.map((artist: any) => artist.name).join(', '),
    album: item.album.name,
    image: item.album.images[0]?.url || '',
    url: item.external_urls.spotify,
    preview_url: item.preview_url,
  }))

  // Cache for 5 minutes
  cache.set(cacheKey, tracks, 300)
  
  return tracks
}

export const getRecentlyPlayed = async (limit = 10): Promise<SpotifyTrack[]> => {
  const cacheKey = `recently_played_${limit}`
  
  // Check cache first
  const cachedTracks = cache.get<SpotifyTrack[]>(cacheKey)
  if (cachedTracks) {
    return cachedTracks
  }

  const access_token = await getAccessToken()
  
  const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 300 } // Cache for 5 minutes
  })

  if (!response.ok) {
    throw new Error('Failed to fetch recently played tracks')
  }

  const data = await response.json()
  
  const tracks = data.items.map((item: any): SpotifyTrack => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists.map((artist: any) => artist.name).join(', '),
    album: item.track.album.name,
    image: item.track.album.images[0]?.url || '',
    url: item.track.external_urls.spotify,
    preview_url: item.track.preview_url,
    played_at: item.played_at,
  }))

  // Cache for 5 minutes
  cache.set(cacheKey, tracks, 300)
  
  return tracks
}