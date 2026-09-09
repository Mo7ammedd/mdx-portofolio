import { Icons } from '@/components/icons'

type WorkExperience = {
  company: string
  title: string
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
    title: "Aura Decor",
    href: "https://github.com/Mo7ammedd/Aura-Decor",
    active: true,
    description: "An AR shopping experience that lets you preview 3D furniture in your own space.",
    technologies: ["ASP.NET Core", "RabbitMQ", "Redis"],
    links: [
      {
        type: "Source",
        href: "https://github.com/Mo7ammedd/Aura-Decor",
        icon: <Icons.github className="size-3" />,
      }
    ],
    image: "",
    video: ""
  },
  {
    title: "SimuKernel",
    href: "https://github.com/Mo7ammedd/SimuKernel",
    active: true,
    description: "An OS simulator for exploring CPU scheduling, memory management, and process control.",
    technologies: ["Operating systems", "Simulation"],
    links: [
      {
        type: "Source",
        href: "https://github.com/Mo7ammedd/SimuKernel",
        icon: <Icons.github className="size-3" />,
      }
    ],
    image: "",
    video: ""
  },
  {
    title: "LSMSharp",
    href: "https://github.com/Mo7ammedd/LSMSharp",
    active: true,
    description: "An LSM-tree storage engine in C# with ACID guarantees and concurrent access.",
    technologies: ["C#", "LSM-Tree", "ACID"],
    links: [
      {
        type: "Source",
        href: "https://github.com/Mo7ammedd/LSMSharp",
        icon  : <Icons.github className="size-3" />,
      }
    ],
    image: "",
    video: ""
  },
  {
    title: "Disk-Mesh",
    href: "https://github.com/Mo7ammedd/Disk-Mesh",
    active: true,
    description: "A distributed file system in Java with chunk replication and automatic failure recovery.",
    technologies: ["Java", "Replication", "Recovery"],
    links: [
      {
        type: "Source",
        href: "https://github.com/Mo7ammedd/Disk-Mesh",
        icon: <Icons.github className="size-3" />,
      }
    ],
    image: "",
    video: ""
  },
  {
    title: "HungerStation Microservices",
    href: "https://github.com/Mo7ammedd/HungerStation_Microservices",
    active: true,
    description: "Seven .NET microservices with secure authentication and Azure Service Bus messaging.",
    technologies: [".NET 8", "Azure Service Bus"],
    links: [
      {
        type: "Source",
        href: "https://github.com/Mo7ammedd/HungerStation_Microservices",
        icon: <Icons.github className="size-3" />,
      }
    ],
    image: "",
    video: ""
  },
  {
    title: "AeroUDP",
    href: "https://github.com/Mo7ammedd/AeroUDP",
    active: true,
    description: "Reliable transport over UDP in async Rust, with ordered delivery and congestion control.",
    technologies: ["Rust", "Tokio", "UDP"],
    links: [
      {
        type: "Source",
        href: "https://github.com/Mo7ammedd/AeroUDP",
        icon: <Icons.github className="size-3" />,
      }
    ],
    image: "",
    video: ""
  }
]
export const WORK_EXPERIENCE: WorkExperience[] = [
    {
    company: "Oblien",
    title: "SDE",
    start: "Sep 2025",
    end: "Present",
    link: "https://oblien.com/",
    id: "work0",
    logo: "/work/oblien.jpg",
  },
  {
    company: 'Medica Scope',
    title: 'Backend Engineer',
    start: 'Jul 2025',
    end: 'Present',
    link: 'https://medicascopehms.com/',
    id: 'work1',
    logo: '/work/medica.png',
  },
  {
    company: 'ONVO',
    title: 'Software Engineer',
    start: 'Aug 2024',
    end: 'Jul 2025',
    link: 'https://onvo.me/',
    id: 'work2',
    logo: '/work/onvo.png',
  },
  {
    company: 'IT Mentor',
    title: 'GDG Suez Canal',
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
