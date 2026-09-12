import type { BlogPost } from './blog-utils'

export function getRelatedPosts(
  post: BlogPost,
  posts: readonly BlogPost[],
  limit = 3,
): BlogPost[] {
  const tags = new Set(post.tags ?? [])

  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: new Set(candidate.tags?.filter((tag) => tags.has(tag))).size,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.post.publishedTime) - Date.parse(a.post.publishedTime) ||
        a.post.slug.localeCompare(b.post.slug),
    )
    .slice(0, Math.max(0, limit))
    .map(({ post: relatedPost }) => relatedPost)
}
