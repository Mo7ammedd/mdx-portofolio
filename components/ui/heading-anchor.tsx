'use client'

import {
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'
import { Check, Hash } from 'lucide-react'

import { cn } from '@/lib/utils'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}

function getChildText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (typeof children === 'number') return String(children)
  if (Array.isArray(children)) return children.map(getChildText).join('')
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getChildText(children.props.children)
  }
  return ''
}

interface HeadingAnchorProps extends ComponentPropsWithoutRef<'h2'> {
  level: 2 | 3 | 4
}

export function HeadingAnchor({
  level,
  className,
  children,
  id: providedId,
  ...props
}: HeadingAnchorProps) {
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRequestRef = useRef(0)
  const [copyStatus, setCopyStatus] = useState<
    'idle' | 'copying' | 'copied' | 'error'
  >('idle')

  const headingText = useMemo(() => getChildText(children), [children])
  const id = providedId ?? slugify(headingText)
  const headingLabel = headingText.trim() || id || 'section'

  useEffect(
    () => () => {
      copyRequestRef.current += 1
      if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current)
    },
    [],
  )

  const handleCopyAnchor = async () => {
    const request = ++copyRequestRef.current
    if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current)
    setCopyStatus('copying')

    const url = `${window.location.href.split('#')[0]}#${id}`

    try {
      await navigator.clipboard.writeText(url)
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

  const Tag = `h${level}` as 'h2' | 'h3' | 'h4'

  return (
    <>
      <Tag
        {...props}
        id={id}
        className={cn('group flex items-start gap-2', className)}
      >
        <span className="min-w-0">{children}</span>
        <button
          type="button"
          onClick={handleCopyAnchor}
          disabled={copyStatus === 'copying'}
          aria-label={`Copy link to section: ${headingLabel}`}
          aria-busy={copyStatus === 'copying'}
          title="Copy link to section"
          className={cn(
            'inline-flex size-6 shrink-0 items-center justify-center rounded text-zinc-400 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:text-zinc-100 focus-visible:opacity-100 disabled:cursor-wait motion-reduce:transition-none [@media(hover:none)]:opacity-100',
            copyStatus === 'copied' && 'text-zinc-100 opacity-100',
            copyStatus === 'error' && 'opacity-100',
          )}
        >
          {copyStatus === 'copied' ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Hash aria-hidden="true" className="size-4" />
          )}
        </button>
      </Tag>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={
          copyStatus === 'error'
            ? 'not-prose -mt-2 mb-5 text-xs leading-5 text-zinc-400'
            : 'sr-only'
        }
      >
        {copyStatus === 'copied'
          ? `Link to ${headingLabel} copied to clipboard.`
          : copyStatus === 'error'
            ? 'Couldn’t copy the section link. Please try again.'
            : ''}
      </p>
    </>
  )
}
