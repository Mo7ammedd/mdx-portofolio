export const PROJECT_LINKS = [
  {
    title: 'LSMSharp',
    slug: 'lsmsharp',
    articles: [
      'difference-between-cluster-and-non-cluster-index',
      'pagination-strategies-offset-vs-cursor',
    ],
  },
  {
    title: 'AeroUDP',
    slug: 'aeroudp',
    articles: ['aeroudp-networking-concepts'],
  },
  {
    title: 'SimuKernel',
    slug: 'simukernel',
    articles: ['simukernel-operating-system-concepts'],
  },
] as const

export function getProjectsForArticle(slug: string) {
  return PROJECT_LINKS.filter((project) =>
    project.articles.some((article) => article === slug),
  )
}
