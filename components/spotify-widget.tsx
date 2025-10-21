'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { SpotifyTrack } from '@/lib/spotify'
import { Magnetic } from './ui/magnetic'

interface SpotifyWidgetProps {
  className?: string
}

export function SpotifyWidget({ className = '' }: SpotifyWidgetProps) {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'top' | 'recent'>('recent')
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

  const fetchTracks = useCallback(async (type: 'top' | 'recent') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/spotify/${type === 'top' ? 'top-tracks' : 'recently-played'}`, {
        next: { revalidate: 300 }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch tracks')
      }
      
      const data = await response.json()
      setTracks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTracks(activeTab)
  }, [activeTab, fetchTracks])

  const playPreview = useCallback((trackId: string, previewUrl?: string) => {
    if (!previewUrl) return
    
    if (currentlyPlaying) {
      const currentAudio = document.getElementById(currentlyPlaying) as HTMLAudioElement
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }

    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null)
    } else {
      const audio = document.getElementById(trackId) as HTMLAudioElement
      if (audio) {
        audio.play()
        setCurrentlyPlaying(trackId)
        audio.onended = () => setCurrentlyPlaying(null)
      }
    }
  }, [currentlyPlaying])

  const formatTime = useCallback((dateString: string) => {
    const now = new Date()
    const played = new Date(dateString)
    const diff = now.getTime() - played.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}m ago`
    } else if (hours < 24) {
      return `${hours}h ago`
    } else {
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    }
  }, [])

  const displayedTracks = useMemo(() => tracks.slice(0, 5), [tracks])

  return (
    <div className={`relative ${className}`}>
      <div className="relative bg-gradient-to-br from-black/20 via-black/80 to-black/20 backdrop-blur-sm border border-black/30 dark:border-black/30 rounded-xl p-6 shadow-2xl shadow-black/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-900 rounded-full flex items-center justify-center shadow-lg shadow-black/50">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.8c-.2 0-.32-.13-.41-.31-.43-.69-1.08-1.19-1.88-1.44-1.13-.35-2.31-.35-3.44 0-.8.25-1.45.75-1.88 1.44-.09.18-.21.31-.41.31-.33 0-.59-.27-.59-.59 0-.18.08-.34.21-.45.59-.87 1.42-1.48 2.37-1.78 1.37-.43 2.82-.43 4.19 0 .95.3 1.78.91 2.37 1.78.13.11.21.27.21.45 0 .32-.26.59-.59.59zm-1.12-4.81c-.38 0-.69-.31-.69-.69 0-.21.09-.39.24-.52.76-.65 1.69-1.01 2.67-1.01s1.91.36 2.67 1.01c.15.13.24.31.24.52 0 .38-.31.69-.69.69-.19 0-.36-.08-.48-.2-.57-.49-1.29-.77-2.05-.77s-1.48.28-2.05.77c-.12.12-.29.2-.48.2zm-3.04 0c-.19 0-.36-.08-.48-.2-.57-.49-1.29-.77-2.05-.77s-1.48.28-2.05.77c-.12.12-.29.2-.48.2-.38 0-.69-.31-.69-.69 0-.21.09-.39.24-.52.76-.65 1.69-1.01 2.67-1.01s1.91.36 2.67 1.01c.15.13.24.31.24.52 0 .38-.31.69-.69.69z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white dark:text-white drop-shadow-lg">
                  SPOTIFY
                </h3>
               <div className="flex flex-col space-y-1">
  <p className="text-sm text-gray-300 dark:text-gray-400 font-mono tracking-wider">
    {activeTab === 'recent' ? 'RECENT VIBES' : 'TOP BANGERS'}
  </p>
  <p className="text-xs text-gray-400 font-mono tracking-widest">
    Fueled by coffee, code, and Taylor Swift on repeat.
  </p>
</div>

              </div>
            </div>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-black/50 dark:bg-gray-800/50 p-1 border border-black/30">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'recent'
                  ? 'bg-black text-white shadow-lg shadow-black/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'top'
                  ? 'bg-black text-white shadow-lg shadow-black/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              Top
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
                <p className="text-gray-300 dark:text-gray-400 text-sm mb-2">
                  Spotify integration not configured yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Set up your Spotify API credentials to see music data
                </p>
              </div>
              <button
                onClick={() => fetchTracks(activeTab)}
                className="text-gray-400 dark:text-gray-300 hover:text-gray-200 dark:hover:text-gray-100 text-sm font-medium transition-colors"
              >
                Try again
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!loading && !error && displayedTracks.length > 0 && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {displayedTracks.map((track, index) => {
                  const trackId = `${activeTab}-${track.id}-${index}`
                  return (
                    <motion.div
                      key={trackId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Magnetic springOptions={{ bounce: 0 }} intensity={0.1}>
                        <div className="group flex items-center gap-3 p-3 rounded-lg bg-black/30 dark:bg-gray-900/20 border border-black/20 dark:border-gray-400/20 hover:bg-black/50 dark:hover:bg-gray-800/50 transition-all duration-300 hover:border-black/50 shadow-md hover:shadow-black/20">
                          <div className="relative">
                            <img
                              src={track.image}
                              alt={track.name}
                              width={48}
                              height={48}
                              className="rounded-md border border-black/30"
                              loading="lazy"
                            />
                            {track.preview_url && (
                              <>
                                <button
                                  onClick={() => playPreview(trackId, track.preview_url)}
                                  className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"
                                  aria-label={currentlyPlaying === trackId ? 'Pause preview' : 'Play preview'}
                                >
                                  {currentlyPlaying === trackId ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z"/>
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M8 5v10l8-5-8-5z"/>
                                    </svg>
                                  )}
                                </button>
                                <audio
                                  id={trackId}
                                  src={track.preview_url}
                                  preload="none"
                                />
                              </>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block hover:text-gray-200 dark:hover:text-gray-100 transition-colors"
                            >
                              <p className="font-medium text-white dark:text-gray-100 truncate drop-shadow-sm">
                                {track.name}
                              </p>
                              <p className="text-sm text-gray-300 dark:text-gray-400 truncate">
                                {track.artist}
                              </p>
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {activeTab === 'recent' && track.played_at && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                {formatTime(track.played_at)}
                              </span>
                            )}
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Open in Spotify"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z"/>
                              </svg>
                            </a>
                          </div>
                        </div>
                      </Magnetic>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
