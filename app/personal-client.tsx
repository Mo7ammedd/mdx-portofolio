import Link from 'next/link'

import type { PortfolioProject } from './data'
import type { BlogPost } from '@/lib/blog-utils'

interface PersonalClientProps {
  blogPosts: BlogPost[]
  projects: PortfolioProject[]
}

export function PersonalClient({ blogPosts, projects }: PersonalClientProps) {
  const selectedProjects = projects
    .filter((project) => project.featured)
    .slice(0, 3)

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

      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="scroll-mt-8"
      >
        <h2
          id="projects-heading"
          className="text-base font-medium text-zinc-100"
        >
          Projects
        </h2>
        <ul className="mt-3">
          {selectedProjects.map((project) => (
            <li key={project.slug}>
              <Link
                href={project.caseStudyHref}
                className="group block min-h-11 rounded-sm py-2 text-base leading-7"
                data-project-name={project.title}
                data-link-type="case_study"
              >
                <span className="font-medium text-zinc-200 decoration-zinc-500 underline-offset-4 group-hover:underline">
                  {project.title}
                </span>
                <span className="text-zinc-400">
                  {' — '}
                  {project.summary ?? project.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {blogPosts.length > 0 && (
        <section id="writing" aria-labelledby="writing-heading">
          <h2
            id="writing-heading"
            className="text-base font-medium text-zinc-100"
          >
            Writing
          </h2>
          <ul className="mt-3">
            {blogPosts.slice(0, 3).map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid min-h-11 grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3 rounded-sm py-2 leading-7 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                >
                  <time
                    dateTime={post.publishedTime}
                    className="text-sm text-zinc-400 tabular-nums"
                  >
                    {new Date(post.publishedTime).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      timeZone: 'UTC',
                    })}
                  </time>
                  <span className="text-base text-zinc-200 decoration-zinc-500 underline-offset-4 group-hover:underline">
                    {post.title}
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
