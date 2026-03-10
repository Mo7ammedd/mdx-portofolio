import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  title: string
  description: string
  tags: readonly string[]
  link?: string
  image?: string
  links?: readonly {
    icon: React.ReactNode
    type: string
    href: string
  }[]
}

export function ProjectCard({ title, description, tags, links }: Props) {
  return (
    <div className="theme-card group flex h-full flex-col rounded-2xl p-5 hover:scale-[1.02]">
      {/* Title row */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-zinc-100">
          {title}
        </h3>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-zinc-600 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      {/* Description */}
      <p className="mt-3 flex-1 text-xs leading-relaxed text-zinc-500 line-clamp-3">
        {description}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-2 py-0.5 font-mono text-[10px]"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(113,113,122,1)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer links */}
      {links && links.length > 0 && (
        <div
          className="mt-4 flex gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              target="_blank"
              className="flex items-center gap-1.5 text-[11px] text-zinc-500 transition-colors duration-150 hover:text-zinc-200 no-underline"
            >
              {link.icon}
              {link.type}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
