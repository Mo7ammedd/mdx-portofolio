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
    alternateName: ['Mo7ammedd'],
    jobTitle: data.jobTitle,
    description: data.description,
    url: data.url,
    email: data.email,
    image: data.image,
    sameAs: data.sameAs,
    knowsAbout: data.knowsAbout,
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: data.alumniOf,
    },
    workLocation: {
      '@type': 'Place',
      name: data.location,
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

export function generateProfessionalServiceSchema(data: PersonData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${data.name} - Software Engineering Services`,
    description: 'Professional software development services specializing in ASP.NET Core, Node.js, and full-stack development',
    url: data.url,
    telephone: '+20-XXX-XXX-XXXX', // Replace with actual if available
    email: data.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressRegion: 'Egypt',
    },
    serviceType: 'Software Development',
    provider: {
      '@type': 'Person',
      name: data.name,
      jobTitle: data.jobTitle,
      image: data.image,
      sameAs: data.sameAs,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide (Remote)',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Software Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Backend Development',
            description: 'ASP.NET Core, Node.js backend development services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full-Stack Development',
            description: 'Complete web application development with modern frameworks',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cloud Architecture',
            description: 'Azure cloud solutions and microservices architecture',
          },
        },
      ],
    },
    priceRange: '$$', // Adjust as needed
    openingHours: 'Mo-Fr 09:00-17:00',
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mohammed Mostafa Portfolio',
    url: 'https://www.modev.me',
    logo: 'https://www.modev.me/avatar.jpg',
    description: 'Professional portfolio website of Mohammed Mostafa, Software Engineer',
    founder: {
      '@type': 'Person',
      name: 'Mohammed Mostafa',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'mohammedmostafanazih@gmail.com',
      contactType: 'Professional Inquiries',
    },
    sameAs: [
      'https://github.com/Mo7ammedd',
      'https://linkedin.com/in/mohammed-mostafa',
      'https://twitter.com/mohameddtv',
    ],
  }
}

// FAQ Schema for homepage or blog posts
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// HowTo Schema for tutorial blog posts
export function generateHowToSchema(data: {
  name: string
  description: string
  totalTime?: string
  steps: Array<{ name: string; text: string; image?: string }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name,
    description: data.description,
    totalTime: data.totalTime,
    step: data.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  }
}

// Software Application Schema for projects
export function generateSoftwareAppSchema(data: {
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem?: string
  offers?: {
    price: string
    priceCurrency: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: data.name,
    description: data.description,
    url: data.url,
    applicationCategory: data.applicationCategory,
    operatingSystem: data.operatingSystem || 'Cross-platform',
    author: {
      '@type': 'Person',
      name: 'Mohammed Mostafa',
    },
    offers: data.offers
      ? {
          '@type': 'Offer',
          price: data.offers.price,
          priceCurrency: data.offers.priceCurrency,
        }
      : {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
  }
}

// ItemList Schema for projects/blog list
export function generateItemListSchema(items: Array<{ name: string; url: string; description: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  }
}

