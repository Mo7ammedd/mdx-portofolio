import { createHash } from 'node:crypto'

export const ONVO_POSTS_URL = 'https://api.onvo.me/v3/users/mo/posts?limit=20'

const pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))
const hasText = (value) => typeof value === 'string' && value.trim().length > 0

async function onvoResponse(url, { request = fetch, wait = pause } = {}) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await request(url, {
      headers: {
        Accept: 'application/json',
        Origin: 'https://onvo.me',
        Referer: 'https://onvo.me/',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:156.0) Gecko/20100101 Firefox/156.0',
      },
      signal: AbortSignal.timeout(30_000),
    })
    if ([429, 502, 503, 504].includes(response.status) && attempt < 3) {
      const retryAfter = response.headers.get('retry-after')
      const seconds = retryAfter === null ? NaN : Number(retryAfter)
      const delay = Number.isFinite(seconds)
        ? seconds * 1000
        : Date.parse(retryAfter || '') - Date.now()
      await wait(
        Math.max(1000, Number.isFinite(delay) ? delay : 2 ** attempt * 1000),
      )
      continue
    }
    if (response.status === 404) return null
    if (!response.ok) {
      throw new Error(
        `Onvo returned HTTP ${response.status}. No posts were imported.`,
      )
    }
    return response.json()
  }
}

function nextPage(data, seen) {
  if (!Array.isArray(data?.items) || typeof data.has_more !== 'boolean') {
    throw new Error('Onvo returned an invalid paginated response.')
  }
  if (!data.has_more) return null
  const cursor = data.next_cursor
  if (
    typeof cursor !== 'string' ||
    !cursor ||
    seen.has(cursor) ||
    !data.items.length
  ) {
    throw new Error('Onvo pagination did not advance. No posts were imported.')
  }
  seen.add(cursor)
  return cursor
}

export async function fetchOnvoPosts(options = {}) {
  const items = []
  const seen = new Set()
  let cursor = null
  let pages = 0
  do {
    const url = new URL(ONVO_POSTS_URL)
    if (cursor) url.searchParams.set('cursor', cursor)
    const payload = await onvoResponse(url, options)
    cursor = nextPage(payload?.data, seen)
    items.push(...payload.data.items)
    pages += 1
    options.onProgress?.({ phase: 'profile', pages, fetched: items.length })
    if (pages >= 10_000 && cursor) {
      throw new Error(
        'Onvo exceeded the pagination limit. No posts were imported.',
      )
    }
  } while (cursor)
  return {
    data: { items, next_cursor: null, has_more: false },
    pagination: { pages, fetched: items.length },
  }
}

export function withOnvoQuestion(item, thread) {
  if (!Array.isArray(thread))
    throw new Error('Onvo returned an invalid public thread.')
  const index = thread.findIndex(
    (message) => String(message.id) === String(item.id),
  )
  if (index < 0) return null
  const current = thread[index]
  if (current.author?.username?.toLowerCase() !== 'mo') return null
  if (hasText(current.question?.body)) return current
  let question = current.parent_message_id
    ? thread.find(
        (message) => String(message.id) === String(current.parent_message_id),
      )
    : null
  // Legacy imports stored a two-message Q&A without parent IDs. The thread
  // preserves their order; never guess a question for an ambiguous thread.
  if (
    !question &&
    !current.parent_message_id &&
    thread.length === 2 &&
    index === 1
  ) {
    const previous = thread[0]
    if (
      !previous.parent_message_id &&
      previous.author?.username?.toLowerCase() !== 'mo'
    ) {
      question = previous
    }
  }
  return question
    ? {
        ...current,
        question: {
          id: question.id,
          body: question.body,
          created_at: question.created_at,
          media_type: question.media_type,
          media_url: question.media_url,
          media: question.media,
        },
      }
    : current
}

export async function recoverOnvoHistory(payload, options = {}) {
  const items = [...payload.data.items]
  const ids = new Set(items.map((item) => String(item.id)))
  const duplicates = items.length - ids.size
  const candidates = []
  let archivePages = 0

  // Onvo's legacy profile pages sort an expanding ID window by date. This
  // repeats old entries while omitting others. Recover below the oldest ID
  // through the feed's stable cursor, then verify each candidate publicly.
  if (duplicates) {
    const ownIds = items
      .filter((item) => item.author?.username === 'mo')
      .map((item) => Number(item.id))
    if (
      !ownIds.length ||
      ownIds.some((id) => !Number.isSafeInteger(id) || id <= 0)
    ) {
      throw new Error(
        'Cannot recover the Onvo archive without valid source IDs.',
      )
    }
    let cursor = Buffer.from(
      JSON.stringify({ id: Math.min(...ownIds) }),
    ).toString('base64url')
    let emptyPages = 0
    const seen = new Set([cursor])
    while (cursor && emptyPages < 2 && candidates.length < duplicates) {
      const url = new URL('https://api.onvo.me/v3/posts?limit=50')
      url.searchParams.set('cursor', cursor)
      const page = await onvoResponse(url, options)
      cursor = nextPage(page?.data, seen)
      const own = page.data.items.filter(
        (item) => item.author?.username === 'mo',
      )
      emptyPages = own.length ? 0 : emptyPages + 1
      for (const item of own) {
        if (ids.has(String(item.id))) continue
        ids.add(String(item.id))
        candidates.push(item)
      }
      archivePages += 1
      options.onProgress?.({
        phase: 'archive',
        pages: archivePages,
        candidates: candidates.length,
      })
      if (
        archivePages >= 100 &&
        cursor &&
        emptyPages < 2 &&
        candidates.length < duplicates
      ) {
        throw new Error(
          'The Onvo archive needs further review. No posts were imported.',
        )
      }
    }
  }

  const candidateIds = new Set(candidates.map((item) => String(item.id)))
  const threads = new Map()
  const unavailable = new Set()
  const recovered = []
  const restoredQuestions = new Set()
  for (const item of [...items, ...candidates]) {
    if (
      item.author?.username?.toLowerCase() !== 'mo' ||
      item.reposted_by ||
      item.quote ||
      (!candidateIds.has(String(item.id)) && hasText(item.question?.body))
    ) {
      recovered.push(item)
      continue
    }
    if (!/^[0-9]{1,32}$/.test(String(item.post_id))) {
      recovered.push(item)
      continue
    }
    const postId = String(item.post_id)
    if (!threads.has(postId)) {
      const response = await onvoResponse(
        `https://api.onvo.me/v3/posts/${postId}`,
        options,
      )
      threads.set(postId, response?.data ?? null)
      options.onProgress?.({ phase: 'threads', fetched: threads.size })
    }
    const thread = threads.get(postId)
    const restored = thread ? withOnvoQuestion(item, thread) : null
    if (!restored) {
      unavailable.add(String(item.id))
      continue
    }
    if (!hasText(item.question?.body) && hasText(restored.question?.body))
      restoredQuestions.add(String(item.id))
    recovered.push(restored)
  }
  return {
    ...payload,
    data: { items: recovered, next_cursor: null, has_more: false },
    recovery: {
      archivePages,
      candidates: candidates.length,
      publicThreads: threads.size,
      restoredQuestions: restoredQuestions.size,
      unavailable: [...unavailable],
    },
  }
}

function importedId(source) {
  const bytes = createHash('sha256')
    .update(`ask-import:${source}`)
    .digest()
    .subarray(0, 16)
  // Stable import IDs retain the UUID format used by existing inbox routes.
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = bytes.toString('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function validText(value, maximum) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0 &&
    [...value.trim()].length <= maximum &&
    !value.includes('\0')
  )
}

function timestamp(value) {
  if (typeof value !== 'string' || !value.trim()) return null
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date.toISOString() : null
}

export function prepareOnvoImport(payload, username = 'mo') {
  if (!/^[a-z0-9_.-]{1,64}$/.test(username)) {
    throw new Error('Enter a valid Onvo username.')
  }
  const items = payload?.data?.items
  if (!Array.isArray(items)) {
    throw new Error('Expected an Onvo response containing data.items.')
  }

  const rows = []
  const skipped = []
  const seen = new Map()
  let duplicates = 0
  for (const item of items) {
    const sourceId = item?.id
    if (
      !['string', 'number'].includes(typeof sourceId) ||
      !/^[0-9]{1,32}$/.test(String(sourceId)) ||
      (typeof sourceId === 'number' && !Number.isSafeInteger(sourceId))
    ) {
      throw new Error('An Onvo post is missing a valid source ID.')
    }
    const source = `onvo:${username}:${sourceId}`
    const fingerprint = JSON.stringify({
      author: item.author?.username?.toLowerCase(),
      isReply: item.is_reply,
      flagged: item.flagged,
      repost: Boolean(item.reposted_by),
      quote: item.quote,
      body: item.body,
      createdAt: item.created_at,
      question: item.question && {
        body: item.question.body,
        createdAt: item.question.created_at,
        mediaType: item.question.media_type,
        mediaUrl: item.question.media_url,
        media: item.question.media,
      },
      mediaType: item.media_type,
      mediaUrl: item.media_url,
      media: item.media,
    })
    if (seen.has(source)) {
      if (seen.get(source) !== fingerprint) {
        throw new Error(`Conflicting source posts share the ID ${sourceId}.`)
      }
      duplicates += 1
      continue
    }
    seen.set(source, fingerprint)
    const skip = (reason) => skipped.push({ source, reason })
    if (
      item.author?.username?.toLowerCase() !== username ||
      item.is_reply !== true ||
      item.reposted_by ||
      item.quote
    ) {
      skip('Not an original answer by the selected account.')
      continue
    }
    if (item.flagged === true) {
      skip('The source post is flagged.')
      continue
    }
    const hasMedia = (message) =>
      message?.media_type ||
      message?.media_url ||
      (Array.isArray(message?.media)
        ? message.media.length > 0
        : Boolean(message?.media))
    if (hasMedia(item) || hasMedia(item.question)) {
      skip('The post contains media that the text inbox cannot preserve.')
      continue
    }
    if (!hasText(item.question?.body)) {
      skip('The public thread has no text question to import.')
      continue
    }
    if (!validText(item.question.body, 1000) || !validText(item.body, 8000)) {
      skip(
        'Question or answer text is empty, invalid, or exceeds the inbox limits.',
      )
      continue
    }
    const createdAt = timestamp(item.question.created_at)
    const answeredAt = timestamp(item.created_at)
    if (!createdAt || !answeredAt || createdAt > answeredAt) {
      skip(
        'The original question and answer dates are missing or inconsistent.',
      )
      continue
    }
    const row = {
      id: importedId(source),
      import_source: source,
      question: item.question.body,
      answer: item.body,
      topic: 'general',
      status: 'answered',
      created_at: createdAt,
      answered_at: answeredAt,
      updated_at: answeredAt,
    }
    rows.push(row)
  }
  return {
    total: items.length,
    unique: seen.size,
    duplicates,
    rows,
    skipped,
    shortQuestions: rows.filter((row) => [...row.question.trim()].length < 15)
      .length,
    hasMore: payload.data.has_more === true,
  }
}

export async function insertOnvoQuestions(
  rows,
  configuration,
  request = fetch,
) {
  if (!rows.length) return []
  const { url, key } = configuration
  if (!url || !key) {
    throw new Error(
      'Configure a Supabase URL and server-only secret key first.',
    )
  }
  const endpoint = new URL('/rest/v1/ask_questions', url)
  endpoint.searchParams.set('on_conflict', 'id')
  endpoint.searchParams.set('select', 'id,import_source')
  const headers = new Headers({
    apikey: key,
    'Content-Type': 'application/json',
    Prefer: 'resolution=ignore-duplicates,return=representation',
  })
  if (!key.startsWith('sb_secret_')) {
    headers.set('Authorization', `Bearer ${key}`)
  }
  const response = await request(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(rows),
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) {
    throw new Error(
      `Import failed (HTTP ${response.status}). Apply supabase/migrations/202609230001_onvo_imports.sql and check the server credentials.`,
    )
  }
  const inserted = await response.json()
  if (!Array.isArray(inserted)) {
    throw new Error('The database did not return an import receipt.')
  }
  return inserted
}
