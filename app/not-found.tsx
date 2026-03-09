'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Glassy card */}
        <div
          className="flex flex-col items-center gap-4 rounded-2xl px-12 py-10"
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <span className="text-7xl font-bold tracking-tight text-zinc-100">404</span>
          <div className="h-px w-16 bg-zinc-700" />
          <p className="text-lg font-medium text-zinc-300">Page not found</p>
          <p className="max-w-xs text-sm text-zinc-500">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>
    </div>
  )
}
