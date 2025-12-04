'use client'

import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'
import { useEffect, useState, RefObject } from 'react'

export type ReadingProgressProps = {
  className?: string
  containerRef?: RefObject<HTMLDivElement>
  wordsPerMinute?: number
  showTimeEstimate?: boolean
}

const DEFAULT_WPM = 200 

export function ReadingProgress({
  className,
  containerRef,
  wordsPerMinute = DEFAULT_WPM,
  showTimeEstimate = true,
}: ReadingProgressProps) {
  const [totalWords, setTotalWords] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const { scrollYProgress } = useScroll({
    container: containerRef,
    layoutEffect: Boolean(containerRef?.current),
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  })

  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [100, 0])

  const totalReadingTime = Math.ceil(totalWords / wordsPerMinute)
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const remainingTime = Math.ceil(totalReadingTime * (1 - scrollProgress))
  
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setScrollProgress(latest)
      setIsVisible(latest > 0.01 && latest < 0.99)
    })
  }, [scrollYProgress])

  useEffect(() => {
    const countWords = () => {
      const article = document.querySelector('main') || document.querySelector('article')
      if (article) {
        const text = article.innerText || article.textContent || ''
        const words = text.trim().split(/\s+/).length
        setTotalWords(words)
      }
    }

    const timer = setTimeout(countWords, 100)
    return () => clearTimeout(timer)
  }, [])

  const formatTime = (minutes: number) => {
    if (minutes < 1) return '< 1 min'
    if (minutes === 1) return '1 min'
    return `${minutes} min`
  }

  const progressPercentage = Math.round(scrollProgress * 100)

  return (
    <>
      <motion.div
        className={cn('fixed inset-x-0 top-1 z-40 h-0.5 origin-left bg-zinc-900 dark:bg-zinc-100', className)}
        style={{
          scaleX,
        }}
      />

      {showTimeEstimate && totalWords > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: isVisible ? 1 : 0,
            y: isVisible ? 0 : -20,
          }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-4 z-40 pointer-events-none"
        >
          <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm px-3 py-2">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9">
                <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-zinc-200 dark:stroke-zinc-700"
                    strokeWidth="2.5"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-zinc-900 dark:stroke-zinc-100"
                    strokeWidth="2.5"
                    strokeDasharray="100"
                    style={{
                      strokeDashoffset,
                    }}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-medium text-zinc-700 dark:text-zinc-300">
                    {progressPercentage}%
                  </span>
                </div>
              </div>

              {/* Time info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-zinc-500 dark:text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {remainingTime > 0 ? formatTime(remainingTime) : 'Done!'}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-500 ml-4">
                  {remainingTime > 0 ? 'left' : `${formatTime(totalReadingTime)} read`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

