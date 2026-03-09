import type { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'
import { ZoomableImage } from '@/components/ui/zoomable-image'
import { CodeBlock } from '@/components/ui/code-block'
import { HeadingAnchor } from '@/components/ui/heading-anchor'
import { Info, AlertTriangle, CheckCircle, XCircle, Quote } from 'lucide-react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: any) => (
      <h1
        className="scroll-m-20 text-3xl font-bold tracking-tight mb-8 mt-8 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent"
        {...props}
      />
    ),
    h2: ({ children, ...props }: any) => (
      <HeadingAnchor
        level={2}
        className="scroll-m-20 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-2xl font-semibold tracking-tight mt-12 mb-6 first:mt-0"
        {...props}
      >
        {children}
      </HeadingAnchor>
    ),
    h3: ({ children, ...props }: any) => (
      <HeadingAnchor
        level={3}
        className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4"
        {...props}
      >
        {children}
      </HeadingAnchor>
    ),
    h4: ({ children, ...props }: any) => (
      <HeadingAnchor
        level={4}
        className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-3"
        {...props}
      >
        {children}
      </HeadingAnchor>
    ),
    p: (props: any) => (
      <p
        className="leading-7 [&:not(:first-child)]:mt-6 text-zinc-700 dark:text-zinc-300"
        {...props}
      />
    ),
    a: (props: any) => (
      <a
        className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors"
        {...props}
      />
    ),
    blockquote: ({ children, ...props }: any) => (
      <blockquote
        className="relative mt-6 overflow-hidden rounded-r-lg border-l-4 border-zinc-400 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 pl-6 pr-4 py-4 italic"
        {...props}
      >
        <Quote className="absolute right-3 top-3 h-8 w-8 text-zinc-200 dark:text-zinc-700 rotate-180" />
        {children}
      </blockquote>
    ),
    ul: (props: any) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 space-y-2" {...props} />
    ),
    ol: (props: any) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 space-y-2" {...props} />
    ),
    li: (props: any) => (
      <li className="leading-7 text-zinc-700 dark:text-zinc-300" {...props} />
    ),
    // rehype-pretty-code handles all fenced code blocks — this only covers inline backtick code
    code: ({ children, className, ...rest }: any) => {
      // If it has a language class, it's inside a pre — render plainly, CodeBlock wraps it
      if (className?.includes('language-')) {
        return <code className={className} {...rest}>{children}</code>
      }
      return (
        <code className="relative rounded bg-zinc-100 dark:bg-zinc-800 px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
          {children}
        </code>
      )
    },
    pre: (props: any) => <CodeBlock {...props} />,
    table: ({ children }: any) => (
      <div className="not-prose my-8 w-full overflow-x-auto rounded-xl"
        style={{
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
        }}
      >
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr
        className="transition-colors hover:bg-white/5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-5 py-3.5 text-sm text-zinc-200 dark:text-zinc-200">
        {children}
      </td>
    ),
    hr: (props: any) => (
      <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />
    ),
    img: (props: any) => (
      <div className="my-8">
        <ZoomableImage src={props.src} alt={props.alt || ''} />
      </div>
    ),
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => {
      return (
        <figure className="my-8">
          <ZoomableImage src={src} alt={alt} />
          <figcaption className="text-center mt-3 text-sm text-zinc-600 dark:text-zinc-400 italic">
            {caption}
          </figcaption>
        </figure>
      )
    },
    Callout: ({
      children,
      type = 'info',
    }: {
      children: ReactNode
      type?: 'info' | 'warning' | 'success' | 'error'
    }) => {
      const config = {
        info: {
          classes:
            'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-100',
          icon: <Info className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />,
        },
        warning: {
          classes:
            'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
          icon: <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500 dark:text-yellow-400" />,
        },
        success: {
          classes:
            'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-900 dark:text-green-100',
          icon: <CheckCircle className="h-4 w-4 shrink-0 text-green-500 dark:text-green-400" />,
        },
        error: {
          classes:
            'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100',
          icon: <XCircle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />,
        },
      }

      const { classes, icon } = config[type]

      return (
        <div className={`my-6 flex gap-3 rounded-lg border-l-4 p-4 ${classes}`}>
          <span className="mt-0.5">{icon}</span>
          <div className="flex-1 text-sm leading-relaxed">{children}</div>
        </div>
      )
    },
  }
}
