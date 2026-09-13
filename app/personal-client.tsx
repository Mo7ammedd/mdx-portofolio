import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'

import { ProjectCard } from '@/components/project-card'
import type { PROJECTS, SOCIAL_LINKS, WORK_EXPERIENCE } from './data'

function SocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-link"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3" />
    </a>
  )
}

interface PersonalClientProps {
  blogPosts: Array<{
    title: string
    description: string
    link: string
    uid: string
    publishedTime: string
    readingTime: number
  }>
  projects: typeof PROJECTS
  workExperience: typeof WORK_EXPERIENCE
  socialLinks: typeof SOCIAL_LINKS
  email: string
}

export function PersonalClient({
  blogPosts,
  projects,
  workExperience,
  socialLinks,
  email,
}: PersonalClientProps) {
  const selectedProjects = projects.filter((project) => project.featured)

  return (
    <main className="space-y-12 sm:space-y-14">
      <section aria-labelledby="intro-heading">
        <p className="section-heading">Software engineer · Egypt</p>
        <h1
          id="intro-heading"
          className="mt-4 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
        >
          Mohammed Mostafa<span className="text-zinc-500">.</span>
        </h1>
        <div className="mt-5 max-w-xl space-y-3 text-sm leading-7 text-zinc-400 sm:text-[15px]">
          <p>
            I build backend systems, databases, and cloud infrastructure with a
            focus on performance and reliability.
          </p>
          <p>
            Currently building at{' '}
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
            . CS graduate from Suez Canal University.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href={`mailto:${email}`}
            className="text-link font-medium text-zinc-200"
          >
            Get in touch
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            Résumé
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </div>
      </section>

      <section id="work" aria-labelledby="work-heading" className="scroll-mt-8">
        <div className="flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-3">
          <h2 id="work-heading" className="section-heading">
            Experience
          </h2>
          <span className="font-mono text-[11px] text-zinc-400">
            2024 — Now
          </span>
        </div>
        <ul className="divide-y divide-white/[0.07]">
          {workExperience.map((job) => (
            <li key={job.id}>
              <div className="list-row group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-x-3">
                <div className="relative mt-0.5 size-8 overflow-hidden rounded-md border border-white/10 bg-zinc-950">
                  <Image
                    src={job.logo}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <h3 className="text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">
                      <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-6 items-center gap-1 rounded-sm"
                      >
                        {job.company}
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-3 text-zinc-500"
                        />
                      </a>
                    </h3>
                    <p className="text-xs text-zinc-400">{job.title}</p>
                  </div>
                  <p className="mt-1 font-mono text-[11px] leading-5 text-zinc-300">
                    {job.start} <span aria-hidden="true">—</span> {job.end}
                  </p>
                  {job.description && (
                    <p className="mt-1.5 text-xs leading-5 text-zinc-400">
                      {job.description}
                    </p>
                  )}
                  {job.highlights && job.highlights.length > 0 && (
                    <details className="group/work mt-1">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-sm text-[11px] text-zinc-400 transition-colors hover:text-zinc-200 [&::-webkit-details-marker]:hidden">
                        <span>
                          Selected work
                          <span className="sr-only"> at {job.company}</span>
                        </span>
                        <ChevronDown
                          aria-hidden="true"
                          className="size-3 transition-transform group-open/work:rotate-180 motion-reduce:transition-none"
                        />
                      </summary>
                      <ul className="space-y-3 border-l border-white/10 pb-1 pl-3">
                        {job.highlights.map((highlight) => (
                          <li key={highlight.title}>
                            <h4 className="text-xs font-medium text-zinc-300">
                              {highlight.title}
                            </h4>
                            <p className="mt-1 text-xs leading-6 text-zinc-400">
                              {highlight.description}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="scroll-mt-8"
      >
        <div className="flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-3">
          <h2 id="projects-heading" className="section-heading">
            Selected projects
          </h2>
          <Link href="/projects" className="text-link -my-2">
            View all projects
            <span
              aria-hidden="true"
              className="font-mono text-[10px] text-zinc-400"
            >
              {String(projects.length).padStart(2, '0')}
            </span>
            <ArrowRight aria-hidden="true" className="size-3" />
          </Link>
        </div>
        <ul className="divide-y divide-white/[0.07]">
          {selectedProjects.map((project, index) => (
            <li key={project.slug}>
              <ProjectCard project={project} featured={index === 0} compact />
            </li>
          ))}
        </ul>
      </section>

      {blogPosts.length > 0 && (
        <section aria-labelledby="writing-heading">
          <div className="flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-3">
            <h2 id="writing-heading" className="section-heading">
              Writing
            </h2>
            <Link href="/blog" className="text-link -my-2">
              View all
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </Link>
          </div>
          <ul className="divide-y divide-white/[0.07]">
            {blogPosts.slice(0, 3).map((post) => (
              <li key={post.uid}>
                <Link
                  className="list-row group flex items-start justify-between gap-4"
                  href={post.link}
                >
                  <div className="min-w-0">
                    <h3 className="text-sm leading-6 text-zinc-200 transition-colors group-hover:text-white">
                      {post.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] leading-5 text-zinc-400">
                      <time dateTime={post.publishedTime}>
                        {new Date(post.publishedTime).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'UTC',
                          },
                        )}
                      </time>
                      <span aria-hidden="true" className="text-zinc-600">
                        ·
                      </span>
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1 size-3.5 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-300"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="connect-heading">
        <h2 id="connect-heading" className="section-heading mb-4">
          Connect
        </h2>
        <p className="text-sm leading-7 text-zinc-400">
          Have something in mind? Reach out at{' '}
          <a className="inline-link break-words" href={`mailto:${email}`}>
            {email}
          </a>
          .
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
          {socialLinks.map((link) => (
            <SocialLink key={link.label} link={link.link}>
              {link.label}
            </SocialLink>
          ))}
        </div>
      </section>
    </main>
  )
}
