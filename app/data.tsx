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
    title: 'SyntaxSphere',
    href: 'https://github.com/ahmeddelattarr/SyntaxSphere',
    active: true,
    description:
      'SyntaxSphere is a Django-based web application that provides a platform for users to share and discuss programming-related content.',
    technologies: ['Django', 'REST APIs', 'JWT', 'SQLite'],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/ahmeddelattarr/SyntaxSphere',
        icon: <Icons.github className="size-3" />,
      },
    ],
  },
  {
    title: 'Matrix',
    href: 'https://github.com/ahmeddelattarr/matrix',
    active: true,
    description:
      'A secure, asynchronous communication server featuring SSL encryption and JWT-based authentication, designed to support seamless server-client interaction.',
    technologies: [
      'Python',
      'Asynchronous Server',
      'JWT',
      'PostgreSQL',
      'SSL Encryption',
    ],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/ahmeddelattarr/matrix',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
  },
  {
    title: 'DishRating API',
    href: 'https://github.com/ahmeddelattarr/DishRating_api',
    active: true,
    description:
      'API built to manage user and meal ratings, with a focus on efficient token-based authentication and structured data management.',
    technologies: [
      'Django REST Framework',
      'Token-Based Authentication',
      'PostgreSQL',
      'API Design',
      'ElasticSearch (optional)',
    ],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/ahmeddelattarr/DishRating_api',
        icon: <Icons.github className="size-3" />,
      },
    ],
    image: '',
    video: '', // Add video link here if available
  },
  {
    title: 'PollsApp Django',
    href: 'https://github.com/ahmeddelattarr/PollsApp_django',
    active: true,
    description:
      'An interactive polling application built with Django, allowing users to create, manage, and vote in custom polls with a user-friendly interface.',
    technologies: [
      'Django',
      'Django REST Framework',
      'SQLite',
      'HTML/CSS',
      'JavaScript',
    ],
    links: [
      {
        type: 'Source',
        href: 'https://github.com/ahmeddelattarr/PollsApp_django',
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
