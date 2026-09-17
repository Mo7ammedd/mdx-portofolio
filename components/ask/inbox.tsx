'use client'

import { useRef, useState, type FormEvent } from 'react'
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CornerUpLeft,
  Inbox as InboxIcon,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  MessageSquare,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SiteLink } from '@/components/site-link'
import {
  ANSWER_MAX_LENGTH,
  ASK_TOPICS,
  topicLabel,
  type AskTopic,
  type Question,
  type QuestionStatus,
} from '@/lib/ask/types'
import type { QuestionUpdate } from '@/lib/ask/validation'
import {
  AskRequestError,
  askRequest,
  questionDate,
  requestError,
} from './client'
import './ask.css'

function AnswerEditor({
  question,
  pending,
  onPublish,
}: {
  question: Question
  pending: boolean
  onPublish: (update: QuestionUpdate) => void
}) {
  const [answer, setAnswer] = useState(question.answer ?? '')
  const [topic, setTopic] = useState<AskTopic>(question.topic)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onPublish({ action: 'publish', answer, topic })
  }

  return (
    <form
      method="post"
      onSubmit={submit}
      className="border-t border-white/10 pt-5"
      aria-busy={pending}
    >
      <label
        htmlFor={`answer-${question.id}`}
        className="text-xs font-medium text-zinc-300"
      >
        Your answer
      </label>
      <textarea
        id={`answer-${question.id}`}
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        maxLength={ANSWER_MAX_LENGTH}
        required
        disabled={pending}
        placeholder="Take your time. A thoughtful answer goes a long way."
        className="ask-field mt-3 min-h-44 resize-y"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="relative">
          <label htmlFor={`topic-${question.id}`} className="sr-only">
            Answer topic
          </label>
          <select
            id={`topic-${question.id}`}
            value={topic}
            onChange={(event) => setTopic(event.target.value as AskTopic)}
            disabled={pending}
            className="min-h-10 appearance-none rounded-md border border-white/15 bg-black py-2 pr-8 pl-3 text-xs text-zinc-300"
          >
            {ASK_TOPICS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2.5 size-3 -translate-y-1/2 text-zinc-500"
          />
        </div>
        <span className="font-mono text-[10px] text-zinc-400 tabular-nums">
          {answer.length} / {ANSWER_MAX_LENGTH}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-[15rem] text-[11px] leading-5 text-zinc-400">
          Publishing makes this question and your answer visible to everyone.
        </p>
        <button
          type="submit"
          disabled={pending || !answer.trim()}
          className="ask-primary"
        >
          {pending ? (
            <>
              Saving{' '}
              <LoaderCircle
                aria-hidden="true"
                className="size-3.5 animate-spin"
              />
            </>
          ) : (
            <>
              {question.status === 'answered'
                ? 'Update answer'
                : 'Publish answer'}{' '}
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

const tabs: { value: QuestionStatus; label: string }[] = [
  { value: 'pending', label: 'To answer' },
  { value: 'answered', label: 'Published' },
  { value: 'archived', label: 'Archived' },
]

export function Inbox({
  initialQuestions,
  loadError: initialLoadError,
}: {
  initialQuestions: Question[]
  loadError: boolean
}) {
  const router = useRouter()
  const [questions, setQuestions] = useState(initialQuestions)
  const [tab, setTab] = useState<QuestionStatus>('pending')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [publishedId, setPublishedId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(initialLoadError)
  const [expired, setExpired] = useState(false)
  const busyRef = useRef(false)
  const filtered = questions.filter(
    (question) =>
      question.status === tab &&
      `${question.question} ${question.answer ?? ''}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  )

  function report(error: unknown) {
    if (error instanceof AskRequestError && error.status === 401)
      setExpired(true)
    setError(requestError(error))
  }

  async function refresh() {
    if (busyRef.current) return
    busyRef.current = true
    setBusy('refresh')
    setError('')
    try {
      const data = await askRequest<{ questions: Question[] }>('/api/ask/inbox')
      setQuestions(data.questions)
      setLoadError(false)
      setMessage('Inbox refreshed.')
    } catch (error) {
      report(error)
    } finally {
      setBusy(null)
      busyRef.current = false
    }
  }

  async function update(id: string, input: QuestionUpdate) {
    if (busyRef.current) return
    busyRef.current = true
    setBusy(id)
    setError('')
    setMessage('')
    setPublishedId(null)
    try {
      const data = await askRequest<{ question: Question }>(
        `/api/ask/inbox/${id}`,
        { method: 'PATCH', body: JSON.stringify(input) },
      )
      setQuestions((current) =>
        current.map((question) =>
          question.id === id ? data.question : question,
        ),
      )
      setEditing(null)
      setMessage(
        input.action === 'publish'
          ? 'Your answer is published.'
          : input.action === 'archive'
            ? 'Question archived. You can restore it anytime.'
            : 'Question moved back to your inbox.',
      )
      if (input.action === 'publish') setPublishedId(id)
    } catch (error) {
      report(error)
    } finally {
      setBusy(null)
      busyRef.current = false
    }
  }

  async function logout() {
    if (busyRef.current) return
    busyRef.current = true
    setBusy('logout')
    try {
      await askRequest('/api/ask/session', { method: 'DELETE' })
      router.refresh()
    } catch (error) {
      report(error)
    } finally {
      setBusy(null)
      busyRef.current = false
    }
  }

  return (
    <main
      className="ask-inbox ask-enter"
      aria-labelledby="inbox-title"
      data-clarity-mask="true"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="section-heading flex items-center gap-2">
          <LockKeyhole aria-hidden="true" className="size-3" /> Just for you
        </p>
        <button
          type="button"
          onClick={logout}
          disabled={Boolean(busy)}
          className="text-link gap-2 disabled:opacity-50"
        >
          <LogOut aria-hidden="true" className="size-3.5" />
          Sign out
        </button>
      </div>
      <h1
        id="inbox-title"
        className="mt-3 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
      >
        Question inbox<span className="text-zinc-500">.</span>
      </h1>
      <p className="mt-4 text-sm leading-7 text-zinc-400">
        A little curiosity landed here. Only the answers you publish become part
        of the conversation.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div
          role="group"
          aria-label="Question status"
          className="flex flex-wrap gap-1"
        >
          {tabs.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={Boolean(busy)}
              aria-pressed={tab === item.value}
              onClick={() => {
                setTab(item.value)
                setEditing(null)
              }}
              className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-xs transition-colors disabled:opacity-50 ${tab === item.value ? 'bg-white/[0.09] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              {item.label}
              <span className="font-mono text-[10px] text-zinc-400">
                {
                  questions.filter((question) => question.status === item.value)
                    .length
                }
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={Boolean(busy)}
          aria-label="Refresh inbox"
          className="flex size-11 items-center justify-center rounded-md text-zinc-500 hover:bg-white/5 hover:text-zinc-200 disabled:opacity-50"
        >
          <RefreshCw
            aria-hidden="true"
            className={`size-3.5 ${busy === 'refresh' ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
      <div className="relative mt-5">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-zinc-500"
        />
        <label htmlFor="inbox-search" className="sr-only">
          Search your inbox
        </label>
        <input
          id="inbox-search"
          type="search"
          placeholder="Find a question…"
          value={query}
          maxLength={160}
          onChange={(event) => setQuery(event.target.value)}
          className="ask-field pl-10"
        />
      </div>
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-md border border-red-300/15 bg-red-300/[0.03] px-4 py-3 text-xs leading-6 text-red-300"
        >
          {error}
          {expired && (
            <a href="" className="ml-2 underline underline-offset-4">
              Sign in again
            </a>
          )}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="mt-4 flex flex-wrap items-center gap-x-2 rounded-md border border-white/10 px-4 py-3 text-xs leading-6 text-zinc-300"
        >
          <Check aria-hidden="true" className="size-3.5" />
          {message}
          {publishedId && (
            <SiteLink
              href={`/ask#question-${publishedId}`}
              className="inline-flex items-center gap-1 underline underline-offset-4"
            >
              View answer <ArrowUpRight aria-hidden="true" className="size-3" />
            </SiteLink>
          )}
        </div>
      )}
      {loadError ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 p-8 text-center">
          <p className="text-sm text-zinc-300">The inbox couldn’t load.</p>
          <p className="mt-2 text-xs leading-6 text-zinc-400">
            Check the Supabase connection and database migration, then refresh.
          </p>
          <button
            type="button"
            onClick={refresh}
            disabled={Boolean(busy)}
            className="text-link mt-3"
          >
            Try again <RefreshCw aria-hidden="true" className="size-3" />
          </button>
        </div>
      ) : filtered.length ? (
        <div className="mt-5 space-y-4">
          {filtered.map((question) => (
            <article
              key={question.id}
              className="rounded-xl border border-white/15 bg-[#080808] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-zinc-400">
                <MessageSquare aria-hidden="true" className="mr-1 size-3" />
                <span>Anonymous</span>
                <span aria-hidden="true" className="text-zinc-700">
                  /
                </span>
                <span>{topicLabel(question.topic)}</span>
                <time dateTime={question.createdAt} className="ml-auto">
                  {questionDate(question.createdAt)}
                </time>
              </div>
              <h2 className="mt-4 text-sm leading-7 font-medium break-words whitespace-pre-wrap text-zinc-200">
                {question.question}
              </h2>
              {question.status === 'answered' && editing !== question.id && (
                <p className="mt-4 line-clamp-3 text-sm leading-7 whitespace-pre-wrap text-zinc-400">
                  {question.answer}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                {question.status !== 'archived' ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() =>
                      setEditing(editing === question.id ? null : question.id)
                    }
                    aria-expanded={editing === question.id}
                    aria-controls={`editor-${question.id}`}
                    className="text-link gap-2 text-zinc-300 disabled:opacity-50"
                  >
                    {editing === question.id
                      ? 'Close editor'
                      : question.status === 'answered'
                        ? 'Edit answer'
                        : 'Write an answer'}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-3 transition-transform ${editing === question.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => update(question.id, { action: 'restore' })}
                    className="text-link gap-2 text-zinc-300 disabled:opacity-50"
                  >
                    <CornerUpLeft aria-hidden="true" className="size-3.5" />
                    Restore to inbox
                  </button>
                )}
                {question.status !== 'archived' && (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => update(question.id, { action: 'archive' })}
                    className="text-link gap-2 disabled:opacity-50"
                  >
                    <Archive aria-hidden="true" className="size-3.5" />
                    {question.status === 'answered'
                      ? 'Unpublish & archive'
                      : 'Archive'}
                  </button>
                )}
              </div>
              <div
                id={`editor-${question.id}`}
                hidden={editing !== question.id}
                className="mt-3"
              >
                {question.status !== 'archived' && (
                  <AnswerEditor
                    key={`${question.id}:${question.updatedAt}`}
                    question={question}
                    pending={Boolean(busy)}
                    onPublish={(input) => update(question.id, input)}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="ask-empty mt-5 flex flex-col items-center rounded-xl border border-dashed border-white/10 px-6 py-12 text-center">
          <InboxIcon
            aria-hidden="true"
            className="mb-5 size-7 text-zinc-500"
            strokeWidth={1.3}
          />
          <h2 className="text-sm font-medium text-zinc-200">
            {query
              ? 'Nothing matches that search.'
              : tab === 'pending'
                ? 'All caught up.'
                : tab === 'answered'
                  ? 'Your first answer is waiting to happen.'
                  : 'Nothing tucked away.'}
          </h2>
          <p className="mt-2 max-w-xs text-xs leading-6 text-zinc-400">
            {query
              ? 'Try another word, or look in a different tab.'
              : tab === 'pending'
                ? 'New anonymous questions will appear here. There’s no rush — good answers take a little thought.'
                : tab === 'answered'
                  ? 'Published replies will appear here and on the public Q&A page.'
                  : 'Archived questions stay private. You can bring them back whenever you like.'}
          </p>
        </div>
      )}
      <SiteLink href="/ask" className="text-link mt-5">
        <ArrowLeft aria-hidden="true" className="size-3" /> Back to the
        conversation
      </SiteLink>
    </main>
  )
}
