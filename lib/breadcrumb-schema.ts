import { WEBSITE_URL } from './constants'

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${WEBSITE_URL}${item.url}`,
    })),
  }
}

export function generateArticleSchema({
  title,
  description,
  publishedTime,
  modifiedTime,
  slug,
  tags,
}: {
  title: string
  description: string
  publishedTime: string
  modifiedTime?: string
  slug: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: `${WEBSITE_URL}/og/${slug}.png`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: 'Mohammed Mostafa',
      url: WEBSITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mohammed Mostafa',
      logo: {
        '@type': 'ImageObject',
        url: `${WEBSITE_URL}/avatar.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${WEBSITE_URL}/blog/${slug}`,
    },
    keywords: tags?.join(', '),
  }
}

export function generateProjectSchema(project: {
  title: string
  description: string
  technologies: string[]
  url?: string
  githubUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    programmingLanguage: project.technologies,
    codeRepository: project.githubUrl,
    url: project.url,
    author: {
      '@type': 'Person',
      name: 'Mohammed Mostafa',
      url: WEBSITE_URL,
    },
  }
}
