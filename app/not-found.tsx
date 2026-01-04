import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | Mohammed Mostafa',
  description: 'The page you are looking for does not exist. Return to Mohammed Mostafa\'s portfolio homepage.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-6xl font-bold text-zinc-900 dark:text-zinc-100">404</h1>
      <h2 className="mb-6 text-2xl font-medium text-zinc-700 dark:text-zinc-300">Page Not Found</h2>
      <p className="mb-8 max-w-md text-zinc-600 dark:text-zinc-400">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-900 px-6 py-3 text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Return Home
      </Link>
    </div>
  )
}
