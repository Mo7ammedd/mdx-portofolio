'use client'

import { useState, useEffect } from 'react'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  
  useEffect(() => {
    // Show the message after a short delay
    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 1500)
    
    // Update counter every day (86400000 ms)
    const daysSinceOct7 = Math.floor((new Date().getTime() - new Date('2023-10-07').getTime()) / 86400000)
    setCounter(daysSinceOct7)
    
    return () => clearTimeout(timer)
  }, [])

return (
    <>
        {/* Palestinian background elements */}
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-10 select-none">
            {/* Palestinian flag colors as background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-green-700 to-white opacity-5"></div>
            
            {/* Dome of the Rock (Al-Aqsa) */}
            <div className="absolute right-0 bottom-0 -translate-y-1/4 translate-x-1/4">
                <svg 
                    width="600" 
                    height="600" 
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-amber-600 dark:text-amber-500"
                >
                    {/* Dome base */}
                    <path d="M30,70 H70 V75 H30 Z" stroke="currentColor" strokeWidth="1.5" />
                    {/* Dome */}
                    <path d="M35,70 C35,55 50,40 65,70" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    {/* Crescent */}
                    <path d="M52,45 A5,5 0 1,0 57,40 A8,8 0 1,1 52,45" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    {/* Structure base */}
                    <path d="M25,75 H75 V80 H25 Z" stroke="currentColor" strokeWidth="1.5" />
                    {/* Columns */}
                    <path d="M35,75 V70" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M45,75 V70" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M55,75 V70" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M65,75 V70" stroke="currentColor" strokeWidth="1.5" />
                </svg>
            </div>

            {/* Palestinian olive branch */}
            <div className="absolute left-0 top-0 -translate-y-1/4 -translate-x-1/4">
                <svg 
                    width="600" 
                    height="600"
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-green-600 dark:text-green-500"
                >
                    {/* Main stem */}
                    <path
                        d="M50,20 C60,40 60,60 50,80"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                    />
                    {/* Left leaves */}
                    <path d="M50,30 C40,25 35,30 40,35" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M48,45 C38,40 33,45 38,50" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M46,60 C36,55 31,60 36,65" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    
                    {/* Right leaves */}
                    <path d="M50,35 C60,30 65,35 60,40" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M52,50 C62,45 67,50 62,55" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <path d="M50,65 C60,60 65,65 60,70" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    
                    {/* Olives */}
                    <circle cx="42" cy="32" r="2" stroke="currentColor" strokeWidth="1" />
                    <circle cx="40" cy="47" r="2" stroke="currentColor" strokeWidth="1" />
                    <circle cx="38" cy="62" r="2" stroke="currentColor" strokeWidth="1" />
                    <circle cx="58" cy="37" r="2" stroke="currentColor" strokeWidth="1" />
                    <circle cx="60" cy="52" r="2" stroke="currentColor" strokeWidth="1" />
                    <circle cx="62" cy="67" r="2" stroke="currentColor" strokeWidth="1" />
                </svg>
            </div>

            {/* Keffiyeh pattern */}
            <div className="absolute right-0 top-1/2 -translate-x-1/4 -translate-y-1/2">
                <svg 
                    width="400" 
                    height="400"
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-zinc-800 dark:text-zinc-300"
                >
                    {/* Keffiyeh pattern lines */}
                    <path d="M10,10 L30,30 M20,10 L40,30 M30,10 L50,30 M40,10 L60,30 M50,10 L70,30 M60,10 L80,30 M70,10 L90,30" 
                                stroke="currentColor" strokeWidth="0.75" />
                    <path d="M10,20 L30,40 M20,20 L40,40 M30,20 L50,40 M40,20 L60,40 M50,20 L70,40 M60,20 L80,40 M70,20 L90,40" 
                                stroke="currentColor" strokeWidth="0.75" />
                    <path d="M10,30 L30,50 M20,30 L40,50 M30,30 L50,50 M40,30 L60,50 M50,30 L70,50 M60,30 L80,50 M70,30 L90,50" 
                                stroke="currentColor" strokeWidth="0.75" />
                    <path d="M10,40 L30,60 M20,40 L40,60 M30,40 L50,60 M40,40 L60,60 M50,40 L70,60 M60,40 L80,60 M70,40 L90,60" 
                                stroke="currentColor" strokeWidth="0.75" />
                    <path d="M10,50 L30,70 M20,50 L40,70 M30,50 L50,70 M40,50 L60,70 M50,50 L70,70 M60,50 L80,70 M70,50 L90,70" 
                                stroke="currentColor" strokeWidth="0.75" />
                </svg>
            </div>

            {/* Watermelon symbol (Palestinian resistance symbol) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <svg 
                    width="300" 
                    height="300"
                    viewBox="0 0 100 100" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M20,50 C20,30 40,20 50,20 C60,20 80,30 80,50 C80,70 60,80 50,80 C40,80 20,70 20,50 Z" 
                                fill="#4CAF50" stroke="#1B5E20" strokeWidth="1" />
                    <path d="M25,50 C25,35 40,25 50,25 C60,25 75,35 75,50 C75,65 60,75 50,75 C40,75 25,65 25,50 Z" 
                                fill="#E53935" stroke="#B71C1C" strokeWidth="1" />
                    <path d="M30,50 C30,38 42,30 50,30 C58,30 70,38 70,50 C70,62 58,70 50,70 C42,70 30,62 30,50 Z" 
                                fill="#FFEB3B" stroke="#F57F17" strokeWidth="0.5" />
                    {/* Seeds */}
                    <circle cx="40" cy="40" r="1.5" fill="black" />
                    <circle cx="45" cy="50" r="1.5" fill="black" />
                    <circle cx="50" cy="40" r="1.5" fill="black" />
                    <circle cx="55" cy="50" r="1.5" fill="black" />
                    <circle cx="60" cy="40" r="1.5" fill="black" />
                    <circle cx="40" cy="60" r="1.5" fill="black" />
                    <circle cx="50" cy="60" r="1.5" fill="black" />
                    <circle cx="60" cy="60" r="1.5" fill="black" />
                </svg>
            </div>
        </div>

    {/* Solidarity message banner */}
    <div 
        className={`fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-black via-red-600 to-green-600 p-3 text-center text-white transition-all duration-700 ${
            showMessage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
    >
        <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-sm md:text-base font-semibold">
            From The River To The Sea 
            </p>
            <p className="text-xs md:text-sm">
            Day {counter}: We remember Gaza
        </p>
      </div>
    </div>

    </>
  )
}