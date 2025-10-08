'use client'

import dynamic from 'next/dynamic'

// Lazy load Spotify widget - not critical for initial render
const SpotifyWidget = dynamic(() => import('@/components/spotify-widget').then(mod => ({ default: mod.SpotifyWidget })), {
  loading: () => <div className="h-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />,
  ssr: false,
})

export function SpotifySection() {
  return <SpotifyWidget />
}
