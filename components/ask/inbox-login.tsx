'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
} from 'lucide-react'
import { askRequest, requestError } from './client'
import { SiteLink } from '@/components/site-link'
import { useHydrated } from '@/lib/use-hydrated'
import './ask.css'

export function InboxLogin({ configured }: { configured: boolean }) {
  const hydrated = useHydrated()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    try {
      await askRequest('/api/ask/session', {
        method: 'POST',
        body: JSON.stringify({ password }),
      })
      setPassword('')
      router.refresh()
    } catch (error) {
      setError(requestError(error))
    } finally {
      setPending(false)
    }
  }

  return (
    <main
      className="ask-inbox ask-enter"
      aria-labelledby="inbox-title"
      data-clarity-mask="true"
    >
      <p className="section-heading flex items-center gap-2">
        <LockKeyhole aria-hidden="true" className="size-3" /> Private inbox
      </p>
      <h1
        id="inbox-title"
        className="mt-5 text-[2rem] leading-tight font-medium tracking-[-0.045em] text-zinc-100 sm:text-[2.75rem]"
      >
        Your side of
        <br />
        <span className="text-zinc-500">the conversation.</span>
      </h1>
      <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
        A quiet place to read questions, collect your thoughts, and send an
        answer out into the world.
      </p>
      <form
        action="/api/ask/session"
        method="post"
        onSubmit={submit}
        className="mt-8 rounded-xl border border-white/15 bg-[#080808] p-5 sm:p-6"
        aria-busy={pending}
      >
        <div className="mb-5 flex size-10 items-center justify-center rounded-lg border border-white/10">
          <LockKeyhole
            aria-hidden="true"
            className="size-4 text-zinc-400"
            strokeWidth={1.5}
          />
        </div>
        {configured ? (
          <>
            <label
              htmlFor="inbox-password"
              className="text-sm font-medium text-zinc-200"
            >
              Inbox password
            </label>
            <div className="relative mt-3">
              <input
                id="inbox-password"
                name="password"
                type={visible ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                maxLength={256}
                disabled={pending || !hydrated}
                aria-describedby={error ? 'login-error' : undefined}
                className="ask-field pr-12"
                placeholder="Your private inbox password"
              />
              <button
                type="button"
                aria-label={visible ? 'Hide password' : 'Show password'}
                onClick={() => setVisible(!visible)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-200"
              >
                {visible ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
            {error && (
              <p
                id="login-error"
                role="alert"
                className="mt-3 text-xs leading-6 text-red-300"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending || !password || !hydrated}
              className="ask-primary mt-5 w-full"
            >
              {pending ? (
                <>
                  Opening inbox{' '}
                  <LoaderCircle
                    aria-hidden="true"
                    className="size-3.5 animate-spin"
                  />
                </>
              ) : (
                <>
                  Open inbox{' '}
                  <ArrowUpRight aria-hidden="true" className="size-3.5" />
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[11px] leading-6 text-zinc-400">
              For Mohammed only. Visitors can ask without signing in.
            </p>
          </>
        ) : (
          <div className="space-y-3 text-sm leading-7 text-zinc-400">
            <h2 className="font-medium text-zinc-200">
              Set up your inbox first.
            </h2>
            <p>
              Set a server-only{' '}
              <code className="font-mono text-xs text-zinc-200">
                ASK_ADMIN_PASSWORD
              </code>{' '}
              of at least 16 characters. For local development, run{' '}
              <code className="font-mono text-xs text-zinc-200">
                node scripts/setup-ask.mjs
              </code>{' '}
              and restart the server.
            </p>
            <p className="text-xs">
              The Supabase and Vercel setup is in{' '}
              <code className="font-mono">docs/ask-setup.md</code>.
            </p>
          </div>
        )}
      </form>
      <noscript>
        <p className="mt-3 text-xs leading-6 text-zinc-400">
          Enable JavaScript to sign in to the private inbox.
        </p>
      </noscript>
      <SiteLink href="/ask" className="text-link mt-5">
        <ArrowLeft aria-hidden="true" className="size-3" /> Back to the
        conversation
      </SiteLink>
    </main>
  )
}
