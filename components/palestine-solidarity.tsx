'use client'
import { useState, useEffect } from 'react'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 1000)
      
      const daysSinceOct7 = Math.floor((new Date().getTime() - new Date('2023-10-07').getTime()) / 86400000)
      setCounter(daysSinceOct7)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [])

  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 p-1.5 text-center transition-all duration-700 backdrop-blur-xl border-t ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } bg-white/70 dark:bg-black/30 border-zinc-200 dark:border-white/20 shadow-[0_-4px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_32px_rgba(0,0,0,0.3)]`}
      >
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <p className="text-xs md:text-sm font-semibold text-zinc-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">
            From The River To The Sea 
          </p>
          <p className="text-[10px] md:text-xs text-zinc-600 dark:text-zinc-300">
            Day {counter}: We still remember Gaza
          </p>
        </div>
      </div>
    </>
  )
}