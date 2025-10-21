import {
  BLOG_POSTS,
  EMAIL,
  PROJECTS,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
} from './data'
import { ProjectCard } from '@/components/project-card'
import { AnimatedContainer, StaticSection, AnimatedSection } from '@/components/home/animated-section'
import { WorkSection } from '@/components/home/work-section'
import { BlogSection } from '@/components/home/blog-section'
import { ConnectSection } from '@/components/home/connect-section'
import { SpotifySection } from '@/components/home/spotify-section'
import { getGitHubRepoStats, extractGitHubInfo } from '@/lib/github'

export default async function Personal() {
  const projectsWithStats = await Promise.all(
    PROJECTS.map(async (project) => {
      const githubLink = project.links?.find((link) => link.href.includes('github.com'))
      
      if (!githubLink) {
        return { ...project, githubStats: null }
      }

      const repoInfo = extractGitHubInfo(githubLink.href)
      
      if (!repoInfo) {
        return { ...project, githubStats: null }
      }

      const stats = await getGitHubRepoStats(repoInfo.owner, repoInfo.repo)
      
      return { ...project, githubStats: stats }
    })
  )

  return (
    <AnimatedContainer className="space-y-24">
      <section className="opacity-100">
        <div className="flex-1">
          <h1 className="sr-only">Mohammed Mostafa - Mohammed Software Engineer Portfolio</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            I am Mohammed Mostafa, a Software Engineer and recent Computer Science graduate from Suez Canal University. As a dedicated software engineer, I have a deep passion for building systems that are strong, efficient, and easy to use. I focus on backend development, where I design and develop reliable solutions that help applications run smoothly. I love solving problems and turning ideas into real, working systems.
          </p>
        </div>
      </section>

      <StaticSection>
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
          {projectsWithStats.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              tags={project.technologies}
              links={project.links}
              githubStats={project.githubStats}
            />
          ))}
        </div>
      </StaticSection>

      <AnimatedSection>
        <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
        <WorkSection jobs={WORK_EXPERIENCE} />
      </AnimatedSection>

      <AnimatedSection>
        <h3 className="mb-3 text-lg font-medium">Blog</h3>
        <BlogSection posts={BLOG_POSTS} />
      </AnimatedSection>

      <AnimatedSection>
        <SpotifySection />
      </AnimatedSection>

      <AnimatedSection>
        <ConnectSection email={EMAIL} socialLinks={SOCIAL_LINKS} />
      </AnimatedSection>
    </AnimatedContainer>
  )
}
