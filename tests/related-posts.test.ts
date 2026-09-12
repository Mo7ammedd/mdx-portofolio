import assert from 'node:assert/strict'
import test from 'node:test'

import type { BlogPost } from '../lib/blog-utils'
import { getRelatedPosts } from '../lib/related-posts'

const post = (
  slug: string,
  tags?: string[],
  publishedTime = '2026-01-01',
): BlogPost => ({
  slug,
  title: slug,
  tags,
  publishedTime,
  description: '',
  readingTime: 1,
})

test('related reading prioritizes topic overlap, then recency, and excludes the current article', () => {
  const current = post('current', ['database', 'performance'])
  const posts = [
    current,
    post('unrelated', ['rust']),
    post('one-match-newer', ['performance'], '2026-06-01'),
    post('two-matches', ['database', 'performance']),
    post('one-match-older', ['database']),
  ]
  const original = structuredClone(posts)
  assert.deepEqual(
    getRelatedPosts(current, posts).map(({ slug }) => slug),
    ['two-matches', 'one-match-newer', 'one-match-older'],
  )
  assert.deepEqual(posts, original)
})

test('duplicate tags do not inflate relevance and limits are respected', () => {
  const current = post('current', ['database', 'performance'])
  const posts = [
    post('duplicate', ['database', 'database', 'database']),
    post('better', ['database', 'performance']),
  ]
  assert.deepEqual(
    getRelatedPosts(current, posts, 1).map(({ slug }) => slug),
    ['better'],
  )
  assert.deepEqual(getRelatedPosts(current, posts, 0), [])
})

test('missing tags or no shared topics produce no recommendations', () => {
  assert.deepEqual(
    getRelatedPosts(post('current'), [post('other', ['database'])]),
    [],
  )
  assert.deepEqual(
    getRelatedPosts(post('current', ['rust']), [
      post('other', ['database']),
      post('untagged'),
    ]),
    [],
  )
})
