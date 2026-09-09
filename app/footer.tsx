import { Rss } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-14 border-t border-white/[0.07] py-6 sm:mt-16">
      <div className="flex flex-col items-start space-y-5">
        {/* Palestine solidarity message */}
        <div>
          <p className="mb-2 text-xs text-zinc-400">
            <span className="font-medium">Standing with Palestine 🇵🇸</span>
          </p>
          <p className="max-w-md text-xs leading-5 text-zinc-400">
            Supporting justice, human rights, and the dignity of all people.
            Technology should empower communities and promote peace worldwide.
          </p>
        </div>

        {/* Original footer content */}
        <div className="flex w-full items-center justify-between">
          <a
            href="https://github.com/mo7ammedd"
            className="inline-flex min-h-9 items-center text-xs text-zinc-400 transition-colors hover:text-zinc-100"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Built with Mohammed.</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/blog/rss.xml"
              className="inline-flex size-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
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
