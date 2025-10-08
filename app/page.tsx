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

export default function Personal() {
  return (
    <AnimatedContainer className="space-y-24">
      {/* Bio section - static, renders immediately for better LCP */}
      <section className="opacity-100">
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-400">
            I am a Software Engineer and a recent Computer Science graduate from Suez Canal University. I have a deep passion for building systems that are strong, efficient, and easy to use. I focus on backend development, where I design and develop reliable solutions that help applications run smoothly. I love solving problems and turning ideas into real, working systems.
          </p>
        </div>
      </section>

      {/* Projects section - static */}
      <StaticSection>
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              tags={project.technologies}
              links={project.links}
            />
          ))}
        </div>
      </StaticSection>

      {/* Work Experience section - lazy loaded */}
      <AnimatedSection>
        <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
        <WorkSection jobs={WORK_EXPERIENCE} />
      </AnimatedSection>

      {/* Blog section - lazy loaded */}
      <AnimatedSection>
        <h3 className="mb-3 text-lg font-medium">Blog</h3>
        <BlogSection posts={BLOG_POSTS} />
      </AnimatedSection>

      {/* Spotify widget - lazy loaded */}
      <AnimatedSection>
        <SpotifySection />
      </AnimatedSection>

      {/* Connect section - lazy loaded */}
      <AnimatedSection>
        <ConnectSection email={EMAIL} socialLinks={SOCIAL_LINKS} />
      </AnimatedSection>
    </AnimatedContainer>
  )
}
