import { getAllBlogPosts } from '@/lib/blog-utils'
import { BlogList } from '@/components/ui/blog-list'

export const metadata = {
  title: 'Blog — Mohammed Mostafa',
  description: 'Articles on backend engineering, .NET, Node.js, system design, and more.',
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  return <BlogList posts={posts} />
}
