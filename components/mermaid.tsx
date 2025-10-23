'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
  className?: string
}

let initialized = false



export function Mermaid({ chart, className = '' }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        themeVariables: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#fff',
          primaryBorderColor: '#2563eb',
          lineColor: '#64748b',
          secondaryColor: '#8b5cf6',
          tertiaryColor: '#ec4899',
        },
      })
      initialized = true
    }

    const renderDiagram = async () => {
      try {
        const { svg: renderedSvg } = await mermaid.render(
          `mermaid-${Math.random().toString(36).substr(2, 9)}`,
          chart
        )
        setSvg(renderedSvg)
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        setSvg('<p class="text-red-500">Error rendering diagram</p>')
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div
      className={`mermaid-wrapper my-6 flex justify-center overflow-x-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900 ${className}`}
      ref={ref}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

