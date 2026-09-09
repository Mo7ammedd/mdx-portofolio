import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ZoomableImage } from '@/components/ui/zoomable-image'
import { CodeBlock } from '@/components/ui/code-block'
import { HeadingAnchor } from '@/components/ui/heading-anchor'
import { getBlogImageDimensions } from '@/lib/blog-image-metadata'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: ComponentPropsWithoutRef<'h1'>) => (
      <h1
        className="mt-0 mb-6 scroll-mt-8 text-2xl leading-tight font-medium tracking-tight text-zinc-100 sm:text-3xl"
        {...props}
      />
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <HeadingAnchor
        level={2}
        className="mt-12 mb-5 scroll-mt-8 border-b border-white/[0.07] pb-3 text-[1.375em] leading-snug font-medium tracking-tight text-zinc-100 first:mt-0"
        {...props}
      >
        {children}
      </HeadingAnchor>
    ),
    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <HeadingAnchor
        level={3}
        className="mt-8 mb-4 scroll-mt-8 text-[1.125em] leading-snug font-medium tracking-tight text-zinc-100"
        {...props}
      >
        {children}
      </HeadingAnchor>
    ),
    h4: ({ children, ...props }: ComponentPropsWithoutRef<'h4'>) => (
      <HeadingAnchor
        level={4}
        className="mt-6 mb-3 scroll-mt-8 text-base leading-snug font-medium text-zinc-200"
        {...props}
      >
        {children}
      </HeadingAnchor>
    ),
    p: (props: ComponentPropsWithoutRef<'p'>) => (
      <p className="my-5 leading-[1.85] text-zinc-300" {...props} />
    ),
    a: (props: ComponentPropsWithoutRef<'a'>) => (
      <a
        className="font-medium text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-300"
        {...props}
      />
    ),
    blockquote: ({
      children,
      ...props
    }: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote
        className="my-6 border-l-2 border-zinc-700 pl-4 text-zinc-400 not-italic [&_p]:my-0 [&_p]:leading-relaxed [&_p]:text-inherit"
        {...props}
      >
        {children}
      </blockquote>
    ),
    ul: (props: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="my-5 list-disc space-y-2 pl-5" {...props} />
    ),
    ol: (props: ComponentPropsWithoutRef<'ol'>) => (
      <ol className="my-5 list-decimal space-y-2 pl-5" {...props} />
    ),
    li: (props: ComponentPropsWithoutRef<'li'>) => (
      <li className="leading-[1.85] text-zinc-300" {...props} />
    ),
    // rehype-pretty-code handles all fenced code blocks — this only covers inline backtick code
    code: ({
      children,
      className,
      ...rest
    }: ComponentPropsWithoutRef<'code'>) => {
      // If it has a language class, it's inside a pre — render plainly, CodeBlock wraps it
      if (className?.includes('language-')) {
        return (
          <code className={className} {...rest}>
            {children}
          </code>
        )
      }
      return (
        <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-zinc-200 before:content-none after:content-none">
          {children}
        </code>
      )
    },
    pre: (props: ComponentPropsWithoutRef<'pre'>) => <CodeBlock {...props} />,
    table: ({ children }: ComponentPropsWithoutRef<'table'>) => (
      <div className="not-prose bg-card my-6 w-full overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }: ComponentPropsWithoutRef<'thead'>) => (
      <thead className="border-b border-white/10 bg-white/[0.03]">
        {children}
      </thead>
    ),
    tbody: ({ children }: ComponentPropsWithoutRef<'tbody'>) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: ComponentPropsWithoutRef<'tr'>) => (
      <tr className="border-b border-white/[0.07] transition-colors last:border-0 hover:bg-white/[0.02]">
        {children}
      </tr>
    ),
    th: ({ children }: ComponentPropsWithoutRef<'th'>) => (
      <th className="px-4 py-3 text-left text-xs font-medium text-zinc-300">
        {children}
      </th>
    ),
    td: ({ children }: ComponentPropsWithoutRef<'td'>) => (
      <td className="px-4 py-3 align-top text-sm leading-6 text-zinc-300">
        {children}
      </td>
    ),
    hr: (props: ComponentPropsWithoutRef<'hr'>) => (
      <hr className="my-10 border-white/[0.07]" {...props} />
    ),
    img: (props: ComponentPropsWithoutRef<'img'>) => {
      const src = typeof props.src === 'string' ? props.src : ''
      const dimensions = getBlogImageDimensions(src)
      return (
        <ZoomableImage
          src={src}
          alt={props.alt || ''}
          width={Number(props.width) || dimensions?.width || 1200}
          height={Number(props.height) || dimensions?.height || 675}
        />
      )
    },
    Cover: ({
      src,
      alt,
      caption,
      width,
      height,
    }: {
      src: string
      alt: string
      caption: string
      width?: number
      height?: number
    }) => {
      const dimensions = getBlogImageDimensions(src)
      return (
        <figure className="my-8">
          <ZoomableImage
            src={src}
            alt={alt}
            width={width || dimensions?.width || 1200}
            height={height || dimensions?.height || 675}
          />
          <figcaption className="mt-3 text-center text-xs leading-6 text-zinc-400">
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
          icon: (
            <Info className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
          ),
        },
        warning: {
          classes:
            'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
          icon: (
            <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500 dark:text-yellow-400" />
          ),
        },
        success: {
          classes:
            'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-green-900 dark:text-green-100',
          icon: (
            <CheckCircle className="h-4 w-4 shrink-0 text-green-500 dark:text-green-400" />
          ),
        },
        error: {
          classes:
            'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-900 dark:text-red-100',
          icon: (
            <XCircle className="h-4 w-4 shrink-0 text-red-500 dark:text-red-400" />
          ),
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
