import { ArrowUpRight } from 'lucide-react'

interface Props {
  title: string
  description: string
  tags: readonly string[]
  href?: string
  links?: readonly {
    icon: React.ReactNode
    type: string
    href: string
  }[]
}

export function ProjectCard({ title, description, tags, links, href }: Props) {
  const primaryLink = links?.find((link) => link.href === href)
  const secondaryLinks = links?.filter((link) => link.href !== href) ?? []

  return (
    <div className="list-row group relative grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-5 gap-y-2 sm:grid-cols-[10rem_minmax(0,1fr)_auto]">
      <h3 className="text-sm leading-6 font-medium text-zinc-200 transition-colors group-hover:text-white">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${primaryLink?.type ?? 'View project'}: ${title}`}
            className="rounded-sm after:absolute after:inset-0 after:rounded-md"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </h3>

      <div className="col-start-1 row-start-2 min-w-0 sm:col-start-2 sm:row-start-1">
        <p className="text-[13px] leading-6 text-zinc-400">{description}</p>
        {tags.length > 0 && (
          <ul
            aria-label="Technologies"
            className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] leading-5 text-zinc-400"
          >
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-start-2 row-start-1 flex items-start gap-1 sm:col-start-3">
        {secondaryLinks.map((link) => (
          <a
            key={`${link.type}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.type}: ${title}`}
            title={link.type}
            className="relative z-10 -my-2 flex size-10 items-center justify-center rounded-sm text-zinc-400 transition-colors hover:text-white"
          >
            <span aria-hidden="true">{link.icon}</span>
          </a>
        ))}
        {href && (
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1.5 size-3.5 text-zinc-500 transition-colors group-hover:text-zinc-200"
          />
        )}
      </div>
    </div>
  )
}
