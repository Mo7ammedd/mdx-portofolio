import { getAllBlogPosts } from '@/lib/blog-utils'
import { BlogList } from '@/components/ui/blog-list'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'Writing',
  description:
    'Articles on backend engineering, .NET, Node.js, and system design.',
  path: '/blog',
})

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  return <BlogList posts={posts} />
}
