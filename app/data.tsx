// Type definitions
export type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
  logo?: string
  location?: string
  workType?: 'Remote' | 'Hybrid' | 'Onsite'
}

export type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

export type SocialLink = {
  label: string
  link: string
}

export type ProjectLink = {
  type: string
  href: string
  icon: string
}

export type Project = {
  title: string
  href: string
  active: boolean
  description: string
  technologies: string[]
  links: ProjectLink[]
  image?: string
  video?: string
}

// Import JSON data
import projectsData from '@/data/projects.json'
import workExperienceData from '@/data/work-experience.json'
import blogPostsData from '@/data/blog-posts.json'
import socialLinksData from '@/data/social-links.json'
import configData from '@/data/config.json'

// Export typed data
export const PROJECTS = projectsData as Project[]
export const WORK_EXPERIENCE = workExperienceData as WorkExperience[]
export const BLOG_POSTS = blogPostsData as BlogPost[]
export const SOCIAL_LINKS = socialLinksData as SocialLink[]
export const EMAIL = configData.email
