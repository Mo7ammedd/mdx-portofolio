import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

import { PROJECTS } from '@/app/data'
import { ProjectVisual } from '@/components/project-visual'
import { SchedulerDemo } from '@/components/scheduler-demo'
import { getAllBlogPosts } from '@/lib/blog-utils'
import {
  getProjectCaseStudy,
  PROJECT_CASE_STUDIES,
} from '@/lib/project-case-studies'
import { PROJECT_LINKS } from '@/lib/project-links'
import { getProjectOGImagePath } from '@/lib/og-metadata'
import { generateSEO } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return PROJECT_CASE_STUDIES.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProjectCaseStudy(slug)
  if (!project) notFound()

  return generateSEO({
    title: `${project.title} — ${project.subtitle}`,
    description: project.description,
    path: `/projects/${slug}`,
    ogImage: getProjectOGImagePath(slug),
    tags: project.technologies,
  })
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectCaseStudy(slug)
  if (!project) notFound()
  const presentation = PROJECTS.find((entry) => entry.slug === slug)
  const relatedSlugs =
    PROJECT_LINKS.find((entry) => entry.slug === slug)?.articles ?? []
  const posts = (await getAllBlogPosts()).filter((post) =>
    relatedSlugs.some((article) => article === post.slug),
  )

  return (
    <main aria-labelledby="project-title" className="space-y-10 sm:space-y-12">
      <div>
        <Link href="/projects" className="text-link mb-6">
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          All projects
        </Link>
        <p className="section-heading">Project case study</p>
        <h1
          id="project-title"
          className="mt-4 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
        >
          {project.title}
        </h1>
        <p className="mt-2 text-lg leading-7 tracking-tight text-zinc-300">
          {project.subtitle}
        </p>
        <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-[15px]">
          {project.description}
        </p>
        <ul
          aria-label="Technologies"
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] text-zinc-400"
        >
          {project.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          {slug === 'simukernel' && (
            <a
              href="#scheduler"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-zinc-100 px-4 text-xs font-medium text-zinc-950 transition-colors hover:bg-white"
              data-project-name={project.title}
              data-link-type="demo"
            >
              Try demo <ArrowDown aria-hidden="true" className="size-3.5" />
            </a>
          )}
          <a
            href={project.source}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link text-zinc-200"
            data-project-name={project.title}
            data-link-type="source"
          >
            GitHub <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </a>
          {posts[0] && (
            <Link
              href={`/blog/${posts[0].slug}`}
              className="text-link"
              data-project-name={project.title}
              data-link-type="article"
            >
              {slug === 'lsmsharp' ? 'Related writing' : 'Read walkthrough'}{' '}
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          )}
        </div>
        {presentation && (
          <a
            href="#evidence"
            className="mt-5 flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-6 text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
            data-project-name={project.title}
            data-link-type="case_study"
          >
            <span>
              <span className="mr-2 font-mono text-[10px] tracking-wide text-zinc-400 uppercase">
                Evidence
              </span>
              {presentation.highlight}
            </span>
            <ArrowDown
              aria-hidden="true"
              className="mt-1 size-3.5 shrink-0 text-zinc-500"
            />
          </a>
        )}
      </div>

      <section aria-labelledby="problem-title">
        <h2 id="problem-title" className="section-heading mb-4">
          The problem
        </h2>
        <p className="text-sm leading-7 text-zinc-400">{project.problem}</p>
      </section>

      <section aria-labelledby="architecture-title">
        <h2 id="architecture-title" className="section-heading mb-5">
          How it fits together
        </h2>
        {presentation && (
          <ProjectVisual
            kind={presentation.visual}
            className="mx-auto mb-6 max-w-md"
          />
        )}
        <ol
          className="grid gap-3 sm:grid-cols-2"
          aria-label="Architecture, in execution order"
        >
          {project.architecture.map((stage, index) => (
            <li
              key={stage.title}
              className="rounded-md border border-white/10 bg-white/[0.02] p-5"
            >
              <p className="font-mono text-[11px] text-zinc-400">
                0{index + 1}
              </p>
              <h3 className="mt-3 text-sm font-medium text-zinc-200">
                {stage.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-zinc-400">
                {stage.description}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs leading-6 text-zinc-400">
          {project.architectureNote}
        </p>
      </section>

      {slug === 'simukernel' && <SchedulerDemo />}

      <section aria-labelledby="decisions-title">
        <h2 id="decisions-title" className="section-heading mb-5">
          Decisions & tradeoffs
        </h2>
        <div className="space-y-6">
          {project.decisions.map((decision) => (
            <div key={decision.title}>
              <h3 className="text-sm font-medium text-zinc-200">
                {decision.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                {decision.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="evidence"
        aria-labelledby="validation-title"
        className="scroll-mt-8"
      >
        <h2 id="validation-title" className="section-heading mb-4">
          Evidence & validation
        </h2>
        <div className="space-y-3 text-sm leading-7 text-zinc-400">
          {project.validation.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul
          aria-label="Repository references"
          className="mt-4 flex flex-wrap gap-x-5 gap-y-1"
        >
          {project.references.map((reference) => (
            <li key={reference.href}>
              <a
                href={reference.href}
                className="text-link"
                target="_blank"
                rel="noopener noreferrer"
                data-project-name={project.title}
                data-link-type="source"
              >
                {reference.title}{' '}
                <ArrowUpRight aria-hidden="true" className="size-3" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {project.experiment && (
        <section aria-labelledby="experiment-title">
          <h2 id="experiment-title" className="section-heading mb-4">
            {project.experiment.title}
          </h2>
          <p className="text-sm leading-7 text-zinc-400">
            {project.experiment.description}
          </p>
          <pre
            tabIndex={0}
            aria-label="Commands to run the experiment"
            className="mt-4 overflow-x-auto rounded-md border border-white/10 bg-zinc-950 p-5 font-mono text-xs leading-6 text-zinc-300"
          >
            <code>{project.experiment.command}</code>
          </pre>
        </section>
      )}

      {posts.length > 0 && (
        <section
          aria-labelledby="project-reading-title"
          className="border-t border-white/10 pt-6"
        >
          <h2 id="project-reading-title" className="section-heading mb-2">
            Related writing
          </h2>
          <ul className="divide-y divide-white/[0.07]">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="list-row flex items-start justify-between gap-4"
                  data-project-name={project.title}
                  data-link-type="article"
                >
                  <div>
                    <p className="text-sm leading-6 text-zinc-200">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-zinc-400">
                      {post.description}
                    </p>
                  </div>
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 size-3.5 shrink-0 text-zinc-500"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  )
}
