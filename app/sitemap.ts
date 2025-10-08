import { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { BLOG_POST_METADATA, getAllBlogSlugs } from '@/lib/blog-metadata'

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

  // Blog posts - dynamically generated from metadata
  const blogSlugs = getAllBlogSlugs()
  const blogRoutes = blogSlugs.map((slug) => {
    const metadata = BLOG_POST_METADATA[slug]
    return {
      url: `${WEBSITE_URL}/blog/${slug}`,
      lastModified: metadata.dateModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

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
