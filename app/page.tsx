import {
  EMAIL,
  PROJECTS,
  SOCIAL_LINKS,
  WORK_EXPERIENCE,
} from './data'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { PersonalClient } from './personal-client'

export default async function Personal() {
  // Auto-discover blog posts from filesystem
  const blogPosts = await getAllBlogPosts()
  
  return (
    <PersonalClient 
      blogPosts={blogPosts.map(post => ({
        title: post.title,
        description: post.description,
        link: `/blog/${post.slug}`,
        uid: post.slug,
        publishedTime: post.publishedTime,
        readingTime: post.readingTime,
      }))}
      projects={PROJECTS}
      workExperience={WORK_EXPERIENCE}
      socialLinks={SOCIAL_LINKS}
      email={EMAIL}
    />
  )
}
