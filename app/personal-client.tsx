import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

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
      className="inline-flex min-h-9 items-center gap-1 text-xs text-zinc-400 no-underline transition-colors hover:text-zinc-100"
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
  return (
    <main className="space-y-14 sm:space-y-16">
      <section aria-labelledby="intro-heading">
        <h1 id="intro-heading" className="sr-only">
          Mohammed Mostafa — Software Engineer
        </h1>
        <div className="space-y-3 text-sm leading-7 text-zinc-400">
          <p>
            I’m Mohammed, a software engineer and CS graduate from Suez Canal
            University. Currently building software at{' '}
            <a
              href="https://medicascopehms.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-400"
            >
              Medica Scope
            </a>
            .
          </p>
          <p>
            I focus on backend engineering, distributed systems, databases, and
            cloud infrastructure, with an eye for performance and reliability.
          </p>
        </div>
      </section>

      <section id="work" aria-labelledby="work-heading" className="scroll-mt-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 id="work-heading" className="text-sm font-medium text-zinc-100">
            Work
          </h2>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 items-center gap-1 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Résumé
            <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
        </div>
        <ul className="divide-y divide-white/[0.07]">
          {workExperience.map((job) => (
            <li key={job.id}>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-2 grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-x-3 rounded-lg px-2 py-3.5 no-underline transition-colors hover:bg-white/[0.03] sm:grid-cols-[2.5rem_minmax(0,1fr)_auto]"
              >
                <div className="relative size-10 overflow-hidden rounded-lg border border-white/10 bg-zinc-950">
                  <Image
                    src={job.logo}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover grayscale transition-[filter] group-hover:grayscale-0 motion-reduce:transition-none"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="flex items-center gap-1.5 text-sm font-medium text-zinc-200 transition-colors group-hover:text-white">
                    {job.company}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3 shrink-0 text-zinc-500 transition-colors group-hover:text-zinc-300"
                    />
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-400">{job.title}</p>
                </div>
                <p className="col-start-2 mt-1 font-mono text-[11px] leading-5 text-zinc-400 sm:col-start-auto sm:mt-0 sm:text-right">
                  {job.start} <span className="text-zinc-600">—</span> {job.end}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="scroll-mt-8"
      >
        <h2
          id="projects-heading"
          className="mb-5 text-sm font-medium text-zinc-100"
        >
          Small projects
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.href}
              title={project.title}
              description={project.description}
              tags={project.technologies}
              links={project.links}
              href={project.href}
            />
          ))}
        </div>
      </section>

      {blogPosts.length > 0 && (
        <section aria-labelledby="writing-heading">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2
              id="writing-heading"
              className="text-sm font-medium text-zinc-100"
            >
              Writing
            </h2>
            <Link
              href="/blog"
              className="inline-flex min-h-8 items-center gap-1 text-xs text-zinc-400 no-underline transition-colors hover:text-zinc-100"
            >
              View all
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </Link>
          </div>
          <ul className="divide-y divide-white/[0.07]">
            {blogPosts.slice(0, 3).map((post) => (
              <li key={post.uid}>
                <Link
                  className="group -mx-2 flex items-start justify-between gap-4 rounded-lg px-2 py-4 no-underline transition-colors hover:bg-white/[0.03]"
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
        <h2
          id="connect-heading"
          className="mb-4 text-sm font-medium text-zinc-100"
        >
          Connect
        </h2>
        <p className="text-sm leading-7 text-zinc-400">
          Feel free to reach out at{' '}
          <a
            className="break-words text-zinc-200 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-400"
            href={`mailto:${email}`}
          >
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
