import { Github } from 'lucide-react'

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

// links?: readonly {
//   icon: React.ReactNode
//   type: string
//   href: string
// }[]

export const PROJECTS = [
  {
    title: '  Talabat APIs',
    description:
      'alabat Integration Platform API enables vendors to manage store, menus and orders on the Talabat platform. The API can be integrated with a vendor’s POS system to improve efficiency for menu management and order management.',
    href: 'https://github.com/Mo7ammedd/Talabat-APIs',
    tags: ['Asp.Net Core', 'C#', 'Redis', 'Sql Server'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/Mo7ammedd/Talabat-APIs',
      },
    ],
  },
  {
    title: 'Manga Store',
    description:
      'Manga Store MVC project It allows users to browse, purchase, and manage manga collections with integrated payment processing. The application features a user-friendly interface for seamless navigation and secure transactions.',
    href: 'https://github.com/Mo7ammedd/BookStore',
    tags: ['Asp.Net Mvc', 'C#', 'Stripe', 'Azure'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/ibelick/nim',
      },
    ],
  },
  {
    title: 'HungerStation Microservices',
    description:
      ' Built seven microservices with .NET 8',
    href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
    tags: ['Microservices', 'Asp.Net Core', 'C#', 'Azure Service Bus'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
      },
    ],
  },
  {
    title: 'E-Commercewebsite',
    description:
      'e-commerceapplication built using Node.js, Express.js, and other essential technologies',
    href: 'https://github.com/Mo7ammedd/nodejs-e-commerce',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/Mo7ammedd/HungerStation_Microservices',
      },
    ],
  },
  {
    title: 'Taylor Swift Quiz',
    description:
      'I made random lyrics quiz generator for the best songwriter',
    href: 'https://swiftiequiz.vercel.app/',
    tags: ['Node.js', 'Express.js', 'NextJs'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/Mo7ammedd/TaylorSwiftClient',
      },
    ],
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
    company: 'Manara',
    title: 'Backend Engineer',
    start: '2023',
    end: '2024',
    link: 'https://app.manara.tech/auth/',
    id: 'work2',
  },
  {
    company: 'IT Mentor',
    title: 'GDG Suez Canal',
    start: '2025',
    end: 'Present',
    link: 'https://ibelick.com',
    id: 'work3',
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
