import { notFound } from 'next/navigation'

import { getAllBlogPosts } from '@/lib/blog-utils'
import { generateBlogOGImage } from '@/lib/og-generator'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map(({ slug }) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const posts = await getAllBlogPosts()
  const post = posts.find((post) => post.slug === slug)

  if (!post) notFound()

  return generateBlogOGImage(post)
}
