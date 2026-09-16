import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getAllBlogPosts } from './blog-utils'
import rehypeBlogPost from './rehype-blog-post.mjs'
import type { BlogSearchDocument, BlogSearchSection } from './blog-search'

export async function buildBlogSearchIndex(): Promise<BlogSearchDocument[]> {
  const { compile } = await import('@mdx-js/mdx')
  const posts = await getAllBlogPosts()
  return Promise.all(
    posts.map(async (post) => {
      const filename = path.join(
        process.cwd(),
        'app',
        'blog',
        post.slug,
        'page.mdx',
      )
      const source = await readFile(filename, 'utf8')
      // Parse and transform only. Article imports and expressions are never run.
      const compiled = await compile(
        { value: source, path: filename },
        { rehypePlugins: [rehypeBlogPost] },
      )
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags ?? [],
        sections: compiled.data.blogSections as BlogSearchSection[],
      }
    }),
  )
}
