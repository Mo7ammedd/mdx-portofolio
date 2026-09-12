import { Icons } from '@/components/icons'

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

export const PROJECTS = [
  {
    title: 'SimuKernel',
    href: 'https://github.com/Mo7ammedd/SimuKernel',
    caseStudyHref: '/projects/simukernel',
    articleHref: '/blog/simukernel-operating-system-concepts',
    demoHref: '/projects/simukernel#scheduler',
    active: true,
    description:
      'A C#/.NET 8 console simulator for CPU scheduling, page replacement, and process management.',
    technologies: ['C#', '.NET 8', 'Operating systems'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/SimuKernel',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '',
  },
  {
    title: 'LSMSharp',
    href: 'https://github.com/Mo7ammedd/LSMSharp',
    caseStudyHref: '/projects/lsmsharp',
    active: true,
    description:
      'An LSM-tree storage engine in C# with write-ahead logging, Bloom filters, and background compaction.',
    technologies: ['C#', 'LSM-Tree', 'WAL'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/LSMSharp',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '',
  },
  {
    title: 'Disk-Mesh',
    href: 'https://github.com/Mo7ammedd/Disk-Mesh',
    active: true,
    description:
      'A Java distributed file system with checksummed chunks, chained replication, and heartbeat-driven replica repair.',
    technologies: ['Java 22+', 'TCP', 'Replication'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/Disk-Mesh',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '',
  },
  {
    title: 'HungerStation Microservices',
    href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
    active: true,
    description:
      'Seven .NET 8 services for food ordering, with JWT authentication, Stripe checkout, and Azure Service Bus messaging.',
    technologies: ['.NET 8', 'Azure Service Bus', 'Stripe'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '',
  },
  {
    title: 'AeroUDP',
    href: 'https://github.com/Mo7ammedd/AeroUDP',
    caseStudyHref: '/projects/aeroudp',
    articleHref: '/blog/aeroudp-networking-concepts',
    active: true,
    description:
      'Reliable transport over UDP in async Rust, with ordered delivery and congestion control.',
    technologies: ['Rust', 'Tokio', 'UDP'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/AeroUDP',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '',
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
