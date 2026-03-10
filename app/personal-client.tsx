'use client'

import { motion } from 'motion/react'
import { Magnetic } from '@/components/ui/magnetic'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { ProjectCard } from '@/components/project-card'
import { ArrowUpRight } from 'lucide-react'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = { duration: 0.3 }

function MagneticSocialLink({ children, link }: { children: React.ReactNode; link: string }) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 no-underline transition-colors duration-200 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
      >
        {children}
        <ArrowUpRight className="h-3 w-3" />
      </a>
    </Magnetic>
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
  projects: any[]
  workExperience: any[]
  socialLinks: any[]
  email: string
}

export function PersonalClient({ blogPosts, projects, workExperience, socialLinks, email }: PersonalClientProps) {
  return (
    <motion.main className="space-y-24" variants={VARIANTS_CONTAINER} initial="hidden" animate="visible">
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <p className="text-zinc-600 dark:text-zinc-400">
          I am Mohammed Mostafa, a Software Engineer and recent Computer Science graduate from Suez Canal University. As a dedicated software engineer, I have a deep passion for building systems that are strong, efficient, and easy to use. I focus on backend development, where I design and develop reliable solutions that help applications run smoothly. I love solving problems and turning ideas into real, working systems.
        </p>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              tags={project.technologies}
              links={project.links}
            />
          ))}
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Work Experience</h3>
        <div className="flex flex-col gap-2">
          {workExperience.map((job) => (
            <a
              key={job.id}
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-card group flex items-center gap-4 rounded-2xl p-4 no-underline transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                <Image src={job.logo} alt={`${job.company} logo`} fill className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{job.title}</p>
                <p className="mt-0.5 text-sm text-zinc-500">{job.company}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-mono text-xs text-zinc-500">{job.start}</p>
                <p className="font-mono text-xs text-zinc-400 dark:text-zinc-600">{job.end}</p>
              </div>
            </a>
          ))}
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-3 text-lg font-medium">Blog</h3>
        <div className="flex flex-col">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          >
            {blogPosts.map((post) => (
              <Link
                key={post.uid}
                className="-mx-3 rounded-xl px-3 py-3 no-underline"
                href={post.link}
                data-id={post.uid}
                prefetch
              >
                <div className="flex flex-col space-y-1">
                  <h4 className="font-normal text-zinc-900 dark:text-zinc-100">{post.title}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{post.description}</p>
                  <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-600">
                    <time dateTime={post.publishedTime}>
                      {new Date(post.publishedTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a
            className="font-medium text-zinc-900 no-underline transition-colors hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-400"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {socialLinks.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
