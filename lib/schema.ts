interface PersonData {
  name: string
  jobTitle: string
  description: string
  url: string
  email: string
  image: string
  sameAs: string[]
  knowsAbout: string[]
  alumniOf: string
  location: string
}

interface BlogPostData {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified: string
  author: PersonData
  image?: string
}

export function generatePersonSchema(data: PersonData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    description: data.description,
    url: data.url,
    email: data.email,
    image: data.image,
    sameAs: data.sameAs,
    knowsAbout: data.knowsAbout,
    alumniOf: {
      '@type': 'Organization',
      name: data.alumniOf,
    },
    workLocation: {
      '@type': 'Place',
      name: data.location,
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: data.jobTitle,
      occupationLocation: {
        '@type': 'Place',
        name: data.location,
      },
    },
  }
}

export function generateWebsiteSchema(url: string, name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    description,
    author: {
      '@type': 'Person',
      name: 'Mohammed Mostafa',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBlogPostSchema(data: BlogPostData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    url: data.url,
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': 'Person',
      name: data.author.name,
      jobTitle: data.author.jobTitle,
      url: data.author.url,
      image: data.author.image,
    },
    publisher: {
      '@type': 'Person',
      name: data.author.name,
      logo: {
        '@type': 'ImageObject',
        url: data.author.image,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    image: data.image,
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
