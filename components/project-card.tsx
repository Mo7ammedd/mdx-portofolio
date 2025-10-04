import Link from 'next/link'

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
    <div 
      className="relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border p-2 shadow-sm transition-all duration-300 ease-out hover:shadow-lg"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card)',
        color: 'var(--card-foreground)',
      }}
    >
      {/* Glassmorphism overlay */}
      <div 
        className="absolute inset-0 z-[1] overflow-hidden rounded-xl"
        style={{
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          background: 'rgba(9, 9, 11, 0.6)',
        }}
      ></div>
      
      {/* Decorative colored circle - left */}
      <div 
        className="absolute left-[21px] top-[21px] h-[80px] w-[80px] rounded-full"
        style={{ background: '#ffffff' }}
      ></div>
      
      {/* Decorative colored circle - right (hidden by default) */}
      <div 
        className="absolute right-[100px] top-[20px] hidden h-[50px] w-[50px] rounded-full"
        style={{ background: '#c15e90d6' }}
      ></div>

      {/* Card Header */}
      <div className="z-[99] flex flex-col gap-1.5 px-2">
        <div className="space-y-1">
          <h3 
            className="mt-1 text-base font-semibold"
            style={{ color: 'var(--foreground)' }}
          >
            {title}
          </h3>
          <p 
            className="max-w-full font-sans text-xs"
            style={{ 
              color: 'var(--muted-foreground)',
              textWrap: 'pretty' 
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Card Content */}
      <div className="z-[99] mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-auto whitespace-nowrap rounded-md border border-transparent px-1 py-0 text-[9px] font-medium transition-[color,box-shadow]"
                style={{
                  backgroundColor: 'var(--secondary)',
                  color: 'var(--secondary-foreground)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="z-[99] flex items-center px-2 pb-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links?.map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <span 
                  className="flex w-fit shrink-0 items-center justify-center gap-2 overflow-auto whitespace-nowrap rounded-md border border-transparent px-2 py-1 text-[10px] font-medium transition-[color,box-shadow]"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  {link.icon}
                  {link.type}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}