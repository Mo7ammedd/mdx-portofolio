import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { AskError, type QuestionUpdate } from './validation'
import { publicQuestion, type AskTopic, type Question } from './types'

type NewQuestion = { question: string; topic: AskTopic }
type RateLimit = { count: number; expiresAt: number }
type FileData = {
  version: 1
  questions: Question[]
  rateLimits: Record<string, RateLimit>
}

export interface AskStore {
  list(publishedOnly?: boolean): Promise<Question[]>
  create(input: NewQuestion): Promise<Question>
  update(id: string, input: QuestionUpdate): Promise<Question | null>
  consumeLimit(
    key: string,
    limit: number,
    windowSeconds: number,
  ): Promise<number>
}

function newQuestion(input: NewQuestion): Question {
  const now = new Date().toISOString()
  return {
    id: randomUUID(),
    ...input,
    status: 'pending',
    answer: null,
    createdAt: now,
    answeredAt: null,
    updatedAt: now,
  }
}

function questionPatch(input: QuestionUpdate): Partial<Question> {
  const updatedAt = new Date().toISOString()
  return input.action === 'publish'
    ? {
        status: 'answered',
        answer: input.answer,
        topic: input.topic,
        answeredAt: updatedAt,
        updatedAt,
      }
    : { status: input.action === 'archive' ? 'archived' : 'pending', updatedAt }
}

// Shared across Next's development route bundles. Writes use atomic renames;
// this adapter is deliberately unavailable in production/serverless runtimes.
const fileQueues = ((
  globalThis as typeof globalThis & {
    __askFileQueues?: Map<string, Promise<unknown>>
  }
).__askFileQueues ??= new Map<string, Promise<unknown>>())

export function createFileStore(path: string): AskStore {
  async function read(): Promise<FileData> {
    try {
      return JSON.parse(await readFile(path, 'utf8')) as FileData
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return { version: 1, questions: [], rateLimits: {} }
      }
      throw error
    }
  }

  function transaction<T>(operation: (data: FileData) => T): Promise<T> {
    const previous = fileQueues.get(path) ?? Promise.resolve()
    const next = previous
      .catch(() => {})
      .then(async () => {
        const data = await read()
        const result = operation(data)
        await mkdir(dirname(path), { recursive: true, mode: 0o700 })
        const temporary = `${path}.${randomUUID()}.tmp`
        await writeFile(temporary, JSON.stringify(data), { mode: 0o600 })
        await rename(temporary, path)
        return result
      })
    fileQueues.set(path, next)
    void next
      .finally(() => {
        if (fileQueues.get(path) === next) fileQueues.delete(path)
      })
      .catch(() => {})
    return next
  }

  return {
    async list(publishedOnly = false) {
      const data = await read()
      return data.questions
        .filter(
          (question) => !publishedOnly || publicQuestion(question) !== null,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    },
    create(input) {
      return transaction((data) => {
        const question = newQuestion(input)
        data.questions.push(question)
        return question
      })
    },
    update(id, input) {
      return transaction((data) => {
        const question = data.questions.find((item) => item.id === id)
        if (!question) return null
        Object.assign(question, questionPatch(input))
        return question
      })
    },
    consumeLimit(key, limit, windowSeconds) {
      return transaction((data) => {
        const now = Date.now()
        for (const [bucket, value] of Object.entries(data.rateLimits)) {
          if (value.expiresAt <= now) delete data.rateLimits[bucket]
        }
        const bucket = (data.rateLimits[key] ??= {
          count: 0,
          expiresAt: now + windowSeconds * 1000,
        })
        bucket.count += 1
        return bucket.count > limit
          ? Math.ceil((bucket.expiresAt - now) / 1000)
          : 0
      })
    },
  }
}

type DatabaseQuestion = {
  id: string
  question: string
  topic: AskTopic
  answer: string | null
  status: Question['status']
  created_at: string
  answered_at: string | null
  updated_at: string
}

function fromDatabase(row: DatabaseQuestion): Question {
  return {
    id: row.id,
    question: row.question,
    topic: row.topic,
    answer: row.answer,
    status: row.status,
    createdAt: row.created_at,
    answeredAt: row.answered_at,
    updatedAt: row.updated_at,
  }
}

export function createSupabaseStore(url: string, key: string): AskStore {
  const base = `${url.replace(/\/$/, '')}/rest/v1/`
  async function query<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('apikey', key)
    headers.set('Content-Type', 'application/json')
    // New secret keys belong on `apikey`; only legacy keys are JWTs.
    if (key.startsWith('sb_secret_')) headers.delete('Authorization')
    else headers.set('Authorization', `Bearer ${key}`)

    const response = await fetch(`${base}${path}`, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
      headers,
    })
    if (!response.ok) {
      // Never include database responses, credentials, or question text in errors.
      throw new AskError(
        'The question inbox is temporarily unavailable. Please try again shortly.',
        503,
      )
    }
    return response.json() as Promise<T>
  }

  return {
    async list(publishedOnly = false) {
      const rows: DatabaseQuestion[] = []
      // Respect PostgREST's default 1,000-row limit without silently hiding older answers.
      for (let offset = 0; ; offset += 1000) {
        const page = await query<DatabaseQuestion[]>(
          `ask_questions?select=*&order=created_at.desc,id.desc${publishedOnly ? '&status=eq.answered' : ''}`,
          { headers: { Range: `${offset}-${offset + 999}` } },
        )
        rows.push(...page)
        if (page.length < 1000) break
      }
      return rows.map(fromDatabase)
    },
    async create(input) {
      const question = newQuestion(input)
      const rows = await query<DatabaseQuestion[]>('ask_questions', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ id: question.id, ...input }),
      })
      if (!rows[0])
        throw new AskError(
          'Your question could not be saved. Please try again.',
          503,
        )
      return fromDatabase(rows[0])
    },
    async update(id, input) {
      const patch = questionPatch(input)
      const rows = await query<DatabaseQuestion[]>(
        `ask_questions?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify({
            status: patch.status,
            answer: patch.answer,
            topic: patch.topic,
            answered_at: patch.answeredAt,
            updated_at: patch.updatedAt,
          }),
        },
      )
      return rows[0] ? fromDatabase(rows[0]) : null
    },
    consumeLimit(key, limit, windowSeconds) {
      return query<number>('rpc/ask_consume_rate_limit', {
        method: 'POST',
        body: JSON.stringify({
          p_key: key,
          p_limit: limit,
          p_window_seconds: windowSeconds,
        }),
      })
    },
  }
}

export function getAskStore(): AskStore {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (url && key) return createSupabaseStore(url, key)
  if (
    !url &&
    !key &&
    process.env.NODE_ENV === 'development' &&
    !process.env.VERCEL
  ) {
    return createFileStore(join(process.cwd(), '.data', 'ask.json'))
  }
  throw new AskError(
    'The question inbox is temporarily unavailable. Please try again shortly.',
    503,
  )
}

export async function getPublicQuestions() {
  const questions = await getAskStore().list(true)
  return questions
    .map(publicQuestion)
    .filter((question) => question !== null)
    .sort((a, b) => b.answeredAt.localeCompare(a.answeredAt))
}
