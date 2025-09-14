import { MetadataRoute } from 'next'

const WEBSITE_URL = 'https://www.mohammedd.tech'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/blog'].map((route) => ({
    url: `${WEBSITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? ('monthly' as const) : ('weekly' as const),
    priority: route === '' ? 1 : 0.8,
  }))

  // Add blog posts
  const blogPosts = [
    {
      slug: '3-ways-to-build-custom-middleware-in-aspnet-core',
      lastModified: '2024-12-01',
    },
    {
      slug: 'boxing-and-unboxing-in-csharp',
      lastModified: '2024-11-15',
    },
    {
      slug: 'difference-between-cluster-and-non-cluster-index',
      lastModified: '2024-11-01',
    },
  ]

  const blogRoutes = blogPosts.map((post) => ({
    url: `${WEBSITE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes]
}
