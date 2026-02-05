'use client'

import { useState, useEffect } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface ZoomableImageProps {
  src: string
  alt: string
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false)
      }
    }

    if (isZoomed) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when zoomed
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isZoomed])

  return (
    <>
      {/* Thumbnail with hover effect */}
      <div className="group relative cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <img
          src={src}
          alt={alt}
          className="rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl"
        />
        {/* Zoom indicator on hover */}
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/10 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:bg-zinc-900/90">
            <ZoomIn className="h-6 w-6 text-zinc-700 dark:text-zinc-300" />
          </div>
        </div>
      </div>

      {/* Zoomed Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Zoomed image */}
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Helper text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
              Press ESC or click anywhere to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
