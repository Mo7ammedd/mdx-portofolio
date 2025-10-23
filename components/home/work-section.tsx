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
