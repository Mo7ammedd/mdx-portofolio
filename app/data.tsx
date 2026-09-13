import type { ProjectVisualKind } from '@/components/project-visual'

type WorkExperience = {
  company: string
  title: string
  description?: string
  start: string
  end: string
  link: string
  id: string
  logo: string
}

type BlogPost = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export type PortfolioProject = {
  slug: string
  title: string
  category: string
  description: string
  technologies: readonly string[]
  href: string
  caseStudyHref: string
  articleHref?: string
  demoHref?: string
  visual: ProjectVisualKind
  featured: boolean
  highlight: string
}

export const PROJECTS: PortfolioProject[] = [
  {
    slug: 'simukernel',
    title: 'SimuKernel',
    category: 'Operating systems',
    href: 'https://github.com/Mo7ammedd/SimuKernel',
    caseStudyHref: '/projects/simukernel',
    articleHref: '/blog/simukernel-operating-system-concepts',
    demoHref: '/projects/simukernel#scheduler',
    visual: 'scheduler',
    featured: true,
    description:
      'Explore CPU scheduling and memory management in C#, then compare scheduling policies in the companion browser playground.',
    technologies: ['C#', '.NET 8', 'TypeScript'],
    highlight:
      'Three browser scheduling policies, checked against known and generated workloads.',
  },
  {
    slug: 'lsmsharp',
    title: 'LSMSharp',
    category: 'Storage engine',
    href: 'https://github.com/Mo7ammedd/LSMSharp',
    caseStudyHref: '/projects/lsmsharp',
    visual: 'storage',
    featured: true,
    description:
      'An LSM-tree storage engine in C# with write-ahead logging, Bloom filters, and background compaction.',
    technologies: ['C#', '.NET 8', 'LSM-tree'],
    highlight:
      'Functional checks cover updates, deletes, binary values, and concurrent access.',
  },
  {
    slug: 'disk-mesh',
    title: 'Disk-Mesh',
    category: 'Distributed systems',
    href: 'https://github.com/Mo7ammedd/Disk-Mesh',
    caseStudyHref: '/projects/disk-mesh',
    demoHref: '/projects/disk-mesh#replication',
    visual: 'replication',
    featured: false,
    description:
      'A Java distributed file system with checksummed chunks, chained replication, and heartbeat-driven replica repair.',
    technologies: ['Java 22+', 'TCP', 'Replication'],
    highlight:
      'Includes a four-node recovery scenario that checks restoration to three replicas.',
  },
  {
    slug: 'hungerstation-microservices',
    title: 'HungerStation Microservices',
    category: 'Backend services',
    href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
    caseStudyHref: '/projects/hungerstation-microservices',
    visual: 'services',
    featured: false,
    description:
      'Seven .NET 8 services for food ordering, connecting authentication, Stripe checkout, and Azure Service Bus messaging.',
    technologies: ['.NET 8', 'Azure Service Bus', 'Stripe'],
    highlight:
      'Stripe payment approval publishes a rewards message through Azure Service Bus.',
  },
  {
    slug: 'aeroudp',
    title: 'AeroUDP',
    category: 'Networking',
    href: 'https://github.com/Mo7ammedd/AeroUDP',
    caseStudyHref: '/projects/aeroudp',
    articleHref: '/blog/aeroudp-networking-concepts',
    visual: 'transport',
    featured: true,
    description:
      'Experimental reliable transport over UDP in async Rust, with ordered delivery and congestion control.',
    technologies: ['Rust', 'Tokio', 'UDP'],
    highlight:
      'Buffer and codec tests cover reordering, duplicates, and corruption.',
  },
]
export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Oblien',
    title: 'Founding Engineer',
    description:
      'Building Firecracker agent sandboxes and Openship deployments.',
    start: 'Aug 2025',
    end: 'Present',
    link: 'https://oblien.com/',
    id: 'work0',
    logo: '/work/oblien.jpg',
  },
  {
    company: 'Medica Scope',
    title: 'Backend Engineer',
    description:
      'CarLink APIs, AWS vehicle telemetry, and a multi-tenant medical LMS.',
    start: 'Jul 2025',
    end: 'Present',
    link: 'https://medicascopehms.com/',
    id: 'work1',
    logo: '/work/medica.png',
  },
  {
    company: 'ONVO',
    title: 'Software Engineer',
    description:
      'Scaled a Q&A platform to 150k+ users and cut load times by 20%.',
    start: 'May 2024',
    end: 'Jul 2025',
    link: 'https://onvo.me/',
    id: 'work2',
    logo: '/work/onvo.png',
  },
  {
    company: 'GDG Suez Canal',
    title: 'IT Mentor',
    description: 'Mentored students in backend development fundamentals.',
    start: 'Oct 2024',
    end: 'May 2025',
    link: 'https://www.facebook.com/share/19tEMtQDZb/?mibextid=wwXIfr',
    id: 'work3',
    logo: '/work/gdg.png',
  },
  {
    company: 'Manara',
    title: 'Backend Engineer',
    start: 'Mar 2024',
    end: 'Jul 2024',
    link: 'https://app.manara.tech/auth/',
    id: 'work4',
    logo: '/work/manara.png',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Difference Between Cluster and Non-Cluster Index',
    description:
      'An index is a disk-based structure linked to a table or view that speeds up the retrieval of rows.',
    link: '/blog/difference-between-cluster-and-non-cluster-index',
    uid: 'blog-1',
  },
  {
    title: '3 Ways to Build Custom Middleware in ASP.NET Core',
    description:
      'Middleware is software that is assembled into an app pipeline to handle requests and responses.',
    link: '/blog/3-ways-to-build-custom-middleware-in-aspnet-core',
    uid: 'blog-2',
  },
  {
    title: 'Boxing and Unboxing in C#',
    description:
      'Boxing is the process of converting a value type to the type object or to any interface type implemented by this value type.',
    link: '/blog/boxing-and-unboxing-in-csharp',
    uid: 'blog-3',
  },
  {
    title: 'SimuKernel: OS Concepts Explained',
    description:
      'SimuKernel is a kernel simulator that allows you to explore the internals of an operating system.',
    link: '/blog/simukernel-operating-system-concepts',
    uid: 'blog-4',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/mo7ammedd',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/mohameddtv',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/mohammed-mostafa-316b21254/',
  },
  {
    label: 'CV',
    link: '/resume.pdf',
  },
]

export const EMAIL = 'MohammedMostafaNazih@gmail.com'
