import { getAllBlogPosts } from '@/lib/blog-utils'
import { BlogLayoutClient } from './blog-layout-client'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const posts = await getAllBlogPosts()

  return <BlogLayoutClient posts={posts}>{children}</BlogLayoutClient>
}
