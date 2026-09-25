import type { ProjectVisualKind } from '@/components/project-visual'

type WorkExperience = {
  company: string
  title: string
  description?: string
  highlights?: readonly {
    title: string
    description: string
  }[]
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
  summary?: string
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
    featured: false,
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
    summary: 'An LSM-tree storage engine in C#.',
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
    featured: true,
    summary: 'A distributed file system in Java.',
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
    summary: 'Experimental reliable transport over UDP in Rust.',
    description:
      'Experimental reliable transport over UDP in async Rust, with ordered delivery and congestion control.',
    technologies: ['Rust', 'Tokio', 'UDP'],
    highlight:
      'Buffer and codec tests cover reordering, duplicates, and corruption.',
  },
  {
    slug: 'llmproxy',
    title: 'LLMProxy',
    category: 'AI infrastructure',
    href: 'https://github.com/Mo7ammedd/LLMProxy',
    caseStudyHref: '/projects/llmproxy',
    visual: 'gateway',
    featured: false,
    description:
      'A self-hosted .NET 10 gateway for ten LLM providers, with OpenAI-compatible APIs, key rotation, quotas, usage accounting, and a web admin console.',
    technologies: ['C#', '.NET 10', 'PostgreSQL', 'Redis'],
    highlight:
      'Tests exercise key failover, stream replay boundaries, and concurrent quota reservations.',
  },
]
export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Oblien',
    title: 'Founding Engineer',
    description:
      'Agent runtimes, cloud workspaces, and deployment infrastructure.',
    highlights: [
      {
        title: 'MindWire',
        description:
          'Go runtime and TypeScript SDK for agent sessions, streamed events, and execution across local hosts, SSH, Docker, and cloud workspaces.',
      },
      {
        title: 'Openship',
        description:
          'Deployment workflows from source to running apps, with build pipelines, custom domains, HTTPS, live logs, and release rollbacks.',
      },
      {
        title: 'Workspace SDKs',
        description:
          'Typed Swift APIs for workspace lifecycle, file access, terminal sessions, snapshots, and HTTP retries.',
      },
    ],
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
      'Backend systems for CarLink vehicle maintenance and learning platforms.',
    highlights: [
      {
        title: 'CarLink',
        description:
          'NestJS APIs for service bookings, workshop operations, vehicle records, and notifications, organized around module contracts and domain events.',
      },
      {
        title: 'Learning platforms',
        description:
          '.NET and Node.js services for tenant management, course enrollment, assessments, payments, and certificates.',
      },
      {
        title: 'Learning assistants',
        description:
          'Python services for course questions and quiz generation, with source citations and retrieval scoped to each tenant.',
      },
    ],
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
    highlights: [
      {
        title: 'Q&A and social features',
        description:
          'Anonymous questions, threaded replies, personalized feeds, messaging, and moderation across web and mobile clients.',
      },
      {
        title: 'Performance and notifications',
        description:
          'Redis feed storage, cursor pagination, and BullMQ workers for feed updates and push notifications.',
      },
    ],
    start: 'May 2024',
    end: 'Jul 2025',
    link: 'https://onvo.me/',
    id: 'work2',
    logo: '/work/onvo.png',
  },
  {
    company: 'GDG Suez Canal',
    title: 'IT Mentor',
    description:
      'Mentored students in backend development through a structured .NET learning path.',
    highlights: [
      {
        title: 'Database foundations',
        description:
          'Teaching notes and SQL demos covering relational modeling, normalization, joins, aggregation, and transactions.',
      },
      {
        title: '.NET curriculum',
        description:
          'A progression through C#, object-oriented design, LINQ, Entity Framework Core, and ASP.NET APIs.',
      },
    ],
    start: 'Oct 2024',
    end: 'May 2025',
    link: 'https://www.facebook.com/share/19tEMtQDZb/?mibextid=wwXIfr',
    id: 'work3',
    logo: '/work/gdg.png',
  },
  {
    company: 'Manara',
    title: 'Backend Engineering Intern',
    description:
      'At Manara, I worked on backend development, problem-solving, and software engineering fundamentals.',
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
      'How clustered and non-clustered indexes help the database find rows.',
    link: '/blog/difference-between-cluster-and-non-cluster-index',
    uid: 'blog-1',
  },
  {
    title: '3 Ways to Build Custom Middleware in ASP.NET Core',
    description:
      'Three ways to write ASP.NET Core middleware and how each fits into the request pipeline.',
    link: '/blog/3-ways-to-build-custom-middleware-in-aspnet-core',
    uid: 'blog-2',
  },
  {
    title: 'Boxing and Unboxing in C#',
    description:
      'How C# boxes value types as object or interface references, and what happens during unboxing.',
    link: '/blog/boxing-and-unboxing-in-csharp',
    uid: 'blog-3',
  },
  {
    title: 'SimuKernel: OS Concepts Explained',
    description:
      'CPU scheduling, paging, and process management in the SimuKernel simulator.',
    link: '/blog/simukernel-operating-system-concepts',
    uid: 'blog-4',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    link: 'https://github.com/mo7ammedd',
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/mohammed-mostafa-316b21254/',
  },
  {
    label: 'Résumé',
    link: '/resume.pdf',
  },
]

export const EMAIL = 'MohammedMostafaNazih@gmail.com'
