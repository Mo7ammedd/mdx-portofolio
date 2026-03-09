'use client'

import React, { useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'

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

function extractLanguage(className?: string): string | null {
  if (!className) return null
  // Find the language-xxx token among all space-separated classes
  const lang = className
    .split(' ')
    .find((c) => c.startsWith('language-'))
    ?.replace('language-', '')
    .toLowerCase()
  if (!lang) return null
  return LANGUAGE_LABELS[lang] ?? lang.toUpperCase()
}

export function CodeBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const codeChild = React.isValidElement(children)
    ? (children as React.ReactElement<{ className?: string; children?: React.ReactNode }>)
    : null

  const language = extractLanguage(codeChild?.props?.className)

  const handleCopy = () => {
    const code =
      preRef.current?.querySelector('code')?.textContent ||
      preRef.current?.textContent ||
      ''
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="not-prose my-6">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-t-xl border border-b-0 border-zinc-700 bg-zinc-800/90 px-4 py-2.5">
        <span className="text-xs font-medium tracking-wider text-zinc-400 uppercase">
          {language ?? 'Code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <pre
        ref={preRef}
        className="overflow-x-auto rounded-b-xl bg-zinc-900 dark:bg-zinc-950 px-6 py-5 border border-zinc-700 text-sm leading-relaxed"
        {...props}
      >
        {/* Render code content cleanly — strip extra classes, keep only text */}
        <code className="font-mono text-zinc-100">
          {codeChild?.props?.children ?? children}
        </code>
      </pre>
    </div>
  )
}
