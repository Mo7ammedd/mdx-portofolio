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

interface CodeBlockProps extends React.ComponentProps<'pre'> {
  'data-language'?: string
}

export function CodeBlock({ children, 'data-language': dataLanguage, ...props }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const language =
    LANGUAGE_LABELS[dataLanguage?.toLowerCase() ?? ''] ??
    (dataLanguage ? dataLanguage.toUpperCase() : null)

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
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
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

      {/* Code body — rehype-pretty-code injects syntax-highlighted spans */}
      <pre
        ref={preRef}
        data-language={dataLanguage}
        className="overflow-x-auto rounded-b-xl border border-zinc-700 bg-zinc-900 px-6 py-5 text-sm leading-relaxed dark:bg-zinc-950"
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
