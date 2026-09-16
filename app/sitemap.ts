import { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { PROJECT_CASE_STUDIES } from '@/lib/project-case-studies'

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
    {
      url: `${WEBSITE_URL}/blog/paths`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
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

  const projectRoutes: MetadataRoute.Sitemap = [
    '/projects',
    ...PROJECT_CASE_STUDIES.map((project) => `/projects/${project.slug}`),
  ].map((route) => ({
    url: `${WEBSITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...mainRoutes, ...blogRoutes, ...projectRoutes]
}
