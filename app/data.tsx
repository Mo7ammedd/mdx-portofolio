import { Icons } from '@/components/icons'

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
  logo?: string
  location?: string
  workType?: 'Remote' | 'Hybrid' | 'Onsite'
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
    title: 'Aura Decor',
    href: 'https://github.com/Mo7ammedd/Aura-Decor',
    active: true,
    description:
      'Augmented Reality (AR) application integrating custom 3D models to deliver an immersive shopping experience, allowing users to visualize furniture pieces in their real environment.',
    technologies: ['ASP.NET Core', 'RabbitMQ', 'Docker', 'Redis'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/Aura-Decor',
        icon: <Icons.github className="size-3" />,
      },
    ],
  },
  {
    title: 'SimuKernel',
    href: 'https://github.com/Mo7ammedd/SimuKernel',
    active: true,
    description:
      'An educational operating system simulator demonstrating CPU scheduling, memory management, and process control with visualized metrics.',
    technologies: ['Operating Systems', 'CPU Scheduling', 'Memory Management', 'Process Management'],
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
    active: true,
    description:
      'A high-performance, production-ready implementation of an LSM-Tree (Log-Structured Merge-Tree) storage engine in C# with full ACID guarantees and concurrent access support.',
    technologies: [
      'C#',
      'LSM-Tree',
      'ACID',
      'Concurrent Access',
      'Benchmarking',
    ],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/LSMSharp',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
  },
  {
    title: 'Talabat APIs',
    href: 'https://github.com/Mo7ammedd/Talabat-APIs',
    active: true,
    description:
      'Talabat Integration Platform API enables vendors to manage store, menus and orders on the Talabat platform',
    technologies: ['ASP.NET Core', 'C#', 'Sql Server', 'Redis'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/Talabat-APIs',
        icon: <Icons.github className="size-3" />,
      },
    ],
  },
  // {
  //   title: 'Manga Store', 
  //   href: 'https://github.com/Mo7ammedd/BookStore',
  //   active: true,
  //   description:
  //   'Microservices architecture with .NET Core (.NET 8) and Identity Server Integration with Azure Service Bus',
  //   technologies: ['ASP.NET Mvc', 'Stripe', 'Sql Server', 'Azure'],
  //   links: [
  //     {
  //       type: 'Source',
  //       href: 'https://github.com/Mo7ammedd/BookStore',
  //       icon: <Icons.github className="size-3" />,
  //     },
      
  //   ],
  //   image: '',
  //   video: '', // Add video link here if available
  // },
  {
    title: 'HungerStation Microservices',
    href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
    active: true,
    description:
      'Built seven microservices with .NET 8, featuring secure authentication, Azure Service Bus communication',
    technologies: [
      'Microservices',
      'Azure Service Bus',
      'RabbitMQ',
    ],
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
    title: 'Taylor Swift Quiz',
    href: 'https://swiftiequiz.vercel.app/',
    active: true,
    description:
      'I made random lyrics quiz generator for the best songwriter',
    technologies: [
      'Node.js',
      'Express',
      'Next.js',
    ],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/TaylorSwiftClient',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'Oblien',
    title: 'SDE',
    start: 'Sep 2025',
    end: 'Present',
    link: 'https://oblien.com/',
    id: 'work0',
    logo: '/work/oblien.jpg',
    location: 'San Francisco, CA',
    workType: 'Remote',
  },
  {
    company: 'Medica Scope',
    title: 'Backend Engineer',
    start: 'Jul 2025',
    end: 'Present',
    link: 'https://www.facebook.com/medicascope/',
    id: 'work1',
    logo: '/work/medica.png',
    location: 'Nasr City, Egypt',
    workType: 'Hybrid',
  },
  {
    company: 'ONVO',
    title: 'Software Engineer',
    start: 'Aug 2024',
    end: 'Jul 2025',
    link: 'https://onvo.me/',
    id: 'work2',
    logo: '/work/onvo.png',
    location: 'Berlin, Germany',
    workType: 'Remote',
  },
  {
    company: 'Manara',
    title: 'Backend Engineer',
    start: 'Mar 2024',
    end: 'Jul 2024',
    link: 'https://app.manara.tech/auth/',
    id: 'work4',
    logo: '/work/manara.png',
    location: 'Middle East',
    workType: 'Remote',
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
      'A practical guide to CPU scheduling, memory management, and process control using the SimuKernel OS simulator.',
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
