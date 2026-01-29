'use server'

import { getAllBlogPosts } from '@/lib/blog-utils'

export async function getBlogPosts() {
  return await getAllBlogPosts()
}
