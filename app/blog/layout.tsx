import { Metadata } from 'next'
import { BLOG_POSTS } from '@/app/data'
import BlogLayoutClient from './blog-layout-client'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Normalize the incoming slug
  const normalizedSlug = params.slug.toLowerCase().trim();
  
  // Find post by matching normalized paths
  const post = BLOG_POSTS.find(post => {
    const postSlug = post.link.replace('/blog/', '').toLowerCase().trim();
    return postSlug === normalizedSlug;
  });

  if (!post) {
    return {
      title: 'Blog | Mohammed',
      description: 'Technical articles and guides about software development',
    }
  }

  const ogImage = post.link.includes('cluster') ? '/og-cluster.png' : '/og-image.png'

  return {
    title: `${post.title} | Mohammed`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://www.mohammedd.tech${post.link}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  }
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return <BlogLayoutClient>{children}</BlogLayoutClient>
}