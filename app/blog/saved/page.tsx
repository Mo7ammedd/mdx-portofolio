import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { generateSEO } from '@/lib/seo'
import { SavedArticles } from '@/components/ui/saved-articles'

export const metadata = {
  ...generateSEO({
    title: 'Saved articles',
    description: 'Your articles saved for later on this device.',
    path: '/blog/saved',
  }),
  robots: { index: false, follow: true },
}

export default async function SavedArticlesPage() {
  const posts = await getAllBlogPosts()
  return (
    <main>
      <Link href="/blog" className="text-link mb-5">
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All writing
      </Link>
      <h1 className="text-3xl font-medium tracking-tight text-zinc-100">
        Saved articles
      </h1>
      <p className="mt-4 text-sm leading-7 text-zinc-400">
        Your reading list stays in this browser. Save an article for later, then
        return whenever you have time.
      </p>
      <Link href="/blog/paths" className="text-link mt-2">
        View reading paths
      </Link>
      <SavedArticles posts={posts} />
    </main>
  )
}
