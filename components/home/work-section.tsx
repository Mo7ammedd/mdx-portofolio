'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

const Spotlight = dynamic(() => import('@/components/ui/spotlight').then(mod => ({ default: mod.Spotlight })), {
  ssr: false,
})

interface WorkExperience {
  id: string
  title: string
  company: string
  start: string
  end: string
  link: string
  logo?: string
  location?: string
  workType?: 'Remote' | 'Hybrid' | 'Onsite'
}

interface WorkSectionProps {
  jobs: WorkExperience[]
}

export function WorkSection({ jobs }: WorkSectionProps) {
  return (
    <div className="flex flex-col space-y-2">
      {jobs.map((job) => (
        <a
          className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          key={job.id}
        >
          <Spotlight
            className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
            size={64}
          />
          <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
            <div className="relative flex w-full flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {job.logo && (
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-white shadow-md transition-transform duration-200 hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900">
                    <Image
                      src={job.logo}
                      alt={`${job.company} logo`}
                      width={56}
                      height={56}
                      className="h-full w-full rounded-full object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-medium dark:text-zinc-100">
                    {job.title}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {job.company}
                  </p>
                  {(job.location || job.workType) && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                      )}
                      {job.workType && (
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.workType}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                {job.start} - {job.end}
              </p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
