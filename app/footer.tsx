'use client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const THEMES_OPTIONS = [
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
]

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800"
      defaultValue={theme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        setTheme(id as string)
      }}
    >
      {THEMES_OPTIONS.map((theme) => {
        return (
          <button
            key={theme.id}
            className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
            type="button"
            aria-label={`Switch to ${theme.label} theme`}
            data-id={theme.id}
          >
            {theme.icon}
          </button>
        )
      })}
    </AnimatedBackground>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex flex-col items-center space-y-3">
        {/* Palestine solidarity message */}
        <div className="text-center">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="font-medium">Standing with Palestine 🇵🇸 </span>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 max-w-md">
             Free Palestine. Free People. Free Future.
          </p>
        </div>
        
        {/* Original footer content */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/mo7ammedd"
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              target="_blank"
            >
              <span>Built with Mohammed.</span>
            </a>
            <a
              href="/rss.xml"
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              target="_blank"
              aria-label="RSS Feed"
              title="Subscribe to RSS feed"
            >
              RSS
            </a>
          </div>
          <div className="text-xs text-zinc-400">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </footer>
  )
}
