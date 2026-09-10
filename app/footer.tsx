import { Rss } from 'lucide-react'
import { PalestineSolidarity } from '@/components/palestine-solidarity'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 pt-5 sm:mt-14">
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <a
          href="https://github.com/mo7ammedd"
          className="text-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          © {new Date().getFullYear()} Mohammed Mostafa
        </a>
        <a
          href="/blog/rss.xml"
          className="text-link"
          aria-label="Subscribe via RSS"
        >
          <Rss aria-hidden="true" className="size-3" />
          RSS
        </a>
      </div>
      <PalestineSolidarity />
    </footer>
  )
}
