'use client'
import { useState, useEffect } from 'react'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  
  useEffect(() => {
    // Client-side only code
    if (typeof window !== 'undefined') {
      // Show the message after a short delay
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 1500)
      
      // Update counter every day (86400000 ms)
      const daysSinceOct7 = Math.floor((new Date().getTime() - new Date('2023-10-07').getTime()) / 86400000)
      setCounter(daysSinceOct7)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [])

  return (
    <>
      {/* Solidarity message banner - glassy dark theme */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 p-1.5 text-center text-white transition-all duration-700 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 -4px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <p className="text-xs md:text-sm font-semibold drop-shadow-lg">
            From The River To The Sea 
          </p>
          <p className="text-[10px] md:text-xs text-zinc-300 drop-shadow-sm">
            Day {counter}: We still remember Gaza
          </p>
        </div>
      </div>
    </>
  )
}