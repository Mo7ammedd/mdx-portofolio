'use client'

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'

import { cn } from '@/lib/utils'

const LANGUAGE_LABELS: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  csharp: 'C#',
  cs: 'C#',
  bash: 'Bash',
  sh: 'Shell',
  json: 'JSON',
  sql: 'SQL',
  html: 'HTML',
  css: 'CSS',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  yaml: 'YAML',
  dockerfile: 'Dockerfile',
  plaintext: 'Text',
  text: 'Text',
  xml: 'XML',
  nginx: 'Nginx',
  toml: 'TOML',
}

interface CodeBlockProps extends React.ComponentProps<'pre'> {
  'data-language'?: string
}

export function CodeBlock({
  children,
  'data-language': dataLanguage,
  className,
  style,
  tabIndex = 0,
  ref: forwardedRef,
  ...props
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRequestRef = useRef(0)
  const [copyStatus, setCopyStatus] = useState<
    'idle' | 'copying' | 'copied' | 'error'
  >('idle')

  useImperativeHandle(forwardedRef, () => preRef.current!, [])

  useEffect(
    () => () => {
      copyRequestRef.current += 1
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current)
    },
    [],
  )

  const language =
    LANGUAGE_LABELS[dataLanguage?.toLowerCase() ?? ''] ??
    (dataLanguage ? dataLanguage.toUpperCase() : 'Code')
  const codeLabel = dataLanguage ? `${language} code` : 'code'

  const handleCopy = async () => {
    const request = ++copyRequestRef.current
    if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current)
    setCopyStatus('copying')

    const code =
      preRef.current?.querySelector('code')?.textContent ??
      preRef.current?.textContent ??
      ''

    try {
      await navigator.clipboard.writeText(code)
      if (request !== copyRequestRef.current) return

      setCopyStatus('copied')
      resetTimerRef.current = setTimeout(() => {
        setCopyStatus('idle')
        resetTimerRef.current = null
      }, 2000)
    } catch {
      if (request === copyRequestRef.current) setCopyStatus('error')
    }
  }

  return (
    <div className="not-prose bg-card my-6 overflow-hidden rounded-lg border border-white/10">
      <div className="bg-background flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-2">
        <span className="font-mono text-xs text-zinc-400">{language}</span>

        <button
          type="button"
          onClick={handleCopy}
          disabled={copyStatus === 'copying'}
          aria-label={`Copy ${codeLabel}`}
          aria-busy={copyStatus === 'copying'}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 font-mono text-xs text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
        >
          {copyStatus === 'copied' ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copyStatus === 'copied'
            ? 'Copied'
            : copyStatus === 'copying'
              ? 'Copying…'
              : 'Copy'}
        </button>
      </div>

      <pre
        {...props}
        ref={preRef}
        data-language={dataLanguage}
        tabIndex={tabIndex}
        role={props.role ?? 'region'}
        aria-label={props['aria-label'] ?? codeLabel}
        className={cn(
          'm-0 max-w-full overflow-x-auto rounded-none border-0 px-4 py-4 text-sm leading-7 shadow-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-zinc-400',
          className,
        )}
        style={{
          ...style,
          background: 'var(--card)',
          backgroundColor: 'var(--card)',
          backgroundImage: 'none',
        }}
      >
        {children}
      </pre>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          copyStatus === 'error'
            ? 'border-t border-white/[0.07] px-4 py-3 text-xs leading-5 text-zinc-400'
            : 'sr-only'
        }
      >
        {copyStatus === 'copied'
          ? 'Code copied to clipboard.'
          : copyStatus === 'error'
            ? 'Couldn’t copy automatically. Select the code to copy it.'
            : ''}
      </p>
    </div>
  )
}
