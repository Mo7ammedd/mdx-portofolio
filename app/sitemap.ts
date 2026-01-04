import type { MetadataRoute } from 'next'
import { WEBSITE_URL } from '@/lib/constants'
import { BLOG_POST_METADATA, getAllBlogSlugs } from '@/lib/blog-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  
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

  const additionalRoutes: MetadataRoute.Sitemap = [
 
  ]

  return [...mainRoutes, ...blogRoutes, ...additionalRoutes]
}
