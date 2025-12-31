import {
  BLOG_POSTS,
  EMAIL,
  PROJECTS,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
} from './data'
import { getGitHubRepoStats, extractGitHubInfo } from '@/lib/github'
import { getReadingTimeForPost } from '@/lib/reading-time'
import { PersonalClient } from '@/components/home/personal-client'

// Enable ISR - revalidate every 3600 seconds (1 hour)
export const revalidate = 3600

// Static metadata generation
export async function generateMetadata() {
  return {
    title: 'Mohammed Mostafa - Software Engineer',
    description: 'Experienced Software Engineer specializing in ASP.NET Core, Node.js, and TypeScript',
  }
}

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

  const blogPostsWithReadingTime = await Promise.all(
    BLOG_POSTS.map(async (post) => {
      const slug = post.link.replace('/blog/', '')
      const readingTime = await getReadingTimeForPost(slug)
      return { ...post, readingTime: readingTime.text }
    })
  )

  return (
    <PersonalClient
      projectsWithStats={projectsWithStats}
      blogPostsWithReadingTime={blogPostsWithReadingTime}
      workExperience={WORK_EXPERIENCE}
      email={EMAIL}
      socialLinks={SOCIAL_LINKS}
    />
  )
}
