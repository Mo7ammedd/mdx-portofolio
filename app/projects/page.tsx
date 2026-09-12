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
      <p className="section-heading">Selected work</p>
      <h1
        id="projects-title"
        className="mt-4 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
      >
        Projects
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-[15px]">
        A closer look at the systems I build: the problems, the design
        decisions, and what happens when those decisions meet real workloads.
      </p>
      <ul className="mt-8 divide-y divide-white/[0.07] border-t border-white/10">
        {PROJECTS.map((project) => (
          <li key={project.href}>
            <ProjectCard
              title={project.title}
              description={project.description}
              tags={project.technologies}
              href={project.href}
              links={project.links}
              caseStudyHref={project.caseStudyHref}
              articleHref={project.articleHref}
              demoHref={project.demoHref}
            />
          </li>
        ))}
      </ul>
    </main>
  )
}
