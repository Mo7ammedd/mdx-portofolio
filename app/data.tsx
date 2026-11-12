import type { ProjectVisualKind } from '@/components/project-visual'

type WorkExperience = {
  company: string
  title: string
  description?: string
  highlights?: readonly {
    title: string
    description: string
    href?: string
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
  highlight: string
}

export const PROJECTS: PortfolioProject[] = [
  {
    slug: 'llmproxy',
    title: 'LLMProxy',
    category: 'AI infrastructure',
    href: 'https://github.com/Mo7ammedd/LLMProxy',
    caseStudyHref: '/projects/llmproxy',
    visual: 'gateway',
    summary: 'A self-hosted gateway for LLM providers.',
    description:
      'A self-hosted .NET 10 gateway with ten provider adapters, shared rate limits, transactional quota reservations, and idempotent usage accounting.',
    technologies: ['C#', '.NET 10', 'PostgreSQL', 'Redis'],
    highlight:
      'Tests exercise key failover, stream replay boundaries, and concurrent quota reservations.',
  },
  {
    slug: 'lsmsharp',
    title: 'LSMSharp',
    category: 'Storage engine',
    href: 'https://github.com/Mo7ammedd/LSMSharp',
    caseStudyHref: '/projects/lsmsharp',
    visual: 'storage',
    summary: 'An experimental LSM-tree storage engine in C#.',
    description:
      'An experimental C# key-value engine with write-ahead logging, skip-list memtables, immutable SSTables, Bloom filters, and leveled compaction.',
    technologies: ['C#', '.NET 8', 'LSM-tree'],
    highlight:
      'Verified 200 records after compaction, with regression checks for concurrent reads and clean reopen.',
  },
  {
    slug: 'aeroudp',
    title: 'AeroUDP',
    category: 'Networking',
    href: 'https://github.com/Mo7ammedd/AeroUDP',
    caseStudyHref: '/projects/aeroudp',
    articleHref: '/blog/aeroudp-networking-concepts',
    visual: 'transport',
    summary: 'Experimental reliable transport over UDP in Rust.',
    description:
      'Experimental reliable transport over UDP in async Rust, with ordered delivery and congestion control.',
    technologies: ['Rust', 'Tokio', 'UDP'],
    highlight:
      '26 Rust tests passed across codec, handshake, reliability, and loopback transfer paths.',
  },
  {
    slug: 'disk-mesh',
    title: 'Disk-Mesh',
    category: 'Distributed systems',
    href: 'https://github.com/Mo7ammedd/Disk-Mesh',
    caseStudyHref: '/projects/disk-mesh',
    demoHref: '/projects/disk-mesh#replication',
    visual: 'replication',
    summary: 'A distributed file system in Java.',
    description:
      'A Java distributed file system with checksummed chunks, chained replication, and heartbeat-driven replica repair.',
    technologies: ['Java 22+', 'TCP', 'Replication'],
    highlight:
      'Nine local integration scenarios passed, including replica repair after a node failure.',
  },
  {
    slug: 'simukernel',
    title: 'SimuKernel',
    category: 'Operating systems',
    href: 'https://github.com/Mo7ammedd/SimuKernel',
    caseStudyHref: '/projects/simukernel',
    articleHref: '/blog/simukernel-operating-system-concepts',
    demoHref: '/projects/simukernel#scheduler',
    visual: 'scheduler',
    summary: 'CPU scheduling and memory management in C#.',
    description:
      'An educational C# simulator for CPU scheduling and memory management, with a separate browser demo for comparing scheduling policies.',
    technologies: ['C#', '.NET 8', 'TypeScript'],
    highlight:
      'Three browser scheduling policies, checked against known and generated workloads.',
  },
  {
    slug: 'hungerstation-microservices',
    title: 'HungerStation Microservices',
    category: 'Backend services',
    href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
    caseStudyHref: '/projects/hungerstation-microservices',
    visual: 'services',
    summary: 'Food ordering with .NET services.',
    description:
      'A learning project with seven .NET 8 services for food ordering, Stripe checkout, and Azure Service Bus messaging.',
    technologies: ['.NET 8', 'Azure Service Bus', 'Stripe'],
    highlight:
      'Stripe payment approval publishes a rewards message through Azure Service Bus.',
  },
]
export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Oblien',
    title: 'Founding Engineer',
    description:
      'Part-time, remote. Designing and maintaining deployment control planes, agent runtimes, analytics backends, and execution infrastructure.',
    highlights: [
      {
        title: 'Openship',
        description:
          'Designed and maintained the TypeScript/Hono control plane shared by the API, SDK, CLI, and desktop clients. Used PostgreSQL advisory locks, durable execution receipts, and release snapshots to coordinate deployments and recover interrupted work without reclaiming live workers’ resources. Added release gates with Docker integration tests.',
        href: 'https://github.com/oblien/openship',
      },
      {
        title: 'Mindwire',
        description:
          'Built the Go runtime and TypeScript SDK for local, SSH, and Docker agents. Persisted turn receipts before execution to deduplicate retries and reconciled unfinished runs after daemon restarts. Added device pairing and streamed events for product integrations.',
        href: 'https://github.com/oblien/mindwire',
      },
      {
        title: 'BytesMap',
        description:
          'Developed the query and reporting backend with connection leases, row/byte/time limits, encrypted credentials, and transactional worker claims. Built Go ingestion that acknowledges events after durable JetStream publication and indexes them in ClickHouse.',
        href: 'https://bytesmap.com',
      },
      {
        title: 'Agent sandboxes',
        description:
          'Built Firecracker VM lifecycle management, network policies, and workspace SDKs. Implemented billing-aware capacity recovery with quota rechecks and stop tokens so funding restoration does not restart manually stopped workspaces.',
        href: 'https://oblien.com',
      },
      {
        title: 'Reflx',
        description:
          'Built the Express/Prisma backend from profile ingestion through agent conversations and WhatsApp integration. Retained guest/member session state and conversation history across requests.',
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
      'Full-time, hybrid. Own CarLink’s backend implementation and develop patient/case, learning, and payment subsystems across CareLinker, Rewaaq, and Medica Academy.',
    highlights: [
      {
        title: 'CarLink backend',
        description:
          'Owned the NestJS/Prisma/PostgreSQL backend implementation across authentication, vehicle integrations, bookings, and workshop operations. Used conditional status updates to enforce booking transitions and retained quoted prices for invoicing.',
        href: 'https://carlink.dev/',
      },
      {
        title: 'CarLink privacy and maintenance',
        description:
          'Implemented consent/deletion workflows, append-only audit ledgers, and retention controls to keep administrative and privacy actions traceable. Maintained schema migrations and PostgreSQL-backed CI tests.',
      },
      {
        title: 'CareLinker',
        description:
          'Built patient/case and messaging subsystems in NestJS/PostgreSQL with record-level authorization, transactions, and encrypted uploads. Persisted conversation history and rechecked case access for REST and Socket.IO messaging.',
        href: 'https://carelinker.ai/en',
      },
      {
        title: 'Rewaaq',
        description:
          'Developed .NET 10 course and quiz APIs within the shared learning platform, with subscription-scoped access, persisted question selection, grading, and server-enforced deadlines. Built GitLab deployment pipelines with health checks and rollback for authentication and application services.',
        href: 'https://rewaaq.com/landing/',
      },
      {
        title: 'Medica Academy',
        description:
          'Connected Paymob checkout/webhooks to course enrollment and VdoCipher playback. Used transactional enrollment creation and lesson-access checks before issuing video credentials.',
        href: 'https://medicaacademy.com/',
      },
      {
        title: 'Learning assistants',
        description:
          'Developed a Python service for course-content answers with source citations and quiz generation from uploaded material. Retrieval filters the corpus by tenant and course.',
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
      'Full-time, remote. Reworked ONVO’s PHP backend in Express.js, building its Q&A, feed, and messaging workflows.',
    highlights: [
      {
        title: 'Anonymous Q&A and feeds',
        description:
          'Built anonymous questions, threaded replies, and followed-user feeds with capped queries and timestamp-based pagination. Used Redis for session/context lookups and action rate limits.',
        href: 'https://onvo.me/',
      },
      {
        title: 'Messaging and notifications',
        description:
          'Implemented messaging permissions, replies, media attachments, and push notifications, with request-size limits and XSS middleware around backend endpoints.',
        href: 'https://onvo.me/',
      },
      {
        title: 'Airwave',
        description:
          'Built the Node.js backend for music/podcast playback, playlists, and WebSocket listening rooms that synchronize playback state across connected clients.',
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
          'Created teaching notes and SQL examples for relational modeling, normalization, joins, aggregation, and transactions.',
      },
      {
        title: '.NET learning path',
        description:
          'Organized a progression from C# and object-oriented design to LINQ, Entity Framework Core, and ASP.NET APIs, with the learning materials published on GitHub.',
        href: 'https://github.com/Mo7ammedd/.NET-Development-Learning-Path-GDG',
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
      'Backend engineering internship focused on development fundamentals and problem-solving.',
    start: 'Mar 2024',
    end: 'Jul 2024',
    link: 'https://app.manara.tech/auth/',
    id: 'work4',
    logo: '/work/manara.png',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Clustered vs. non-clustered indexes',
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
    link: 'https://www.linkedin.com/in/mohammedtv/',
  },
  {
    label: 'Résumé',
    link: '/resume.pdf',
  },
]

export const EMAIL = 'MohammedMostafaNazih@gmail.com'
