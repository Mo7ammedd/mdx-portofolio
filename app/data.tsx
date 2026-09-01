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


type SocialLink = {
  label: string
  link: string
}
 
export const PROJECTS = [
  {
    title: "Aura Decor",
    href: "https://github.com/Mo7ammedd/Aura-Decor",
    active: true,
    description: "Augmented Reality (AR) application integrating custom 3D models to deliver an immersive shopping experience, allowing users to visualize furniture pieces in their real environment.",
    technologies: ["ASP.NET Core", "RabbitMQ", "Docker", "Redis"],
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
    description: "An educational operating system simulator demonstrating CPU scheduling, memory management, and process control with visualized metrics.",
    technologies: ["Operating Systems", "CPU Scheduling", "Memory Management", "Process Management"],
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
    description: "A high-performance, production-ready implementation of an LSM-Tree (Log-Structured Merge-Tree) storage engine in C# with full ACID guarantees and concurrent access support.",
    technologies: ["C#", "LSM-Tree", "ACID", "Concurrent Access", "Benchmarking"],
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
    description: "A distributed file system built from scratch in Java with chunk replication, failure detection, and automatic recovery.",
    technologies: ["Java", "Distributed Systems", "Replication", "Failure Recovery"],
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
    description: "Built seven microservices with .NET 8, featuring secure authentication, Azure Service Bus communication",
    technologies: ["Microservices", "Azure Service Bus", "RabbitMQ"],
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
    description: "A reliable transport protocol built on UDP in asynchronous Rust, featuring ordered delivery, congestion control, retransmissions, sliding windows, and RTT/RTO estimation.",
    technologies: ["Rust", "Tokio", "UDP", "Networking", "Congestion Control"],
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
