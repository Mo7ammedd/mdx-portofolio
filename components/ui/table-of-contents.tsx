import { ChevronDown, List } from 'lucide-react'
import { TableOfContentsObserver } from './table-of-contents-observer'

export interface BlogHeading {
  id: string
  text: string
  level: 2 | 3
}

type TocSection = { heading: BlogHeading; children: BlogHeading[] }

function groupSections(headings: BlogHeading[]) {
  const sections: TocSection[] = []
  for (const heading of headings) {
    const parent = sections.at(-1)
    if (heading.level === 3 && parent?.heading.level === 2) {
      parent.children.push(heading)
    } else {
      sections.push({ heading, children: [] })
    }
  }

  return sections
}

function SectionLinks({ sections }: { sections: TocSection[] }) {
  return (
    <ol className="space-y-1">
      {sections.map(({ heading, children }) => (
        <li key={heading.id} className="relative">
          <a
            href={`#${heading.id}`}
            data-section-link
            className={`blog-toc-link ${children.length ? 'pr-9' : ''}`}
          >
            {heading.text}
          </a>
          {children.length > 0 && (
            <details data-toc-subsections className="group/subsections">
              <summary className="absolute top-0 right-0 flex size-8 cursor-pointer list-none items-center justify-center rounded-md text-zinc-500 hover:bg-white/5 hover:text-zinc-200 [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Subsections of {heading.text}</span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-open/subsections:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <ol className="my-1 ml-3 space-y-0.5 border-l border-white/10 pl-2">
                {children.map((child) => (
                  <li key={child.id}>
                    <a
                      href={`#${child.id}`}
                      data-section-link
                      className="blog-toc-link"
                    >
                      {child.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </li>
      ))}
    </ol>
  )
}

export function TableOfContents({
  headings,
  slug,
}: {
  headings: BlogHeading[]
  slug?: string
}) {
  if (headings.length === 0) return null
  const sections = groupSections(headings)
  const preview = sections.slice(0, 6)
  const remaining = sections.slice(6)

  return (
    <TableOfContentsObserver slug={slug}>
      <details
        data-toc-mobile
        className="blog-toc-mobile group/toc border-y border-white/[0.07]"
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-sm text-zinc-300 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <List aria-hidden="true" className="size-4 text-zinc-500" />
            On this page
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-open/toc:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <nav aria-label="On this page" className="blog-toc-scroll pb-3">
          <SectionLinks sections={sections} />
        </nav>
      </details>

      <div className="blog-toc-desktop">
        <p className="section-heading mb-4 px-2">On this page</p>
        <nav aria-label="On this page" className="blog-toc-scroll">
          <SectionLinks sections={preview} />
          {remaining.length > 0 && (
            <details data-toc-more className="group/more mt-3">
              <summary className="flex min-h-8 cursor-pointer list-none items-center gap-2 px-2 text-xs text-zinc-400 hover:text-zinc-200 [&::-webkit-details-marker]:hidden">
                More sections ({remaining.length})
                <ChevronDown
                  aria-hidden="true"
                  className="size-3 transition-transform group-open/more:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <div className="mt-1">
                <SectionLinks sections={remaining} />
              </div>
            </details>
          )}
        </nav>
        <a href="#main-content" className="text-link mt-4 px-2">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </TableOfContentsObserver>
  )
}
