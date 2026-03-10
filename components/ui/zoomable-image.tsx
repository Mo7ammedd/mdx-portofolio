'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

interface ZoomableImageProps {
  src: string
  alt: string
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (!isZoomed) return
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsZoomed(false)
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [isZoomed])

  return (
    <>
      <figure className="my-8 group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-600">
          <img
            src={src}
            alt={alt}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        {alt && (
          <figcaption className="mt-2.5 text-center font-mono text-xs text-zinc-400 dark:text-zinc-600">
            {alt}
          </figcaption>
        )}
      </figure>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6 backdrop-blur-sm"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.img
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {alt && (
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-zinc-500">
                {alt}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
