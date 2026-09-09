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
    <div className="theme-card group relative flex h-full min-w-0 flex-col rounded-xl p-4 motion-reduce:transition-none">
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${primaryLink?.type ?? 'View project'}: ${title}`}
          title={primaryLink?.type}
          className="absolute inset-0 rounded-xl"
        />
      )}

      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm leading-6 font-medium tracking-tight text-zinc-200 transition-colors group-hover:text-white">
          {title}
        </h3>
        {links && links.length > 0 && (
          <div className="-mt-0.5 -mr-1 flex shrink-0 flex-wrap gap-1">
            {primaryLink && (
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center text-zinc-400 transition-colors group-hover:text-white"
              >
                {primaryLink.icon}
              </span>
            )}
            {secondaryLinks.map((link) => (
              <a
                key={`${link.type}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.type}: ${title}`}
                title={link.type}
                className="relative z-10 flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span aria-hidden="true">{link.icon}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-zinc-400">
        {description}
      </p>

      {tags.length > 0 && (
        <ul
          aria-label="Technologies"
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] leading-4 text-zinc-400"
        >
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
