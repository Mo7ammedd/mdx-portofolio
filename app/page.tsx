import { PROJECTS } from './data'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { PersonalClient } from './personal-client'

export default async function Personal() {
  const blogPosts = await getAllBlogPosts()

  return <PersonalClient blogPosts={blogPosts} projects={PROJECTS} />
}
