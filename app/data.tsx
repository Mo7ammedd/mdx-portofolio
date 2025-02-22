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
    title: 'SyntaxSphere',
    description:
      'SyntaxSphere is a Django-based web application that provides a platform for users to share and discuss programming-related content.',
    href: 'https://pro.motion-primitives.com/',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/ibelick/nim',
      },
    ],
  },
  {
    title: 'Matrix',
    description:
      'A secure, asynchronous communication server featuring SSL encryption and JWT-based authentication, designed to support seamless server-client interaction.',
    href: 'https://motion-primitives.com/',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/ibelick/nim',
      },
    ],
  },
  {
    title: 'DishRating API',
    description:
      'API built to manage user and meal ratings, with a focus on efficient token-based authentication and structured data management.',
    href: 'https://github.com/ibelick/nim',
    tags: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
    links: [
      {
        icon: <Github />,
        type: 'Github',
        href: 'https://github.com/ibelick/nim',
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
    start: '2024',
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
    title: 'Why I left my job to start my own company',
    description:
      'A deep dive into my decision to leave my job and start my own company',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
    uid: 'blog-2',
  },
  {
    title: 'What I learned from my first year of freelancing',
    description:
      'A look back at my first year of freelancing and what I learned',
    link: '/blog/exploring-the-intersection-of-design-ai-and-design-engineering',
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
