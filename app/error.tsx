'use client'

import { useEffect } from 'react'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
        Something went wrong!
      </h1>
      <p className="mb-6 max-w-md text-zinc-600 dark:text-zinc-400">
        An error occurred while loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-zinc-900 px-6 py-3 text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Try again
      </button>
    </div>
  )
}

