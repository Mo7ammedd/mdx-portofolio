import Link from 'next/link'

import { WORK_EXPERIENCE } from '@/app/data'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'About',
  description:
    'Mohammed Mostafa, software engineer in Egypt. Building backend systems, agent runtimes, and deployment tools at Oblien.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <main className="space-y-10 sm:space-y-12" aria-labelledby="about-title">
      <section>
        <h1
          id="about-title"
          className="text-[28px] leading-9 font-medium tracking-tight text-zinc-100"
        >
          About
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-300">
          I’m Mohammed, a software engineer based in Egypt. I build backend
          systems and infrastructure at{' '}
          <a href="#work0" className="inline-link">
            Oblien
          </a>
          .
        </p>
        <p className="mt-3 text-base leading-7 text-zinc-400">
          I work on agent runtimes, isolated workspaces, and deployment tools.
          That includes connecting agent sessions to product interfaces and
          building the tools that take a Git repository through builds,
          deployments, custom domains, and rollbacks.
        </p>
      </section>

      <section id="work" aria-labelledby="work-heading" className="scroll-mt-8">
        <h2 id="work-heading" className="text-base font-medium text-zinc-100">
          Experience
        </h2>
        <ol className="mt-6 space-y-10">
          {WORK_EXPERIENCE.map((job) => (
            <li key={job.id} id={job.id} className="scroll-mt-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-base font-medium">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-link"
                  >
                    {job.company}
                  </a>
                </h3>
                <p className="text-sm leading-6 whitespace-nowrap text-zinc-400 tabular-nums">
                  {job.start} — {job.end}
                </p>
              </div>
              <p className="mt-1 text-base leading-7 text-zinc-300">
                {job.title}
              </p>
              {job.description && (
                <p className="mt-2 text-base leading-7 text-zinc-400">
                  {job.description}
                </p>
              )}
              {job.highlights && job.highlights.length > 0 && (
                <dl className="mt-4 space-y-4">
                  {job.highlights.map((highlight) => (
                    <div key={highlight.title}>
                      <dt className="text-sm font-medium text-zinc-300">
                        {highlight.href ? (
                          <a
                            href={highlight.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-link"
                          >
                            {highlight.title}
                          </a>
                        ) : (
                          highlight.title
                        )}
                      </dt>
                      <dd className="mt-1 text-base leading-7 text-zinc-400">
                        {highlight.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="systems-heading">
        <h2
          id="systems-heading"
          className="text-base font-medium text-zinc-100"
        >
          Systems projects
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-400">
          I also build smaller systems from scratch.{' '}
          <Link href="/projects/lsmsharp" className="inline-link">
            LSMSharp
          </Link>{' '}
          is a C# storage engine with a write-ahead log and background
          compaction.{' '}
          <Link href="/projects/aeroudp" className="inline-link">
            AeroUDP
          </Link>{' '}
          is an experimental Rust transport that adds packet ordering and
          retransmission to UDP.{' '}
          <Link href="/projects/disk-mesh" className="inline-link">
            Disk-Mesh
          </Link>{' '}
          is a Java file system that replicates chunks across storage nodes and
          repairs missing copies after a node failure.
        </p>
      </section>

      <section aria-labelledby="education-heading">
        <h2
          id="education-heading"
          className="text-base font-medium text-zinc-100"
        >
          Education
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-300">
          B.Sc. in Computer Science, Suez Canal University, 2021–2025.
        </p>
        <p className="mt-2 text-base leading-7 text-zinc-400">
          My graduation project,{' '}
          <a
            href="https://github.com/Mo7ammedd/Aura-Decor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Aura Decor
          </a>
          , combined an ASP.NET Core furniture platform with text and image
          search, Stripe payments, and an AR mobile app. It received an
          Excellent grade.
        </p>
      </section>
    </main>
  )
}
