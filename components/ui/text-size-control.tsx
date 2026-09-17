'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'blog-text-size'
const CHANGE_EVENT = 'blog-text-size-change'
const DEFAULT_SIZE = 100
const PRESETS = [
  { value: 80, label: 'Small', className: 'text-xs' },
  { value: 100, label: 'Default', className: 'text-sm' },
  { value: 125, label: 'Large', className: 'text-base' },
] as const

let temporarySize: number | undefined

function normalizeSize(value: number) {
  return PRESETS.some((preset) => preset.value === value) ? value : DEFAULT_SIZE
}

function getSize() {
  if (temporarySize !== undefined) return temporarySize

  try {
    return normalizeSize(Number(window.localStorage.getItem(STORAGE_KEY)))
  } catch {
    return DEFAULT_SIZE
  }
}

function getServerSize() {
  return DEFAULT_SIZE
}

function subscribeToSize(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      temporarySize = undefined
      onChange()
    }
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(CHANGE_EVENT, onChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(CHANGE_EVENT, onChange)
  }
}

function setSize(value: number) {
  const nextSize = normalizeSize(value)

  try {
    window.localStorage.setItem(STORAGE_KEY, nextSize.toString())
    temporarySize = undefined
  } catch {
    // Keep the control usable when the browser blocks persistent storage.
    temporarySize = nextSize
  }

  window.dispatchEvent(new Event(CHANGE_EVENT))
}

interface TextSizeContextType {
  size: number
  setSize: (size: number) => void
  reset: () => void
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(
  undefined,
)

export function TextSizeProvider({ children }: { children: ReactNode }) {
  const size = useSyncExternalStore(subscribeToSize, getSize, getServerSize)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--blog-text-size',
      size.toString(),
    )

    return () => {
      document.documentElement.style.removeProperty('--blog-text-size')
    }
  }, [size])

  const value = useMemo(
    () => ({ size, setSize, reset: () => setSize(DEFAULT_SIZE) }),
    [size],
  )

  return (
    <TextSizeContext.Provider value={value}>
      {children}
    </TextSizeContext.Provider>
  )
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (!context)
    throw new Error('useTextSize must be used within TextSizeProvider')
  return context
}

export function TextSizeControl({
  readingTimeMinutes,
}: {
  readingTimeMinutes?: number
}) {
  const { size, setSize } = useTextSize()

  return (
    <div className="not-prose flex flex-wrap items-center justify-between gap-3">
      {readingTimeMinutes && readingTimeMinutes > 0 ? (
        <span className="text-xs text-zinc-400">
          {readingTimeMinutes} min read
        </span>
      ) : null}

      <div
        role="group"
        aria-label="Text size"
        className="flex items-center gap-3"
      >
        <span className="text-xs text-zinc-400">Text size</span>
        <div className="flex items-center gap-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setSize(preset.value)}
              aria-label={`${preset.label} text (${preset.value}%)`}
              aria-pressed={size === preset.value}
              title={`${preset.label} text (${preset.value}%)`}
              className={`icon-button border font-medium ${preset.className} ${
                size === preset.value
                  ? 'border-white/10 bg-white/[0.07] text-zinc-100'
                  : 'border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
              }`}
            >
              <span aria-hidden="true">A</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
