'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { SiteLink } from '@/components/site-link'
import { getQuestionHref } from '@/lib/ask/routing'
import type { PublicQuestion } from '@/lib/ask/types'
import { questionDate } from './client'

export function RecentAnswer() {
  const [question, setQuestion] = useState<PublicQuestion | null>(null)

  useEffect(() => {
    let active = true
    let request: AbortController | null = null

    async function refresh() {
      request?.abort()
      const current = new AbortController()
      request = current
      const timeout = setTimeout(() => current.abort(), 10_000)
      try {
        // This public endpoint already excludes drafts and archived questions.
        // Loading separately keeps the homepage static and independent of Ask.
        const response = await fetch('/api/ask/questions', {
          cache: 'no-store',
          signal: current.signal,
        })
        if (!response.ok) throw new Error('Answers unavailable')
        const data: { questions: PublicQuestion[] } = await response.json()
        if (active && request === current) {
          setQuestion(data.questions[0] ?? null)
        }
      } catch {
        if (active && request === current) setQuestion(null)
      } finally {
        clearTimeout(timeout)
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') void refresh()
    }

    void refresh()
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      active = false
      request?.abort()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <section aria-labelledby="home-ask-title">
      <div className="section-header">
        <h2 id="home-ask-title" className="section-heading">
          From Ask
        </h2>
        <SiteLink
          href="/ask#ask-question"
          className="text-link -my-2 text-zinc-200"
        >
          Ask me something
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </SiteLink>
      </div>
      <div className="min-h-52 pt-5">
        {question ? (
          <article aria-labelledby="home-question-title">
            <h3 id="home-question-title" dir="auto" className="item-title">
              <SiteLink
                href={getQuestionHref(question.id)}
                className="line-clamp-2 break-words transition-colors hover:text-white"
              >
                {question.question}
              </SiteLink>
            </h3>
            <p
              dir="auto"
              className="body-copy mt-3 line-clamp-3 border-s border-white/15 ps-4 break-words whitespace-pre-line text-zinc-300"
            >
              {question.answer}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4">
              <time dateTime={question.answeredAt} className="meta-text">
                {questionDate(question.answeredAt)}
              </time>
              <SiteLink
                href={getQuestionHref(question.id)}
                className="text-link"
              >
                Read answer
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </SiteLink>
            </div>
          </article>
        ) : (
          <div>
            <p className="body-copy">
              Something on your mind? You can ask anonymously.
            </p>
            <SiteLink href="/ask" className="text-link mt-2">
              Visit the Q&amp;A
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </SiteLink>
          </div>
        )}
      </div>
    </section>
  )
}
