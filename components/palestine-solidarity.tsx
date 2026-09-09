'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const timer = setTimeout(() => {
      const daysSinceOct7 = Math.floor(
        (Date.now() - new Date('2023-10-07').getTime()) / 86400000,
      )
      setCounter(daysSinceOct7)
      setShowMessage(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Keep the writing pages clear of fixed overlays.
  const isBlogPage = pathname === '/blog' || pathname.startsWith('/blog/')
  if (isBlogPage) return null

  return (
    <>
      {/* Solidarity message banner */}
      <div
        aria-hidden={!showMessage}
        className={`fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-[#080808]/90 p-1.5 text-center text-zinc-200 backdrop-blur-md transition-all duration-700 motion-reduce:transition-none ${
          showMessage
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <p className="text-xs font-medium">From The River To The Sea</p>
          <p className="text-[10px] text-zinc-400">
            Day {counter}: We still remember Gaza
          </p>
        </div>
      </div>
    </>
  )
}
