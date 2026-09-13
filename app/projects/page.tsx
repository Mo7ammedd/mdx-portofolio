import { PROJECTS } from '@/app/data'
import { ProjectCard } from '@/components/project-card'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'Projects',
  description:
    'Storage engines, transport protocols, and backend services by Mohammed Mostafa. Explore the architecture, tradeoffs, and interactive demos.',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <main aria-labelledby="projects-title">
      <p className="section-heading">
        Selected work · {String(PROJECTS.length).padStart(2, '0')} projects
      </p>
      <h1
        id="projects-title"
        className="mt-4 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
      >
        Projects
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-[15px]">
        Storage engines, transport protocols, and backend services. Explore the
        architecture, inspect the evidence, or try the scheduling and replica
        recovery demos.
      </p>
      <ul className="mt-8">
        {PROJECTS.map((project, index) => (
          <li key={project.slug}>
            <ProjectCard
              project={project}
              featured={index === 0}
              headingLevel={2}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
