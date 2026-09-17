'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  CornerDownRight,
  Link2,
  LoaderCircle,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
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
import { askRequest, questionDate, requestError } from './client'
import { useHydrated } from '@/lib/use-hydrated'
import './ask.css'

const prompts: { label: string; question: string; topic: AskTopic }[] = [
  {
    label: 'Getting started',
    question:
      'What would you focus on first if you were learning backend development today?',
    topic: 'career',
  },
  {
    label: 'Under the hood',
    question:
      'What did building your own storage engine teach you about databases?',
    topic: 'databases',
  },
  {
    label: 'Your process',
    question:
      'How do you approach a system design problem before writing any code?',
    topic: 'backend',
  },
]

function ConversationMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 112 112"
      className="ask-mark hidden size-28 shrink-0 sm:block"
      fill="none"
    >
      <circle
        cx="56"
        cy="56"
        r="54"
        stroke="currentColor"
        strokeDasharray="2 6"
        className="text-zinc-800"
      />
      <path
        d="M44 49h40a8 8 0 0 1 8 8v21a8 8 0 0 1-8 8h-5v10L66 86H44a8 8 0 0 1-8-8V57a8 8 0 0 1 8-8Z"
        fill="#080808"
        stroke="#3f3f46"
      />
      <path
        d="M27 22h39a9 9 0 0 1 9 9v24a9 9 0 0 1-9 9H45L31 75V64h-4a9 9 0 0 1-9-9V31a9 9 0 0 1 9-9Z"
        fill="#0c0c0c"
        stroke="#71717a"
      />
      <path
        d="M41 37a6 6 0 1 1 10 4.5c-2 1.5-4 2-4 5"
        stroke="#e4e4e7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="47" cy="52" r="1" fill="#e4e4e7" />
      <path
        d="m60 73 4 4 9-10"
        stroke="#a1a1aa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="26" r="3" fill="#a1a1aa" />
    </svg>
  )
}

function AnswerCard({ question }: { question: PublicQuestion }) {
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
      className="ask-answer group scroll-mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#060606] transition-colors open:border-white/20 hover:border-white/20"
    >
      <summary className="cursor-pointer list-none p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="mb-3 flex items-center gap-2 font-mono text-[10px] text-zinc-400">
          <span
            className="size-1 rounded-full bg-zinc-500"
            aria-hidden="true"
          />
          Anonymous
          <span aria-hidden="true" className="text-zinc-700">
            /
          </span>
          {topicLabel(question.topic)}
        </span>
        <span className="flex items-start justify-between gap-5">
          <span className="text-[15px] leading-7 font-medium break-words text-zinc-100 sm:text-base">
            {question.question}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="mt-1.5 size-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
          />
        </span>
      </summary>
      <div className="ask-answer-body border-t border-white/[0.07] px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="my-5 flex items-center gap-2.5">
          <Image
            src="/avatar.jpg"
            alt=""
            width={26}
            height={26}
            className="size-[26px] rounded-full grayscale"
          />
          <span className="text-xs font-medium text-zinc-300">Mohammed</span>
          <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] text-zinc-400">
            AUTHOR
          </span>
        </div>
        <p className="text-sm leading-7 break-words whitespace-pre-wrap text-zinc-400">
          {question.answer}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 border-t border-white/[0.06] pt-3">
          <time
            dateTime={question.answeredAt}
            className="font-mono text-[10px] text-zinc-400"
          >
            {questionDate(question.answeredAt)}
          </time>
          <button type="button" onClick={copyLink} className="text-link gap-2">
            {copied ? (
              <Check aria-hidden="true" className="size-3" />
            ) : (
              <Link2 aria-hidden="true" className="size-3" />
            )}
            <span aria-live="polite">
              {copied ? 'Link copied' : 'Share answer'}
            </span>
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
      setError(
        `A little more detail, please — at least ${QUESTION_MIN_LENGTH} characters.`,
      )
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
      <section className="ask-enter">
        <p className="section-heading flex items-center gap-2.5">
          <span className="h-px w-5 bg-zinc-500" aria-hidden="true" />
          Questions & answers
        </p>
        <div className="mt-5 flex items-center justify-between gap-6">
          <h1
            id="ask-title"
            className="text-[2.4rem] leading-[1.13] font-medium tracking-[-0.05em] text-zinc-100 sm:text-5xl"
          >
            Good questions.
            <br />
            <span className="text-zinc-500">Honest answers.</span>
          </h1>
          <ConversationMark />
        </div>
        <p className="mt-5 max-w-[29rem] text-sm leading-7 text-zinc-400 sm:text-[15px]">
          On building software, figuring things out, and everything in between.
          Leave a question. I’ll share what I know.
        </p>
        <div className="mt-5 flex items-center gap-2.5 text-xs text-zinc-400">
          <Image
            src="/avatar.jpg"
            alt=""
            width={22}
            height={22}
            className="size-[22px] rounded-full grayscale"
          />
          <span>
            A conversation with <span className="text-zinc-200">Mohammed</span>
          </span>
        </div>
      </section>

      <section
        id="ask-question"
        aria-labelledby="question-title"
        className="ask-enter mt-9 scroll-mt-8 [animation-delay:70ms]"
      >
        <div className="ask-composer relative overflow-hidden rounded-xl border border-white/15 bg-[#080808] transition-colors focus-within:border-white/35">
          {submitted ? (
            <div className="ask-enter flex min-h-[300px] flex-col items-center justify-center px-6 py-8 text-center">
              <span className="mb-5 flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.03]">
                <Check
                  aria-hidden="true"
                  className="size-5 text-zinc-200"
                  strokeWidth={1.5}
                />
              </span>
              <h2
                ref={successTitle}
                tabIndex={-1}
                id="question-title"
                className="text-xl font-medium tracking-tight text-zinc-100 outline-none"
              >
                Your question is in.
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-400">
                It’s in my private inbox. If I publish an answer, you’ll find it
                below.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-x-5">
                <button
                  type="button"
                  className="text-link text-zinc-200"
                  onClick={() => {
                    setSubmitted(false)
                    requestAnimationFrame(() => textarea.current?.focus())
                  }}
                >
                  Ask another{' '}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </button>
                <a href="#answers" className="text-link">
                  Browse answers{' '}
                  <ArrowDown aria-hidden="true" className="size-3" />
                </a>
              </div>
            </div>
          ) : (
            <form
              action="/api/ask/questions"
              method="post"
              onSubmit={submit}
              className="relative"
              aria-busy={sending}
            >
              <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
                <h2 id="question-title">
                  <label
                    htmlFor="question"
                    className="text-sm font-medium text-zinc-200"
                  >
                    What’s on your mind?
                  </label>
                </h2>
                <MessageSquare
                  aria-hidden="true"
                  className="size-4 text-zinc-500"
                  strokeWidth={1.5}
                />
              </div>
              <textarea
                ref={textarea}
                id="question"
                name="question"
                required
                minLength={QUESTION_MIN_LENGTH}
                maxLength={QUESTION_MAX_LENGTH}
                disabled={sending || !available || !hydrated}
                value={question}
                onChange={(event) => {
                  setQuestion(event.target.value)
                  setError('')
                }}
                placeholder="Something you’re stuck on. Something you’re curious about. There’s no perfect question."
                aria-describedby={`question-privacy question-count${error ? ' question-error' : ''}`}
                aria-invalid={Boolean(error)}
                className="ask-question-input mx-5 mt-4 block min-h-32 w-[calc(100%-2.5rem)] resize-y rounded-sm bg-transparent py-1 text-base leading-7 text-zinc-200 placeholder:text-zinc-400 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-50 sm:mx-6 sm:w-[calc(100%-3rem)] sm:text-sm"
              />
              <div className="flex items-center justify-between gap-4 px-5 pt-3 pb-4 sm:px-6">
                <div className="relative">
                  <label htmlFor="question-topic" className="sr-only">
                    Question topic
                  </label>
                  <select
                    id="question-topic"
                    value={topic}
                    disabled={sending || !available || !hydrated}
                    onChange={(event) =>
                      setTopic(event.target.value as AskTopic)
                    }
                    className="ask-select min-h-10 appearance-none rounded-md border border-white/10 bg-black py-2 pr-8 pl-3 font-mono text-[11px] text-zinc-300 disabled:opacity-50"
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
                <span
                  id="question-count"
                  className={`font-mono text-[10px] tabular-nums ${question.length > 950 ? 'text-zinc-200' : 'text-zinc-400'}`}
                >
                  {question.length}{' '}
                  <span className="text-zinc-400">/ {QUESTION_MAX_LENGTH}</span>
                </span>
              </div>
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
                  className="px-5 pb-4 text-xs leading-6 text-red-300 sm:px-6"
                >
                  {error}
                </p>
              )}
              {!available && (
                <p
                  role="status"
                  className="px-5 pb-4 text-xs leading-6 text-zinc-400 sm:px-6"
                >
                  Questions are closed for the moment. Please check back soon.
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] bg-white/[0.015] px-5 py-4 sm:px-6">
                <span className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <ShieldCheck aria-hidden="true" className="size-3.5" />
                  Anonymous question
                </span>
                <button
                  type="submit"
                  disabled={sending || !available || !hydrated}
                  className="ask-primary min-w-36"
                >
                  {sending ? (
                    <>
                      Sending{' '}
                      <LoaderCircle
                        aria-hidden="true"
                        className="size-3.5 animate-spin"
                      />
                    </>
                  ) : (
                    <>
                      Send question{' '}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        <noscript>
          <p className="mt-3 text-xs leading-6 text-zinc-400">
            Enable JavaScript to send a question. You can still read the
            published answers below.
          </p>
        </noscript>
        <p
          id="question-privacy"
          className="mt-3 text-center text-[11px] leading-6 text-zinc-400"
        >
          No name or email needed. Questions stay private until I publish an
          answer.
        </p>
        {!submitted && !question && available && (
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="mr-1 text-[11px] text-zinc-400">
              Need a starting point?
            </span>
            {prompts.map((prompt) => (
              <button
                key={prompt.label}
                type="button"
                onClick={() => {
                  setQuestion(prompt.question)
                  setTopic(prompt.topic)
                  setError('')
                  textarea.current?.focus()
                }}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-[11px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
              >
                <CornerDownRight
                  aria-hidden="true"
                  className="size-3 text-zinc-600"
                />
                {prompt.label}
              </button>
            ))}
          </div>
        )}
      </section>

      <section
        id="answers"
        aria-labelledby="answers-title"
        className="ask-enter mt-12 scroll-mt-8 [animation-delay:140ms] sm:mt-14"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 id="answers-title" className="section-heading">
              The conversation
            </h2>
            <span className="font-mono text-[11px] text-zinc-400 tabular-nums">
              {String(questions.length).padStart(2, '0')}
            </span>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            aria-label="Refresh answers"
            className="flex size-11 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200 disabled:opacity-50"
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
        <div className="relative mt-4">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500"
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
            placeholder="Search questions and answers…"
            className="ask-search h-12 w-full rounded-lg border border-white/10 bg-[#060606] pr-11 pl-10 text-base text-zinc-200 placeholder:text-xs placeholder:text-zinc-400 sm:text-sm"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute top-0 right-0 flex size-12 items-center justify-center rounded-md text-zinc-400"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>
        <div
          role="group"
          aria-label="Filter answers by topic"
          className="mt-3 flex flex-wrap gap-1"
        >
          {[{ value: 'all', label: 'All questions' }, ...ASK_TOPICS].map(
            (item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value as AskTopic | 'all')}
                className={`min-h-10 rounded-md px-3 text-[11px] transition-colors ${filter === item.value ? 'bg-white/[0.09] text-zinc-100' : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'}`}
              >
                {item.label}
              </button>
            ),
          )}
        </div>
        <p className="sr-only" role="status">
          {filtered.length} answered{' '}
          {filtered.length === 1 ? 'question' : 'questions'} found.
        </p>
        {loadError ? (
          <div className="mt-5 rounded-xl border border-dashed border-white/15 px-6 py-10 text-center">
            <p className="text-sm text-zinc-300">
              The conversation couldn’t load.
            </p>
            <p className="mt-2 text-xs leading-6 text-zinc-400">
              Give it a moment, then try refreshing the answers.
            </p>
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="text-link mt-3"
            >
              Try again{' '}
              <RefreshCw
                aria-hidden="true"
                className={`size-3 ${refreshing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        ) : filtered.length ? (
          <div className="mt-5 space-y-3">
            {filtered.map((item) => (
              <AnswerCard key={item.id} question={item} />
            ))}
          </div>
        ) : (
          <div className="ask-empty mt-5 flex flex-col items-center rounded-xl border border-dashed border-white/10 px-6 py-10 text-center sm:py-12">
            <div className="relative mb-5 flex size-12 items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a]">
              <MessageCircle
                aria-hidden="true"
                className="size-5 text-zinc-400"
                strokeWidth={1.5}
              />
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 size-2 rounded-full border-2 border-black bg-zinc-400"
              />
            </div>
            <h3 className="text-sm font-medium text-zinc-200">
              {questions.length
                ? 'No questions found. Yet.'
                : 'Every good conversation starts somewhere.'}
            </h3>
            <p className="mt-2 max-w-xs text-xs leading-6 text-zinc-400">
              {questions.length
                ? 'Try another keyword or topic. Or send in the question you were hoping to find.'
                : 'Be the first to ask. Once I’ve answered, the question and reply will appear right here.'}
            </p>
            {questions.length ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
                className="text-link mt-3 text-zinc-300"
              >
                Clear filters <X aria-hidden="true" className="size-3" />
              </button>
            ) : (
              <a
                href="#ask-question"
                onClick={() => textarea.current?.focus({ preventScroll: true })}
                className="text-link mt-3 text-zinc-300"
              >
                Start the conversation{' '}
                <ArrowUpRight aria-hidden="true" className="size-3" />
              </a>
            )}
          </div>
        )}
        <div className="mt-6 flex items-start gap-2.5 text-[11px] leading-6 text-zinc-400">
          <MessageSquare
            aria-hidden="true"
            className="mt-1.5 size-3 shrink-0"
          />
          <p>
            A small space for thoughtful questions. Be curious, be kind, and
            leave personal details out of anything you’d like answered publicly.
          </p>
        </div>
      </section>
    </main>
  )
}
