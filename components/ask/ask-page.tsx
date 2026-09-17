'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  ChevronDown,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import {
  ASK_TOPICS,
  filterAnswers,
  QUESTION_MAX_LENGTH,
  QUESTION_MIN_LENGTH,
  topicLabel,
  type AskTopic,
  type PublicQuestion,
} from '@/lib/ask/types'
import { useHydrated } from '@/lib/use-hydrated'
import { askRequest, questionDate, requestError } from './client'
import './ask.css'

function AnswerRow({
  question,
  initiallyOpen,
}: {
  question: PublicQuestion
  initiallyOpen: boolean
}) {
  const details = useRef<HTMLDetailsElement>(null)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (
      window.location.hash === `#question-${question.id}` &&
      details.current
    ) {
      details.current.open = true
    }
  }, [question.id])
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current)
    },
    [],
  )

  async function copyLink() {
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = `question-${question.id}`
    try {
      await navigator.clipboard.writeText(url.href)
      setCopied(true)
      setCopyError(false)
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2500)
    } catch {
      window.history.replaceState(null, '', url)
      setCopyError(true)
    }
  }

  return (
    <details
      ref={details}
      id={`question-${question.id}`}
      open={initiallyOpen}
      className="ask-answer group scroll-mt-8 border-b border-white/10"
    >
      <summary className="cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden">
        <span className="mb-2 block font-mono text-[11px] text-zinc-400">
          {topicLabel(question.topic)}
        </span>
        <span className="flex items-start justify-between gap-5">
          <span className="text-[15px] leading-7 font-medium break-words text-zinc-200 transition-colors group-hover:text-white">
            {question.question}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="mt-1.5 size-3.5 shrink-0 text-zinc-400 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </span>
      </summary>
      <div className="pb-5">
        <p className="text-sm leading-7 break-words whitespace-pre-wrap text-zinc-400">
          {question.answer}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4">
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] leading-6">
            <span className="text-zinc-300">Mohammed</span>
            <span aria-hidden="true" className="text-zinc-500">
              ·
            </span>
            <time dateTime={question.answeredAt} className="text-zinc-400">
              {questionDate(question.answeredAt)}
            </time>
          </div>
          <button type="button" onClick={copyLink} className="text-link">
            <span aria-live="polite">{copied ? 'Copied' : 'Copy link'}</span>
          </button>
        </div>
        {copyError && (
          <p role="status" className="text-xs leading-6 text-zinc-400">
            The link is in your address bar, ready to copy.
          </p>
        )}
      </div>
    </details>
  )
}

export function AskPage({
  initialQuestions,
  acceptingQuestions,
  loadError: initialLoadError,
}: {
  initialQuestions: PublicQuestion[]
  acceptingQuestions: boolean
  loadError: boolean
}) {
  const hydrated = useHydrated()
  const [questions, setQuestions] = useState(initialQuestions)
  const [available, setAvailable] = useState(acceptingQuestions)
  const [loadError, setLoadError] = useState(initialLoadError)
  const [question, setQuestion] = useState('')
  const [topic, setTopic] = useState<AskTopic>('general')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<AskTopic | 'all'>('all')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)
  const successTitle = useRef<HTMLHeadingElement>(null)
  const sendingRef = useRef(false)
  const filtered = filterAnswers(questions, query, filter)

  useEffect(() => {
    if (submitted) successTitle.current?.focus({ preventScroll: true })
  }, [submitted])

  useEffect(() => {
    function openLinkedAnswer() {
      const id = window.location.hash.slice(1)
      if (!/^question-[\da-f-]{36}$/i.test(id)) return
      const answer = document.getElementById(id)
      if (answer instanceof HTMLDetailsElement) {
        answer.open = true
        answer.scrollIntoView({ block: 'start' })
      }
    }
    openLinkedAnswer()
    window.addEventListener('hashchange', openLinkedAnswer)
    return () => window.removeEventListener('hashchange', openLinkedAnswer)
  }, [questions])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sendingRef.current) return
    const form = new FormData(event.currentTarget)
    if (question.trim().length < QUESTION_MIN_LENGTH) {
      setError(`Please write at least ${QUESTION_MIN_LENGTH} characters.`)
      textarea.current?.focus()
      return
    }
    sendingRef.current = true
    setSending(true)
    setError('')
    try {
      await askRequest('/api/ask/questions', {
        method: 'POST',
        body: JSON.stringify({ question, topic, website: form.get('website') }),
      })
      setSubmitted(true)
      setQuestion('')
      setTopic('general')
    } catch (error) {
      setError(requestError(error))
    } finally {
      setSending(false)
      sendingRef.current = false
    }
  }

  async function refresh() {
    setRefreshing(true)
    try {
      const data = await askRequest<{
        questions: PublicQuestion[]
        acceptingQuestions: boolean
      }>('/api/ask/questions')
      setQuestions(data.questions)
      setAvailable(data.acceptingQuestions)
      setLoadError(false)
    } catch {
      setLoadError(true)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <main
      className="ask-page"
      aria-labelledby="ask-title"
      data-clarity-mask="true"
    >
      <section>
        <p className="section-heading">Questions & answers</p>
        <h1
          id="ask-title"
          className="mt-4 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
        >
          Ask me anything<span className="text-zinc-500">.</span>
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400 sm:text-[15px]">
          Code, career, or whatever’s on your mind. Ask away. No name needed.
        </p>
      </section>

      <section
        id="ask-question"
        aria-labelledby="question-title"
        className="mt-8 scroll-mt-8"
      >
        {submitted ? (
          <div className="border-y border-white/10 py-7">
            <h2
              ref={successTitle}
              tabIndex={-1}
              id="question-title"
              className="text-base font-medium text-zinc-200 outline-none"
            >
              Question sent.
            </h2>
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              It’s in my private inbox. If I publish an answer, it will appear
              below.
            </p>
            <button
              type="button"
              className="text-link mt-2 text-zinc-200"
              onClick={() => {
                setSubmitted(false)
                requestAnimationFrame(() => textarea.current?.focus())
              }}
            >
              Ask another question{' '}
              <ArrowUpRight aria-hidden="true" className="size-3" />
            </button>
          </div>
        ) : (
          <form
            action="/api/ask/questions"
            method="post"
            onSubmit={submit}
            className="relative"
            aria-busy={sending}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 id="question-title">
                <label
                  htmlFor="question"
                  className="text-xs font-medium text-zinc-300"
                >
                  Your question
                </label>
              </h2>
              <span
                id="question-count"
                className="font-mono text-[11px] text-zinc-400 tabular-nums"
              >
                {question.length} / {QUESTION_MAX_LENGTH.toLocaleString('en')}
              </span>
            </div>
            <textarea
              ref={textarea}
              id="question"
              name="question"
              required
              rows={3}
              minLength={QUESTION_MIN_LENGTH}
              maxLength={QUESTION_MAX_LENGTH}
              disabled={sending || !available || !hydrated}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value)
                setError('')
              }}
              placeholder="What would you like to know?"
              aria-describedby={`question-privacy question-count${error ? ' question-error' : ''}`}
              aria-invalid={Boolean(error)}
              className="ask-field mt-3 block min-h-28 resize-y"
            />
            <div className="ask-honeypot" aria-hidden="true" inert>
              <label htmlFor="question-website">Leave this field empty</label>
              <input
                id="question-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            {error && (
              <p
                id="question-error"
                role="alert"
                className="mt-3 text-xs leading-6 text-red-300"
              >
                {error}
              </p>
            )}
            {!available && (
              <p role="status" className="mt-3 text-xs leading-6 text-zinc-400">
                Questions are closed for the moment. Please check back soon.
              </p>
            )}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="relative">
                <label htmlFor="question-topic" className="sr-only">
                  Question topic
                </label>
                <select
                  id="question-topic"
                  value={topic}
                  disabled={sending || !available || !hydrated}
                  onChange={(event) => setTopic(event.target.value as AskTopic)}
                  className="ask-select"
                >
                  {ASK_TOPICS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2 text-zinc-400"
                />
              </div>
              <button
                type="submit"
                disabled={sending || !available || !hydrated}
                className="ask-primary"
              >
                {sending ? 'Sending' : 'Send question'}
                {sending ? (
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-3.5 animate-spin"
                  />
                ) : (
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                )}
              </button>
            </div>
          </form>
        )}
        <noscript>
          <p className="mt-3 text-xs leading-6 text-zinc-400">
            Enable JavaScript to send a question. You can still read the
            published answers below.
          </p>
        </noscript>
        {!submitted && (
          <p
            id="question-privacy"
            className="mt-3 text-xs leading-6 text-zinc-400"
          >
            No name or email. Questions stay private until I publish a reply.
          </p>
        )}
      </section>

      <section
        id="answers"
        aria-labelledby="answers-title"
        className="mt-12 scroll-mt-8 sm:mt-14"
      >
        <div className="flex min-h-10 items-center justify-between gap-4 border-b border-white/10 pb-3">
          <div className="flex items-baseline gap-3">
            <h2 id="answers-title" className="section-heading">
              Answers
            </h2>
            <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
              {questions.length}
            </span>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            aria-label="Refresh answers"
            className="-my-2 flex size-11 items-center justify-center text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
        {questions.length > 0 && (
          <div className="flex items-center gap-3 border-b border-white/10 py-2">
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-0 size-3.5 -translate-y-1/2 text-zinc-400"
              />
              <label htmlFor="answer-search" className="sr-only">
                Search answered questions
              </label>
              <input
                id="answer-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                maxLength={160}
                autoComplete="off"
                placeholder="Search answers"
                className="ask-search h-11 w-full bg-transparent pr-10 pl-6 text-base text-zinc-200 placeholder:text-zinc-400 sm:text-xs"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery('')}
                  className="absolute top-0 right-0 flex h-11 w-10 items-center justify-center text-zinc-400"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              )}
            </div>
            <div className="relative shrink-0">
              <label htmlFor="answer-topic" className="sr-only">
                Filter answers by topic
              </label>
              <select
                id="answer-topic"
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as AskTopic | 'all')
                }
                className="h-11 max-w-32 appearance-none bg-black pr-5 pl-2 text-xs text-zinc-400"
              >
                <option value="all">All topics</option>
                {ASK_TOPICS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 size-3 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>
        )}
        <p className="sr-only" role="status">
          {filtered.length} answered{' '}
          {filtered.length === 1 ? 'question' : 'questions'} found.
        </p>
        {loadError ? (
          <div className="py-7">
            <p className="text-sm text-zinc-300">Answers couldn’t load.</p>
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="text-link mt-1"
            >
              Try again{' '}
              <RefreshCw
                aria-hidden="true"
                className={`size-3 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        ) : filtered.length ? (
          <div>
            {filtered.map((item, index) => (
              <AnswerRow
                key={item.id}
                question={item}
                initiallyOpen={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="py-7">
            <h3 className="text-sm text-zinc-300">
              {questions.length
                ? 'No matching answers.'
                : 'No answers published yet.'}
            </h3>
            {questions.length ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
                className="text-link mt-1"
              >
                Clear filters <X aria-hidden="true" className="size-3" />
              </button>
            ) : (
              <p className="mt-2 text-xs leading-6 text-zinc-400">
                Replies will appear here as I answer your questions.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
