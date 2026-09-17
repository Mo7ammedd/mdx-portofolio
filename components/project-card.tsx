import { ArrowRight, ArrowUpRight, Play } from 'lucide-react'
import Link from 'next/link'

import type { PortfolioProject } from '@/app/data'
import { ProjectVisual } from '@/components/project-visual'
import { cn } from '@/lib/utils'

interface Props {
  project: PortfolioProject
  featured?: boolean
  compact?: boolean
  headingLevel?: 2 | 3
}

export function ProjectCard({
  project,
  featured = false,
  compact = false,
  headingLevel = 3,
}: Props) {
  const titleId = `project-${project.slug}-title`
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'group min-w-0',
        compact
          ? 'py-5'
          : featured
            ? 'overflow-hidden rounded-lg border border-white/15 bg-zinc-950'
            : 'border-b border-white/[0.08] py-6',
      )}
    >
      <div
        className={cn(
          'grid items-center gap-5',
          compact
            ? 'grid-cols-[minmax(0,1fr)_7rem] items-start gap-x-3 gap-y-0 sm:grid-cols-[minmax(0,1fr)_8rem] sm:gap-x-5'
            : featured
              ? 'p-5 sm:grid-cols-[minmax(0,1fr)_15rem] sm:gap-6 sm:p-6'
              : 'sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-6',
        )}
      >
        <div className={cn('min-w-0', compact && 'contents')}>
          <p
            className={cn(
              'font-mono text-[11px] leading-5 tracking-[0.1em] text-zinc-400 uppercase',
              compact && 'col-start-1 row-start-1',
            )}
          >
            {featured && <span className="text-zinc-200">Featured · </span>}
            {project.category}
          </p>
          <Heading
            id={titleId}
            className={cn(
              'mt-2 font-medium tracking-tight text-zinc-100',
              featured && !compact ? 'text-2xl' : 'text-lg',
              compact && 'col-start-1 row-start-2 mt-1',
            )}
          >
            <Link
              href={project.caseStudyHref}
              className="rounded-sm transition-colors hover:text-white"
              data-project-name={project.title}
              data-link-type="case_study"
            >
              {project.title}
            </Link>
          </Heading>
          <p
            className={cn(
              'body-copy mt-3',
              compact && 'col-span-2 row-start-3',
            )}
          >
            {project.description}
          </p>
          <ul
            aria-label={`${project.title} technologies`}
            className={cn(
              'meta-text mt-3 flex flex-wrap gap-x-3 gap-y-1',
              compact && 'col-span-2 row-start-4 mt-2',
            )}
          >
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>

        <ProjectVisual
          kind={project.visual}
          className={cn(
            'w-full rounded-md border border-white/[0.07] bg-black',
            !featured && 'max-sm:mx-auto max-sm:max-w-xs',
            compact && 'col-start-2 row-span-2 row-start-1 self-center',
          )}
        />
      </div>

      <div
        className={cn(
          compact
            ? 'mt-3'
            : featured
              ? 'border-t border-white/[0.08] px-5 pt-4 pb-5 sm:px-6 sm:pb-6'
              : 'mt-4',
        )}
      >
        <a
          href={`${project.caseStudyHref}#evidence`}
          className="inline-flex min-h-11 items-start gap-2 rounded-sm py-1 text-[13px] leading-6 text-zinc-400 transition-colors hover:text-zinc-200"
          data-project-name={project.title}
          data-link-type="case_study"
        >
          <span className="shrink-0 font-medium text-zinc-300">Evidence</span>
          <span aria-hidden="true" className="text-zinc-600">
            /
          </span>
          <span>{project.highlight}</span>
        </a>

        <div
          className={cn(
            'mt-3 flex flex-wrap items-center gap-x-5 gap-y-1',
            compact && 'mt-2 gap-x-3',
          )}
        >
          {project.demoHref && (
            <a
              href={project.demoHref}
              className={cn('button-primary', compact && 'px-3')}
              aria-label={`Try demo: ${project.title}`}
              data-project-name={project.title}
              data-link-type="demo"
            >
              <Play aria-hidden="true" className="size-3.5" />
              Try demo
            </a>
          )}
          <Link
            href={project.caseStudyHref}
            className="text-link min-h-11 text-zinc-200"
            aria-label={`Read case study: ${project.title}`}
            data-project-name={project.title}
            data-link-type="case_study"
          >
            Read case study{' '}
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link min-h-11"
            aria-label={`${project.title} on GitHub`}
            data-project-name={project.title}
            data-link-type="source"
          >
            GitHub <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
          {project.articleHref && !compact && (
            <Link
              href={project.articleHref}
              className="text-link min-h-11"
              aria-label={`Read walkthrough: ${project.title}`}
              data-project-name={project.title}
              data-link-type="article"
            >
              Read walkthrough{' '}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
