import { EMAIL, SOCIAL_LINKS } from '@/app/data'
import { PalestineSolidarity } from '@/components/palestine-solidarity'
import { SiteLink } from '@/components/site-link'

export function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 pt-4 sm:mt-14">
      <nav
        id="connect"
        aria-label="Contact links"
        className="flex flex-wrap items-center gap-x-6"
      >
        <a href={`mailto:${EMAIL}`} className="text-link text-sm">
          Email
        </a>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link text-sm"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4">
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Mohammed Mostafa
        </p>
        <nav aria-label="More links" className="flex items-center gap-5">
          <SiteLink href="/ask" className="text-link text-xs">
            Ask
          </SiteLink>
          <SiteLink
            href="/blog/rss.xml"
            reloadDocument
            className="text-link text-xs"
            aria-label="Subscribe via RSS"
          >
            RSS
          </SiteLink>
        </nav>
      </div>
      <PalestineSolidarity />
    </footer>
  )
}
