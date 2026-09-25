import Link from 'next/link'

import type { PortfolioProject } from './data'
import type { BlogPost } from '@/lib/blog-utils'
import { getProjectsForArticle } from '@/lib/project-links'

interface PersonalClientProps {
  blogPosts: BlogPost[]
  projects: PortfolioProject[]
}

interface WritingEntry {
  title: string
  href: string
  publishedTime?: string
  project?: PortfolioProject
}

function caseStudyEntry(project: PortfolioProject): WritingEntry {
  return {
    title: project.title,
    href: project.caseStudyHref,
    project,
  }
}

export function PersonalClient({ blogPosts, projects }: PersonalClientProps) {
  const entries: WritingEntry[] = []
  const remainingProjects = new Map(
    projects.map((project) => [project.slug, project]),
  )

  for (const post of blogPosts) {
    entries.push({
      title: post.title,
      href: `/blog/${post.slug}`,
      publishedTime: post.publishedTime,
    })

    for (const { slug } of getProjectsForArticle(post.slug)) {
      const project = remainingProjects.get(slug)
      if (project) {
        entries.push(caseStudyEntry(project))
        remainingProjects.delete(slug)
      }
    }
  }

  entries.push(...Array.from(remainingProjects.values(), caseStudyEntry))

  return (
    <main className="space-y-10 sm:space-y-12">
      <section aria-labelledby="intro-heading">
        <h1
          id="intro-heading"
          className="text-[28px] leading-9 font-medium tracking-tight text-zinc-100"
        >
          Mohammed Mostafa
        </h1>
        <p
          id="work"
          className="mt-4 scroll-mt-8 text-base leading-7 text-zinc-300"
        >
          I’m a software engineer in Egypt. I build backend systems at{' '}
          <a
            href="https://oblien.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Oblien
          </a>{' '}
          and{' '}
          <a
            href="https://medicascopehms.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Medica Scope
          </a>
          .
        </p>
      </section>

      {entries.length > 0 && (
        <section
          id="writing"
          aria-labelledby="writing-heading"
          className="scroll-mt-8"
        >
          <h2
            id="writing-heading"
            className="text-base font-medium text-zinc-100"
          >
            Writing
          </h2>
          <ul id="projects" className="mt-3 scroll-mt-8">
            {entries.map((entry) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  className="group grid min-h-11 grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3 rounded-sm py-2 leading-7 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                  data-project-name={entry.project?.title}
                  data-link-type={entry.project ? 'case_study' : undefined}
                >
                  {entry.publishedTime ? (
                    <time
                      dateTime={entry.publishedTime}
                      className="text-sm text-zinc-400 tabular-nums"
                    >
                      {new Date(entry.publishedTime).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'short',
                          timeZone: 'UTC',
                        },
                      )}
                    </time>
                  ) : (
                    <span className="text-sm whitespace-nowrap text-zinc-400">
                      Case study
                    </span>
                  )}
                  <span className="text-base text-zinc-200">
                    <span className="decoration-zinc-500 underline-offset-4 group-hover:underline">
                      {entry.title}
                    </span>
                    {entry.project && (
                      <span className="text-zinc-400">
                        {' — '}
                        {entry.project.summary ?? entry.project.description}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
