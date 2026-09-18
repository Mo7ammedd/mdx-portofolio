'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CornerUpLeft,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCw,
  Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SiteLink } from '@/components/site-link'
import { getQuestionHref } from '@/lib/ask/routing'
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
        className="text-[13px] font-medium text-zinc-300"
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
        placeholder="Write your answer…"
        className="field-control mt-3 min-h-44 resize-y"
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
            className="field-control field-select"
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
          className="button-primary"
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
  initialQuestionId,
  notificationsEnabled,
  loadError: initialLoadError,
}: {
  initialQuestions: Question[]
  initialQuestionId?: string
  notificationsEnabled: boolean
  loadError: boolean
}) {
  const router = useRouter()
  const linkedQuestion = initialQuestions.find(
    (question) => question.id === initialQuestionId,
  )
  const [questions, setQuestions] = useState(initialQuestions)
  const [tab, setTab] = useState<QuestionStatus>(
    linkedQuestion?.status ?? 'pending',
  )
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<string | null>(
    linkedQuestion && linkedQuestion.status !== 'archived'
      ? linkedQuestion.id
      : null,
  )
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [publishedId, setPublishedId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(initialLoadError)
  const [expired, setExpired] = useState(false)
  const busyRef = useRef(false)
  const awaitingReply = questions.filter(
    (question) => question.status === 'pending',
  ).length
  const filtered = questions.filter(
    (question) =>
      question.status === tab &&
      `${question.question} ${question.answer ?? ''}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  )

  useEffect(() => {
    if (linkedQuestion)
      document
        .getElementById(`inbox-question-${linkedQuestion.id}`)
        ?.scrollIntoView({ block: 'start' })
  }, [linkedQuestion])

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
      className="ask-inbox"
      aria-labelledby="inbox-title"
      data-clarity-mask="true"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="section-heading">Private Q&A</p>
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
      <h1 id="inbox-title" className="page-title mt-4">
        Inbox<span className="text-zinc-500">.</span>
      </h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
        <p className="body-copy">
          {awaitingReply
            ? `${awaitingReply} ${awaitingReply === 1 ? 'question' : 'questions'} waiting for a reply.`
            : 'You’re all caught up.'}
        </p>
        {notificationsEnabled && (
          <p className="flex items-center gap-2 text-[11px] text-zinc-400">
            <Mail aria-hidden="true" className="size-3.5" /> Email alerts on
          </p>
        )}
      </div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-2 border-b border-white/10">
        <div
          role="group"
          aria-label="Question status"
          className="flex flex-wrap gap-5"
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
              className={`-mb-px inline-flex min-h-11 items-center gap-2 border-b text-xs transition-colors disabled:opacity-50 ${tab === item.value ? 'border-zinc-300 text-zinc-100' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
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
          className="icon-button"
        >
          <RefreshCw
            aria-hidden="true"
            className={`size-3.5 ${busy === 'refresh' ? 'animate-spin' : ''}`}
          />
        </button>
      </div>
      {questions.length > 0 && (
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
            className="field-control pl-10"
          />
        </div>
      )}
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
              href={getQuestionHref(publishedId)}
              className="inline-flex items-center gap-1 underline underline-offset-4"
            >
              View answer <ArrowUpRight aria-hidden="true" className="size-3" />
            </SiteLink>
          )}
        </div>
      )}
      {loadError ? (
        <div className="py-7">
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
        <div className="divide-y divide-white/10">
          {filtered.map((question) => (
            <article
              key={question.id}
              id={`inbox-question-${question.id}`}
              className="scroll-mt-8 py-6"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-zinc-400">
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
        <div className="py-7">
          <h2 className="text-sm text-zinc-300">
            {query
              ? 'Nothing matches that search.'
              : tab === 'pending'
                ? 'No new questions.'
                : tab === 'answered'
                  ? 'No published answers.'
                  : 'No archived questions.'}
          </h2>
          <p className="mt-2 text-xs leading-6 text-zinc-400">
            {query
              ? 'Try another word, or look in a different tab.'
              : tab === 'pending'
                ? 'New anonymous questions will appear here.'
                : tab === 'answered'
                  ? 'Published replies will appear here and on the public Q&A page.'
                  : 'Archived questions stay private. You can restore them to the inbox.'}
          </p>
        </div>
      )}
      <SiteLink href="/ask" className="text-link mt-5">
        <ArrowLeft aria-hidden="true" className="size-3" /> Back to questions
      </SiteLink>
    </main>
  )
}
