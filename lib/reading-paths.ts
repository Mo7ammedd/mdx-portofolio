export interface ReadingPath {
  slug: string
  title: string
  description: string
  prerequisites: string[]
  steps: { slug: string; outcome: string }[]
}

export const readingPaths: ReadingPath[] = [
  {
    slug: 'database-performance',
    title: 'Database performance',
    description:
      'Understand how indexes serve a query, then design efficient pagination.',
    prerequisites: [
      'Basic SELECT queries',
      'ORDER BY and filtering with WHERE',
    ],
    steps: [
      {
        slug: 'difference-between-cluster-and-non-cluster-index',
        outcome: 'Understand B-tree storage, seeks, and index trade-offs.',
      },
      {
        slug: 'pagination-strategies-offset-vs-cursor',
        outcome:
          'Apply indexes to pagination with a stable, unique sort order.',
      },
    ],
  },
  {
    slug: 'dotnet-backend',
    title: 'C# to ASP.NET Core',
    description:
      'Start with runtime costs, then follow a request through middleware.',
    prerequisites: [
      'C# classes, methods, and collections',
      'Basic HTTP requests and responses',
    ],
    steps: [
      {
        slug: 'boxing-and-unboxing-in-csharp',
        outcome: 'Recognize boxing and choose typed collections.',
      },
      {
        slug: '3-ways-to-build-custom-middleware-in-aspnet-core',
        outcome:
          'Choose a middleware pattern and understand dependency lifetimes.',
      },
    ],
  },
  {
    slug: 'systems-foundations',
    title: 'Systems foundations',
    description:
      'Connect scheduling and memory to transport protocols and reverse proxies.',
    prerequisites: [
      'Basic programming',
      'Familiarity with processes, IP addresses, and HTTP',
    ],
    steps: [
      {
        slug: 'simukernel-operating-system-concepts',
        outcome: 'Build a model of scheduling, processes, and memory.',
      },
      {
        slug: 'aeroudp-networking-concepts',
        outcome: 'Explore reliability, retransmission, and flow control.',
      },
      {
        slug: 'nginx-deep-dive-architecture-configuration-production-patterns',
        outcome:
          'Follow requests through routing, proxying, and production configuration.',
      },
    ],
  },
]

export function getArticleReadingPath(slug: string) {
  const path = readingPaths.find((path) =>
    path.steps.some((step) => step.slug === slug),
  )
  if (!path) return null
  const index = path.steps.findIndex((step) => step.slug === slug)
  return {
    path,
    index,
    previous: path.steps[index - 1],
    next: path.steps[index + 1],
  }
}
