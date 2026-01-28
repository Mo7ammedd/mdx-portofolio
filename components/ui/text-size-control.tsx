'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Type, X } from 'lucide-react'

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

export function TextSizeControl() {
  const { size, setSize } = useTextSize()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="fixed right-6 top-1/3 z-50"
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
  )
}