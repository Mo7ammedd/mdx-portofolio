import { buildBlogSearchIndex } from '@/lib/blog-search-index'

export const dynamic = 'force-static'

export async function GET() {
  return Response.json(await buildBlogSearchIndex(), {
    headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
  })
}
