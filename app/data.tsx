import { Icons } from '@/components/icons'

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
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
  {
    title: 'Matrix',
    href: 'https://github.com/Mo7ammedd/BookStore',
    active: true,
    description:
    'Manga Store MVC project is a comprehensive web application built using .NET MVC Core. It allows users to browse, purchase, and manage manga collections with integrated payment processing. The application features a user-friendly interface for seamless navigation and secure transactions',
    technologies: ['ASP.NET Mvc', 'Stripe', 'Sql Server', 'Azure'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/BookStore',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
  },
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
        href: 'ttps://github.com/Mo7ammedd/HungerStation_Microservices',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
  },
  {
    title: 'E-Commercewebsite',
    href: 'https://github.com/Mo7ammedd/nodejs-e-commerce',
    active: true,
    description:
      'E-commerce  allows users to browse products, add them to the cart, and place orders.',
    technologies: [
      'Node.js',
      'Express',
      'MongoDB',
    ],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/Mo7ammedd/nodejs-e-commerce',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
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
    company: 'ONVO',
    title: 'Software Engineer',
    start: '2024',
    end: 'Present',
    link: 'https://onvo.me/',
    id: 'work1',
  },
  {
    company: 'IT Mentor',
    title: 'GDG Suez Canal',
    start: '2025',
    end: 'Present',
    link: 'https://www.facebook.com/share/19tEMtQDZb/?mibextid=wwXIfr',
    id: 'work3',
  },
  {
    company: 'Manara',
    title: 'Backend Engineer',
    start: '2023',
    end: '2024',
    link: 'https://app.manara.tech/auth/',
    id: 'work2',
  },
]

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Difference Between Cluster and Non-Cluster Index',
    description:
      'An index is a disk-based structure linked to a table or view that speeds up the retrieval of rows.',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
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
