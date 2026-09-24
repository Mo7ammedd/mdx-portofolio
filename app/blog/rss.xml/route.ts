import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getAllBlogPosts } from '@/lib/blog-utils'
import { buildRssFeed, renderBlogArticleForFeed } from '@/lib/blog-feed'
import { WEBSITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllBlogPosts()
  const articles = await Promise.all(
    posts.map(async (post) => {
      const source = await readFile(
        path.join(process.cwd(), 'app', 'blog', post.slug, 'page.mdx'),
        'utf8',
      )
      return {
        post,
        html: await renderBlogArticleForFeed(
          source,
          `${WEBSITE_URL}/blog/${post.slug}`,
        ),
      }
    }),
  )
  return new Response(buildRssFeed(articles), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
