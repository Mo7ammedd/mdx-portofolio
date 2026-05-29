'use client'
import { Rss } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex flex-col items-center space-y-3">
        {/* Palestine solidarity message */}
        <div className="text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="font-medium">Standing with Palestine 🇵🇸</span>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-md">
            Supporting justice, human rights, and the dignity of all people. 
            Technology should empower communities and promote peace worldwide.
          </p>
        </div>
        
        {/* Original footer content */}
        <div className="flex items-center justify-between w-full">
          <a
            href="https://github.com/mo7ammedd"
            className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            target="_blank"
          >
            <span>Built with Mohammed.</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/blog/rss.xml"
              className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
              aria-label="RSS Feed"
              title="Subscribe via RSS"
            >
              <Rss className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
