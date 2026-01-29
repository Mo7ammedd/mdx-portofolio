import { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { getAllBlogPosts } from '@/lib/blog-utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString()
  
  // Main pages with their priorities and update frequencies
  const mainRoutes = [
    {
      url: `${WEBSITE_URL}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${WEBSITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Auto-discover blog posts from filesystem
  const blogPosts = await getAllBlogPosts()

  const blogRoutes = blogPosts.map((post) => ({
    url: `${WEBSITE_URL}/blog/${post.slug}`,
    lastModified: post.modifiedTime || post.publishedTime,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Add other important routes if they exist
  const additionalRoutes: MetadataRoute.Sitemap = [
    // Uncomment when these pages are created
    // {
    //   url: `${WEBSITE_URL}/projects`,
    //   lastModified: currentDate,
    //   changeFrequency: 'monthly' as const,
    //   priority: 0.6,
    // },
    // {
    //   url: `${WEBSITE_URL}/contact`,
    //   lastModified: currentDate,
    //   changeFrequency: 'yearly' as const,
    //   priority: 0.5,
    // },
  ]

  return [...mainRoutes, ...blogRoutes, ...additionalRoutes]
}
