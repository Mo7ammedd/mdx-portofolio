'use client'

import { useId, useMemo, useState } from 'react'
import { ArrowRight, Route } from 'lucide-react'
import { matchNginxLocation, nginxLocations } from '@/lib/nginx-routing'
import { useHydrated } from '@/lib/use-hydrated'

const examples = [
  { label: 'Exact', url: '/health?check=ready' },
  { label: 'Protected prefix', url: '/assets/logo.svg' },
  { label: 'Regex override', url: '/api/users.css' },
  { label: 'First regex', url: '/api/v2/users.css' },
  { label: 'Normalized path', url: '/assets//icons/../logo%2Esvg' },
]

export function NginxRoutingDemo() {
  const id = useId()
  const ready = useHydrated()
  const [url, setUrl] = useState('/assets/logo.svg')
  const [protectAssets, setProtectAssets] = useState(true)
  const rules = nginxLocations(protectAssets)
  const { match, error } = useMemo(() => {
    try {
      return { match: matchNginxLocation(url, protectAssets), error: '' }
    } catch (error) {
      return {
        match: null,
        error:
          error instanceof Error
            ? error.message
            : 'Enter a valid request path.',
      }
    }
  }, [url, protectAssets])
  return (
    <section
      data-nginx-demo
      aria-labelledby={`${id}-title`}
      className="not-prose my-8 overflow-hidden rounded-xl border border-white/15 bg-white/[0.015]"
    >
      <div className="border-b border-white/10 p-5 sm:p-6">
        <p className="section-heading mb-2">Interactive example</p>
        <h4 id={`${id}-title`} className="text-base font-medium text-zinc-100">
          Which Nginx location handles this URL?
        </h4>
        <p className="mt-2 text-sm leading-7 text-zinc-400">
          Change the request path, then follow the matching decision. Toggle the
          asset prefix to see when regex rules take over.
        </p>
        <label
          htmlFor={`${id}-url`}
          className="mt-5 mb-2 block text-xs text-zinc-400"
        >
          Request URL or path
        </label>
        <input
          id={`${id}-url`}
          type="text"
          value={url}
          disabled={!ready}
          maxLength={2048}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          onChange={(event) => setUrl(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={`${id}-result`}
          className="h-12 w-full min-w-0 rounded-md border border-white/15 bg-black px-3 font-mono text-base text-zinc-200 disabled:opacity-60"
        />
        <div
          aria-label="Example requests"
          className="mt-3 flex flex-wrap gap-2"
        >
          {examples.map((example) => (
            <button
              key={example.label}
              type="button"
              disabled={!ready}
              onClick={() => setUrl(example.url)}
              className="min-h-10 rounded-md border border-white/10 px-3 text-xs text-zinc-400 hover:border-white/25 hover:text-zinc-200 disabled:opacity-50"
            >
              {example.label}
            </button>
          ))}
        </div>
        <label className="mt-4 flex min-h-10 cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-300">
          <input
            type="checkbox"
            checked={protectAssets}
            disabled={!ready}
            onChange={(event) => setProtectAssets(event.target.checked)}
            className="mt-1.5 accent-sky-300"
          />
          <span>
            Use <code className="font-mono text-sky-200">^~</code> for{' '}
            <code className="font-mono">/assets/</code>
          </span>
        </label>
      </div>
      <div
        id={`${id}-result`}
        role="status"
        aria-atomic="true"
        className="border-b border-white/10 px-5 py-4 sm:px-6"
      >
        {match ? (
          <>
            <p className="mb-2 text-xs text-zinc-400">
              Matched location · {match.winner.label}
            </p>
            <p className="flex items-start gap-2 font-mono text-sm leading-6 break-words text-sky-200">
              <Route aria-hidden="true" className="mt-1 size-4 shrink-0" />
              <span data-nginx-winner={match.winner.id}>
                location {match.winner.modifier} {match.winner.pattern}
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm leading-6 text-amber-200">{error}</p>
        )}
      </div>
      <div className="p-5 sm:p-6">
        <p className="section-heading mb-3">Locations in declaration order</p>
        <ol aria-label="Location rules" className="space-y-2">
          {rules.map((rule) => (
            <li
              key={rule.id}
              aria-current={match?.winner.id === rule.id ? 'true' : undefined}
              className={`flex items-start gap-2 rounded-md border px-3 py-2 font-mono text-xs leading-6 ${match?.winner.id === rule.id ? 'border-sky-300/30 bg-sky-300/5 text-sky-200' : 'border-transparent text-zinc-400'}`}
            >
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
                location {rule.modifier} {rule.pattern}
              </span>
              {match?.winner.id === rule.id && (
                <ArrowRight
                  aria-hidden="true"
                  className="mt-1 size-3.5 shrink-0"
                />
              )}
            </li>
          ))}
        </ol>
        {match && (
          <>
            <p className="section-heading mt-6 mb-4">Decision trace</p>
            <ol aria-label="Matching decisions" className="space-y-4">
              {match.trace.map((step, index) => (
                <li key={step.label} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 font-mono text-xs text-zinc-500"
                  >
                    {index + 1}.
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm leading-6 break-words text-zinc-200">
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs leading-6 [overflow-wrap:anywhere] text-zinc-400">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-xs leading-6 text-zinc-400 sm:px-6">
        <p>
          Models flat locations on a case-sensitive server, with default slash
          merging and no rewrites. Regexes use declaration order;{' '}
          <code>~*</code> adds case-insensitive matching.
        </p>
        <a
          href="https://nginx.org/en/docs/http/ngx_http_core_module.html#location"
          className="text-link mt-2 underline decoration-zinc-700 underline-offset-4"
        >
          Nginx location documentation
        </a>
        <noscript>
          <p className="mt-2">
            The example above shows /assets/logo.svg matching ^~ /assets/.
            Enable JavaScript to change the request or compare rules.
          </p>
        </noscript>
      </div>
    </section>
  )
}
