'use client'

import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react'
import { Type, BookOpen, Clock } from 'lucide-react'
import { useScroll, useTransform } from 'motion/react'

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
    // Load saved size from localStorage
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

  const reset = () => {
    setSize(100)
  }

  return (
    <TextSizeContext.Provider value={{ size, setSize, reset }}>
      {children}
    </TextSizeContext.Provider>
  )
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context) {
    throw new Error('useTextSize must be used within TextSizeProvider')
  }
  return context
}

// Mobile horizontal version
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
    <div className="mb-8 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 md:hidden">
      {/* Reading Progress - only show when scrolling */}
      {showProgress && (
        <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {currentProgress}%
            </span>
          </div>
          
          {timeRemaining && (
            <>
              <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {timeRemaining}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Text Size Controls - always visible */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Text size</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[80, 90, 100, 110, 125].map((preset) => (
            <button
              key={preset}
              onClick={() => setSize(preset)}
              className={`h-7 w-7 rounded-md text-xs font-bold transition-all
                        ${size === preset 
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                        }`}
              title={`${preset}%`}
            >
              A
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TextSizeControl({ readingTimeMinutes }: { readingTimeMinutes?: number }) {
  const { size, setSize } = useTextSize()
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll()
  
  // Use useTransform for performant scroll-based calculations
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100])
  const [currentProgress, setCurrentProgress] = useState(0)
  
  useEffect(() => {
    setMounted(true)
    
    if (!readingTimeMinutes) return
    
    // Subscribe to scroll progress updates
    const unsubscribe = percentage.on('change', (latest) => {
      setCurrentProgress(Math.round(latest))
    })
    
    return () => unsubscribe()
  }, [percentage, readingTimeMinutes])

  // Calculate time remaining based on scroll progress
  const timeRemaining = useMemo(() => {
    if (!readingTimeMinutes) return null
    
    const remaining = readingTimeMinutes * (1 - currentProgress / 100)
    
    if (remaining < 0.5) return 'Done!'
    if (remaining < 1) return '<1 min'
    
    return `${Math.ceil(remaining)} min`
  }, [currentProgress, readingTimeMinutes])

  const showProgress = mounted && readingTimeMinutes && currentProgress >= 5 && currentProgress <= 98

  return (
    <>
      {/* Mobile horizontal version */}
      <MobileReadingControls 
        readingTimeMinutes={readingTimeMinutes}
        currentProgress={currentProgress}
        timeRemaining={timeRemaining}
        size={size}
        setSize={setSize}
      />

      {/* Desktop fixed sidebar version */}
      <div 
        className="fixed right-6 top-1/3 z-50 hidden md:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col gap-1.5 p-2 
                        bg-zinc-900/80 backdrop-blur-md
                        border border-zinc-800 rounded-xl
                        transition-all duration-300"
             style={{ 
               width: isHovered ? '48px' : '40px',
               opacity: isHovered ? 1 : 0.6 
             }}>
          
          {/* Reading Progress Section */}
          {showProgress && (
            <>
              <div className="flex flex-col items-center gap-1 pb-1">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">
                  {currentProgress}%
                </span>
                {timeRemaining && (
                  <div className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-[9px] text-zinc-500">
                      {timeRemaining}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="h-px bg-zinc-800 mx-1" />
            </>
          )}
          
          {/* Text Size Section */}
          <Type className="w-4 h-4 text-zinc-400 mx-auto" />
          
          <div className="h-px bg-zinc-800 mx-1" />
          
          {[125, 110, 100, 90, 80].map((preset, index) => (
            <button
              key={preset}
              onClick={() => setSize(preset)}
              className={`w-full aspect-square rounded-lg text-xs font-bold
                        transition-all duration-200
                        ${size === preset 
                          ? 'bg-white text-zinc-900 scale-110' 
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
                        }`}
              style={{
                fontSize: `${0.9 - (index * 0.08)}rem`
              }}
              title={`${preset}%`}
            >
              A
            </button>
          ))}
        </div>
      </div>
    </>
  )
}