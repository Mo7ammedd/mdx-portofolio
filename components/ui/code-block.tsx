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
    (dataLanguage ? dataLanguage.toUpperCase() : 'Code')

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
    <div className="not-prose my-8 rounded-xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
      <div
        className="flex items-center justify-between px-5 py-2.5"
        style={{ background: '#010409', borderBottom: '1px solid #30363d' }}
      >
        <span className="font-mono text-[11px] tracking-widest uppercase" style={{ color: '#484f58' }}>
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] transition-all duration-150"
          style={{ color: '#484f58' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#30363d'
            e.currentTarget.style.color = '#e6edf3'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#484f58'
          }}
        >
          {copied
            ? <><Check className="h-3 w-3" />Copied</>
            : <><Copy className="h-3 w-3" />Copy</>
          }
        </button>
      </div>

      <pre
        ref={preRef}
        data-language={dataLanguage}
        className="overflow-x-auto px-5 py-5 text-sm leading-7"
        style={{ background: '#0d1117', margin: 0 }}
        {...props}
      >
        {children}
      </pre>
    </div>
  )
}
