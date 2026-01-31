'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        setShowMessage(true)
      }, 1500)
      
      const daysSinceOct7 = Math.floor((new Date().getTime() - new Date('2023-10-07').getTime()) / 86400000)
      setCounter(daysSinceOct7)
      
      return () => {
        clearTimeout(timer)
      }
    }
  }, [])

  if (!mounted) return null
  
  const isDark = resolvedTheme === 'dark'

  return (
    <>
      {/* Solidarity message banner - theme adaptive */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 p-1.5 text-center transition-all duration-700 ${
          showMessage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } ${isDark ? 'text-white' : 'text-zinc-900'}`}
        style={{
          background: isDark 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: isDark 
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(0, 0, 0, 0.15)',
          boxShadow: isDark 
            ? '0 -4px 32px rgba(0, 0, 0, 0.3)' 
            : '0 -4px 24px rgba(0, 0, 0, 0.12)'
        }}
      >
        <div className="flex flex-col items-center justify-center space-y-0.5">
          <p className={`text-xs md:text-sm font-semibold ${
            isDark ? 'drop-shadow-lg' : 'drop-shadow-md'
          }`}>
            From The River To The Sea 
          </p>
          <p className={`text-[10px] md:text-xs ${
            isDark ? 'text-zinc-300 drop-shadow-sm' : 'text-zinc-700 drop-shadow-sm'
          }`}>
            Day {counter}: We still remember Gaza
          </p>
        </div>
      </div>
    </>
  )
}