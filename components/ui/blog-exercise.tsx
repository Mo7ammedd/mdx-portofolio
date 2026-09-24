'use client'

import { useId, useRef, useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { blogExercises } from '@/lib/blog-exercises.mjs'
import { useHydrated } from '@/lib/use-hydrated'

export function BlogExercise({ id }: { id: string }) {
  const formId = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [selected, setSelected] = useState('')
  const [submitted, setSubmitted] = useState('')
  const ready = useHydrated()
  const exercise = blogExercises[id]
  if (!exercise) return null
  const answer = exercise.options.find(
    (option) => option.id === exercise.answer,
  )!
  const chosen = exercise.options.find((option) => option.id === submitted)
  const correct = submitted === exercise.answer
  return (
    <section
      data-exercise={id}
      aria-labelledby={`${formId}-title`}
      className="not-prose my-8 overflow-hidden rounded-xl border border-white/15 bg-white/[0.015]"
    >
      <div className="p-5 sm:p-6">
        <p className="section-heading mb-2">Try it yourself · optional</p>
        <h4
          id={`${formId}-title`}
          className="text-base font-medium text-zinc-100"
        >
          {exercise.title}
        </h4>
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault()
            if (selected) setSubmitted(selected)
          }}
        >
          <fieldset className="mt-3 min-w-0" disabled={!ready}>
            <legend className="mb-4 text-sm leading-7 text-zinc-300">
              {exercise.question}
            </legend>
            {exercise.code && (
              <pre
                tabIndex={0}
                role="region"
                aria-label="Exercise code example"
                className="mb-5 overflow-x-auto rounded-md border border-white/10 bg-black p-4 text-sm leading-6 text-zinc-300"
              >
                <code className="p-0">{exercise.code}</code>
              </pre>
            )}
            <div className="space-y-2">
              {exercise.options.map((option, index) => (
                <label
                  key={option.id}
                  className="flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-white/10 px-3 py-3 text-sm leading-6 text-zinc-300 has-checked:border-sky-300/40 has-checked:bg-sky-300/5 has-focus-visible:outline-2 has-focus-visible:outline-zinc-400"
                >
                  <input
                    type="radio"
                    name={`${formId}-choice`}
                    value={option.id}
                    checked={selected === option.id}
                    onChange={() => {
                      setSelected(option.id)
                      setSubmitted('')
                    }}
                    className="mt-1.5 shrink-0 accent-sky-300"
                  />
                  <span>
                    <span className="mr-2 font-mono text-xs text-zinc-500">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              disabled={!selected}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-zinc-100 px-4 text-xs font-medium text-zinc-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check aria-hidden="true" className="size-3.5" />
              Check answer
            </button>
          </fieldset>
        </form>
      </div>
      <div role="status" aria-atomic="true">
        {chosen && (
          <div className="border-t border-white/10 px-5 py-4 sm:px-6">
            <p
              className={`text-sm font-medium ${correct ? 'text-emerald-200' : 'text-amber-200'}`}
            >
              {correct ? 'Correct.' : 'Not quite.'}
            </p>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              {chosen.explanation}
            </p>
            {!correct && (
              <p className="mt-2 text-sm leading-7 text-zinc-300">
                Answer: {answer.text}.
              </p>
            )}
            <p className="mt-2 text-sm leading-7 text-zinc-400">
              {exercise.explanation}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  setSelected('')
                  setSubmitted('')
                  formRef.current
                    ?.querySelector<HTMLInputElement>('input[type="radio"]')
                    ?.focus({ preventScroll: true })
                }}
                className="text-link"
              >
                <RotateCcw aria-hidden="true" className="size-3" />
                Try again
              </button>
              <a
                href={exercise.review}
                className="text-link underline decoration-zinc-700 underline-offset-4"
              >
                Revisit the explanation
              </a>
            </div>
          </div>
        )}
      </div>
      <noscript>
        <details className="border-t border-white/10 px-5 py-4">
          <summary className="cursor-pointer text-sm text-zinc-200">
            Show the answer and explanation
          </summary>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            Answer: {answer.text}. {answer.explanation} {exercise.explanation}
          </p>
        </details>
      </noscript>
    </section>
  )
}
