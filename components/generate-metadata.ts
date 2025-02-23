import { Metadata } from 'next'
import { BLOG_POSTS } from '../app/data'

type BlogParams = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogParams): Promise<Metadata> {
  const post = BLOG_POSTS.find(post => {
    const postSlug = post.link.replace('/blog/', '')
    return postSlug === params.slug
  })

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Mohammed's Blog`,
    description: post.description,
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: `https://www.mohammedd.tech${post.link}`,
      siteName: "Mohammed's Blog",
      title: post.title,
      description: post.description,
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