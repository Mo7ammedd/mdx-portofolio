import { PROJECTS } from '@/app/data'
import { ProjectCard } from '@/components/project-card'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'Projects',
  description:
    'Storage engines, transport protocols, and backend services by Mohammed Mostafa, with architecture notes, tradeoffs, and interactive demos.',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <main aria-labelledby="projects-title">
      <p className="section-heading">
        Selected work · {String(PROJECTS.length).padStart(2, '0')} projects
      </p>
      <h1 id="projects-title" className="page-title mt-4">
        Projects
      </h1>
      <p className="page-description mt-5">
        Storage engines, transport protocols, and backend services. Each project
        has architecture notes and source links. You can also try the scheduling
        and replica recovery demos.
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
