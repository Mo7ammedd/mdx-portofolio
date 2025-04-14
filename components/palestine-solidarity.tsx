'use client'

import { useState, useEffect } from 'react'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  const [showFacts, setShowFacts] = useState(false)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  
  const facts = [
    "Palestine was historically known as the 'Land of Canaan'",
    "The Palestinian flag was adopted in 1964",
    "Olive trees are a symbol of Palestinian resilience",
    "Palestinian embroidery (tatreez) is recognized by UNESCO",
    "The dabke is a traditional Palestinian folk dance"
  ]
  
  // Pre-defined positions for olive branches to avoid hydration errors
  const oliveBranchPositions = [
    { top: "20%", left: "15%", rotate: "45deg", duration: "8s", delay: "0.5s" },
    { top: "70%", left: "80%", rotate: "120deg", duration: "14s", delay: "2s" },
    { top: "30%", left: "60%", rotate: "90deg", duration: "7s", delay: "1.5s" },
    { top: "60%", left: "25%", rotate: "225deg", duration: "10s", delay: "3s" },
    { top: "80%", left: "65%", rotate: "0deg", duration: "9s", delay: "1s" },
    { top: "40%", left: "70%", rotate: "180deg", duration: "7s", delay: "2.5s" },
    { top: "10%", left: "45%", rotate: "135deg", duration: "12s", delay: "1s" },
    { top: "75%", left: "10%", rotate: "315deg", duration: "8s", delay: "3.5s" }
  ]
  
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
      
      // Rotate facts every 5 seconds
      const factRotation = setInterval(() => {
        if (showFacts) {
          setCurrentFactIndex((prev) => (prev + 1) % facts.length)
        }
      }, 5000)
      
      // Show facts after 3 seconds
      const factTimer = setTimeout(() => {
        setShowFacts(true)
      }, 3000)
      
      return () => {
        clearTimeout(timer)
        clearTimeout(factTimer)
        clearInterval(factRotation)
      }
    }
  }, [showFacts, facts.length])

return (
    <>
        {/* Palestinian background elements - changed from fixed to a fixed container with absolute children */}
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden opacity-10 select-none">
            <div className="absolute inset-0">
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
                
                {/* Tatreez (Palestinian embroidery) pattern */}
                <div className="absolute left-0 bottom-0 translate-y-1/4 -translate-x-1/4">
                    <svg 
                        width="500" 
                        height="500"
                        viewBox="0 0 100 100" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-red-700 dark:text-red-500"
                    >
                        {/* Tatreez-inspired geometric pattern */}
                        <path d="M10,10 L20,20 L10,30 L20,40 L10,50 L20,60 L10,70 L20,80 L10,90" 
                              stroke="currentColor" strokeWidth="1" />
                        <path d="M30,10 L40,20 L30,30 L40,40 L30,50 L40,60 L30,70 L40,80 L30,90" 
                              stroke="currentColor" strokeWidth="1" />
                        <path d="M50,10 L60,20 L50,30 L60,40 L50,50 L60,60 L50,70 L60,80 L50,90" 
                              stroke="currentColor" strokeWidth="1" />
                        <path d="M70,10 L80,20 L70,30 L80,40 L70,50 L80,60 L70,70 L80,80 L70,90" 
                              stroke="currentColor" strokeWidth="1" />
                        <path d="M90,10 L80,20 L90,30 L80,40 L90,50 L80,60 L90,70 L80,80 L90,90" 
                              stroke="currentColor" strokeWidth="1" />
                              
                        {/* Cross-stitch details */}
                        <path d="M15,15 L25,25 M25,15 L15,25" stroke="currentColor" strokeWidth="0.75" />
                        <path d="M35,35 L45,45 M45,35 L35,45" stroke="currentColor" strokeWidth="0.75" />
                        <path d="M55,55 L65,65 M65,55 L55,65" stroke="currentColor" strokeWidth="0.75" />
                        <path d="M75,75 L85,85 M85,75 L75,85" stroke="currentColor" strokeWidth="0.75" />
                    </svg>
                </div>
                
                {/* Palestinian city skyline */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                    <svg 
                        width="700" 
                        height="200"
                        viewBox="0 0 200 50" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-zinc-700 dark:text-zinc-400"
                    >
                        {/* Jerusalem/Bethlehem skyline */}
                        <path d="M0,50 L10,50 L10,40 L15,40 L15,30 L20,20 L25,30 L25,40 L30,40 L30,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M30,50 L40,50 L40,35 L45,35 L45,25 L50,25 L50,35 L55,35 L55,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M55,50 L65,50 L65,30 L70,25 L75,30 L75,40 L80,40 L80,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M80,50 L90,50 L90,35 L95,30 L95,20 L100,15 L105,20 L105,30 L110,35 L110,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M110,50 L120,50 L120,40 L125,40 L125,30 L130,25 L135,30 L135,40 L140,40 L140,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M140,50 L150,50 L150,35 L155,35 L155,25 L160,25 L165,25 L165,35 L170,35 L170,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M170,50 L180,50 L180,30 L185,25 L190,30 L190,45 L195,45 L195,50 L200,50" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                              
                        {/* Dome details in skyline */}
                        <path d="M95,20 A5,5 0 0,0 105,20" stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M50,25 A2.5,2.5 0 0,0 55,25" stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M155,25 A5,5 0 0,0 165,25" stroke="currentColor" strokeWidth="1" fill="none" />
                    </svg>
                </div>
                
                {/* Palestinian Key (symbol of right to return) */}
                <div className="absolute top-1/4 right-1/4 opacity-20">
                    <svg 
                        width="200" 
                        height="100"
                        viewBox="0 0 100 50" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-black dark:text-white"
                    >
                        {/* Key body */}
                        <path d="M10,25 L60,25" stroke="currentColor" strokeWidth="2" />
                        {/* Key head */}
                        <circle cx="75" cy="25" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="75" cy="25" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
                        {/* Key teeth */}
                        <path d="M10,25 L10,35 L15,35 L15,25" stroke="currentColor" strokeWidth="2" />
                        <path d="M20,25 L20,30 L25,30 L25,25" stroke="currentColor" strokeWidth="2" />
                        <path d="M30,25 L30,35 L35,35 L35,25" stroke="currentColor" strokeWidth="2" />
                        <path d="M40,25 L40,30 L45,30 L45,25" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
                
                {/* Handala (Palestinian cultural icon by Naji al-Ali) */}
                <div className="absolute top-3/4 right-1/4">
                    <svg 
                        width="100" 
                        height="150"
                        viewBox="0 0 50 75" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-black dark:text-white"
                    >
                        {/* Handala figure - the boy with his back turned */}
                        <path d="M20,10 L30,10 C35,10 35,15 35,20 L35,50 C35,55 30,60 25,60 C20,60 15,55 15,50 L15,20 C15,15 15,10 20,10 Z" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        {/* Spiky hair */}
                        <path d="M20,10 L19,8 L21,9 L23,7 L25,9 L27,7 L29,9 L31,8 L30,10" 
                              stroke="currentColor" strokeWidth="1" fill="none" />
                        {/* Arms behind back */}
                        <path d="M15,35 L10,40 L10,45 L15,45" stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M35,35 L40,40 L40,45 L35,45" stroke="currentColor" strokeWidth="1" fill="none" />
                        {/* Feet */}
                        <path d="M20,60 L15,65 L20,70" stroke="currentColor" strokeWidth="1" fill="none" />
                        <path d="M30,60 L35,65 L30,70" stroke="currentColor" strokeWidth="1" fill="none" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Floating olive branches with fixed positions */}
        <div className="pointer-events-none fixed inset-0 z-[-2] overflow-hidden select-none">
            {oliveBranchPositions.map((position, i) => (
                <div 
                    key={i}
                    className="absolute opacity-5"
                    style={{
                        top: position.top,
                        left: position.left,
                        transform: `rotate(${position.rotate})`,
                        animation: `float ${position.duration} infinite ease-in-out ${position.delay}`
                    }}
                >
                    <svg 
                        width="100" 
                        height="100"
                        viewBox="0 0 100 100" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-600 dark:text-green-500"
                    >
                        <path d="M50,20 C60,40 60,60 50,80" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M50,30 C40,25 35,30 40,35" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M50,35 C60,30 65,35 60,40" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M50,50 C40,45 35,50 40,55" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M50,55 C60,50 65,55 60,60" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M50,70 C40,65 35,70 40,75" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <path d="M50,75 C60,70 65,75 60,80" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
            ))}
        </div>

        {/* Palestinian cultural facts floating element */}
        <div 
            className={`fixed top-20 right-4 z-10 bg-white/10 dark:bg-black/10 backdrop-blur-sm p-3 rounded-lg border border-green-700/20 max-w-xs transition-all duration-700 ${
                showFacts ? 'translate-x-0 opacity-80' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="text-sm text-black dark:text-white">
                <p className="font-semibold mb-1 text-green-700 dark:text-green-500">Palestinian Culture</p>
                <p className="italic text-xs">{facts[currentFactIndex]}</p>
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

        {/* CSS animation for floating elements */}
        <style jsx>{`
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        `}</style>
    </>
  )
}