import { WORK_EXPERIENCE } from '@/app/data'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'About',
  description:
    'Mohammed Mostafa, software engineer in Egypt. Work experience and computer science education at Suez Canal University.',
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
          I’m Mohammed, a software engineer in Egypt. I work on backend systems,
          databases, and cloud infrastructure.
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
                        {highlight.title}
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

      <section aria-labelledby="education-heading">
        <h2
          id="education-heading"
          className="text-base font-medium text-zinc-100"
        >
          Education
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-300">
          CS graduate from Suez Canal University.
        </p>
      </section>
    </main>
  )
}
