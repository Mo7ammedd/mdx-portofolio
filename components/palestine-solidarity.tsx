'use client'

import { useState, useEffect } from 'react'

export function PalestineSolidarity() {
  const [showMessage, setShowMessage] = useState(false)
  const [counter, setCounter] = useState(0)
  const [showFacts, setShowFacts] = useState(false)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  
  const facts = [
    // History
    "Palestine was historically known as the 'Land of Canaan'",
    "Jerusalem, one of the oldest cities in the world, has deep historical roots in Palestine",
    "The Palestinian flag was officially adopted in 1964 by the PLO",
    "The Nakba in 1948 resulted in the displacement of over 700,000 Palestinians",
    "Palestine was part of the Ottoman Empire until the end of World War I",
    "The British Mandate for Palestine lasted from 1920 to 1948",
    "The 1987 First Intifada was a major Palestinian uprising against Israeli occupation",
    "Palestine was granted non-member observer state status in the United Nations in 2012",
  
    // Culture
    "Olive trees are a symbol of Palestinian resilience and connection to the land",
    "Palestinian embroidery (tatreez) is recognized by UNESCO as intangible cultural heritage",
    "The dabke is a traditional Palestinian folk dance performed at weddings and celebrations",
    "Palestinian cuisine includes dishes like maqluba, musakhan, hummus, and knafeh",
    "Poetry is a significant cultural expression, with Mahmoud Darwish being a renowned Palestinian poet",
    "Handcrafted ceramics and mosaics are traditional Palestinian arts",
    "Storytelling and oral traditions are deeply rooted in Palestinian culture",
    "Many Palestinian families pass down traditional recipes and clothing through generations"
  ];
  
  
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

        {/* Solidarity message banner - reduced size */}
        <div 
            className={`fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-black via-red-600 to-green-600 p-1.5 text-center text-white transition-all duration-700 ${
                showMessage ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
        >
            <div className="flex flex-col items-center justify-center space-y-0.5">
                <p className="text-xs md:text-sm font-semibold">
                From The River To The Sea 
                </p>
                <p className="text-[10px] md:text-xs">
                Day {counter}: We still remember Gaza
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