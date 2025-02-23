import { Metadata } from 'next'
import { BLOG_POSTS } from '../../data'

interface PageProps {
  params: {
    slug: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: PageProps
): Promise<Metadata> {
  // Find the matching blog post from the data
  const post = BLOG_POSTS.find(
    (post) => post.link === `/blog/${params.slug}`
  )

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: `${post.title} | Mohammed's Blog`,
    description: post.description,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://www.mohammedd.tech/blog/${params.slug}`,
      siteName: "Mohammed's Blog",
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mohamedtv',
      creator: '@mohamedtv',
      title: post.title,
      description: post.description,
      images: ['/og-image.png'],
    },
  }
}

export default function BlogPost({ params, searchParams }: PageProps) {
  return (
    // Your MDX content will be automatically inserted here by Next.js
    <>
    </>
  )
}