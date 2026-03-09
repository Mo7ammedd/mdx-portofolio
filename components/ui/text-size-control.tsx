'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react'
import { useScroll, useTransform } from 'motion/react'

// ─── Context ────────────────────────────────────────────────────────────────

interface TextSizeContextType {
  size: number
  setSize: (size: number) => void
  reset: () => void
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined)

export function TextSizeProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState(100)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedSize = localStorage.getItem('blog-text-size')
    if (savedSize) {
      const parsedSize = parseInt(savedSize, 10)
      setSize(parsedSize)
      document.documentElement.style.setProperty('--blog-text-size', parsedSize.toString())
    } else {
      document.documentElement.style.setProperty('--blog-text-size', '100')
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('blog-text-size', size.toString())
      document.documentElement.style.setProperty('--blog-text-size', size.toString())
    }
  }, [size, mounted])

  return (
    <TextSizeContext.Provider value={{ size, setSize, reset: () => setSize(100) }}>
      {children}
    </TextSizeContext.Provider>
  )
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context) throw new Error('useTextSize must be used within TextSizeProvider')
  return context
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTimeRemaining(minutes: number): string {
  if (minutes < 0.5) return 'Done reading'
  if (minutes < 1) return 'Less than a minute left'
  const m = Math.ceil(minutes)
  return `${m} min left`
}

// ─── Mobile strip ────────────────────────────────────────────────────────────

function MobileReadingControls({
  readingTimeMinutes,
  currentProgress,
  timeRemaining,
  size,
  setSize,
}: {
  readingTimeMinutes?: number
  currentProgress: number
  timeRemaining: string | null
  size: number
  setSize: (size: number) => void
}) {
  const showProgress = readingTimeMinutes && currentProgress >= 5 && currentProgress <= 98

  return (
    <div
      className="mb-8 overflow-hidden rounded-xl md:hidden"
      style={{
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Progress bar */}
      {showProgress && (
        <div className="h-1 w-full bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* Time remaining */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {showProgress ? (
            <>
              <span className="font-medium text-emerald-400">{currentProgress}%</span>
              <span className="text-zinc-600">·</span>
              <span>{timeRemaining}</span>
            </>
          ) : (
            <span>{readingTimeMinutes ? `${readingTimeMinutes} min read` : 'Reading controls'}</span>
          )}
        </div>

        {/* Text size buttons */}
        <div className="flex items-center gap-1">
          <span className="mr-1 text-[10px] uppercase tracking-wider text-zinc-600">Size</span>
          {[80, 100, 125].map((preset) => (
            <button
              key={preset}
              onClick={() => setSize(preset)}
              title={`${preset}%`}
              className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                size === preset
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
              style={{ fontSize: preset === 80 ? '10px' : preset === 100 ? '12px' : '14px' }}
            >
              A
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Desktop floating pill ────────────────────────────────────────────────────

function DesktopReadingPanel({
  readingTimeMinutes,
  currentProgress,
  timeRemaining,
  size,
  setSize,
}: {
  readingTimeMinutes?: number
  currentProgress: number
  timeRemaining: string | null
  size: number
  setSize: (size: number) => void
}) {
  const showProgress = readingTimeMinutes && currentProgress >= 5 && currentProgress <= 98

  return (
    <div className="fixed bottom-8 right-6 z-50 hidden md:flex flex-col items-end gap-2">
      {/* Reading progress pill — only when scrolling */}
      {showProgress && (
        <div
          className="flex items-center gap-3 rounded-full px-4 py-2 text-xs"
          style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Circular progress ring */}
          <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle
              cx="10" cy="10" r="8" fill="none"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 8}`}
              strokeDashoffset={`${2 * Math.PI * 8 * (1 - currentProgress / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <span className="font-medium text-zinc-200">{timeRemaining}</span>
        </div>
      )}

      {/* Text size control */}
      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-2"
        style={{
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span className="mr-0.5 text-[10px] uppercase tracking-wider text-zinc-600">Aa</span>
        {[80, 100, 125].map((preset) => (
          <button
            key={preset}
            onClick={() => setSize(preset)}
            title={`Text size ${preset}%`}
            className={`flex h-6 w-6 items-center justify-center rounded-full font-bold transition-all ${
              size === preset
                ? 'bg-white text-zinc-900'
                : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
            style={{ fontSize: preset === 80 ? '9px' : preset === 100 ? '11px' : '13px' }}
          >
            A
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function TextSizeControl({ readingTimeMinutes }: { readingTimeMinutes?: number }) {
  const { size, setSize } = useTextSize()
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100])
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
    if (!readingTimeMinutes) return
    const unsubscribe = percentage.on('change', (latest) => {
      setCurrentProgress(Math.round(latest))
    })
    return () => unsubscribe()
  }, [percentage, readingTimeMinutes])

  const timeRemaining = useMemo(() => {
    if (!readingTimeMinutes) return null
    const remaining = readingTimeMinutes * (1 - currentProgress / 100)
    return formatTimeRemaining(remaining)
  }, [currentProgress, readingTimeMinutes])

  const showProgress = mounted && readingTimeMinutes && currentProgress >= 5 && currentProgress <= 98

  return (
    <>
      <MobileReadingControls
        readingTimeMinutes={readingTimeMinutes}
        currentProgress={currentProgress}
        timeRemaining={timeRemaining}
        size={size}
        setSize={setSize}
      />
      <DesktopReadingPanel
        readingTimeMinutes={readingTimeMinutes}
        currentProgress={currentProgress}
        timeRemaining={timeRemaining}
        size={size}
        setSize={setSize}
      />
    </>
  )
}
