import { Metadata } from 'next'

export const siteConfig: Metadata = {
  // More specific and searchable title variations
  title: 'Mohammed Software Engineer | .NET Core & Node.js Developer | Available for Hire',
  description:
    'Experienced Software Engineer Mohammed specializing in ASP.NET Core, Node.js, Express.js, and TypeScript. Full-stack developer available for new opportunities. View portfolio, projects, and contact information.',
  keywords: [
    // Add your full name and location-based keywords
    'Mohammed Software Engineer',
    'Mohammed Developer',
    'Mohammed Programmer',
    'Software Engineer Mohammed',
    'ASP.NET Core Developer Mohammed',
    'Node.js Developer Mohammed',
    
    // Long-tail keywords that people search for
    'hire software engineer',
    'freelance software developer',
    'contract software engineer',
    'remote software developer',
    'full stack developer for hire',
    'backend engineer available',
    
    // Specific technical combinations
    'ASP.NET Core Node.js developer',
    'TypeScript Express.js engineer',
    'C# JavaScript full stack',
    'Azure cloud developer',
    
    // Your existing keywords (optimized)
    'Software Engineer',
    'Backend Software Engineer',
    'Full Stack Developer',
    'ASP.NET Core',
    'Azure Developer',
    'Node.js',
    'Express.js',
    'TypeScript',
    'JavaScript',
    'C#',
    'Web Development',
    'Problem Solving',
    'Open Source Contributor',
    
    // Professional status keywords
    'Available for Opportunities',
    'Open to Work',
    'Seeking New Role',
    'Portfolio Website',
  ],
  authors: [{ name: 'Mohammed', url: 'https://www.mohammedd.tech' }],
  creator: 'Mohammed - Software Engineer',
  publisher: 'Mohammed Portfolio Website',
  
  // Add structured data hints
  other: {
    'og:profile:first_name': 'Mohammed',
    'og:profile:username': 'mohammed-software-engineer',
    'profession': 'Software Engineer',
    'specialization': 'ASP.NET Core, Node.js, TypeScript',
    'status': 'Available for Opportunities',
  },
  
  openGraph: {
    type: 'profile', // Changed from 'website' to 'profile' to compete with LinkedIn
    locale: 'en_US',
    url: 'https://www.mohammedd.tech',
    siteName: "Mohammed's Professional Portfolio - Software Engineer",
    title: 'Mohammed | Professional Software Engineer Portfolio',
    description:
      'Professional Software Engineer Mohammed - Specialized in ASP.NET Core, Node.js, Express.js, and TypeScript. View my portfolio, projects, skills, and contact me for new opportunities.',
    images: [
      {
        url: 'https://www.mohammedd.tech/og-image.png', // Use absolute URL
        width: 1200,
        height: 630,
        alt: 'Mohammed Software Engineer Portfolio - ASP.NET Core & Node.js Developer',
        type: 'image/png',
      },
      // Add a secondary professional headshot image
      {
        url: 'https://www.mohammedd.tech/profile-photo.jpg',
        width: 400,
        height: 400,
        alt: 'Mohammed Professional Headshot - Software Engineer',
        type: 'image/jpeg',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@mohamedtv',
    creator: '@mohamedtv',
    title: 'Mohammed Mostafa | Software Engineer Portfolio - ASP.NET Core & Node.js',
    description:
      'Professional Software Engineer Mohammed Mostafa specializing in ASP.NET Core, Node.js, Express.js and TypeScript. Available for new opportunities. View portfolio and projects.',
    images: ['https://www.mohammedd.tech/og-image.png'], // Absolute URL
  },
  
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': 160,
    'max-video-preview': 30,
  },
  
  alternates: {
    canonical: 'https://www.mohammedd.tech',
    languages: {
      'en-US': 'https://www.mohammedd.tech',
    },
  },
  
  // Add verification tags if you have them
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  metadataBase: new URL('https://www.mohammedd.tech/'),
  
  // Add category for better classification
  category: 'Professional Portfolio',
}