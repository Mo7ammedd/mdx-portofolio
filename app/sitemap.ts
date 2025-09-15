import { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Blog posts with more detailed metadata
  const blogPosts = [
    {
      slug: '3-ways-to-build-custom-middleware-in-aspnet-core',
      lastModified: '2024-12-01T10:00:00.000Z',
      priority: 0.7,
    },
    {
      slug: 'boxing-and-unboxing-in-csharp',
      lastModified: '2024-11-15T10:00:00.000Z',
      priority: 0.7,
    },
    {
      slug: 'difference-between-cluster-and-non-cluster-index',
      lastModified: '2024-11-01T10:00:00.000Z',
      priority: 0.7,
    },
  ]

  const blogRoutes = blogPosts.map((post) => ({
    url: `${WEBSITE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: post.priority,
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
