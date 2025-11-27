import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    
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
        <figure>
          <img src={src} alt={alt} className="rounded-xl" />
          <figcaption className="text-center">{caption}</figcaption>
        </figure>
      )
    },
    
    a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))
      
      if (isInternalLink) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }
      
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      )
    },
    
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      return (
        <pre 
          className="overflow-x-auto rounded-lg bg-zinc-900 p-4 dark:bg-zinc-950"
          {...props}
        >
          {children}
        </pre>
      )
    },
    
    code: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      return (
        <code 
          className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm dark:bg-zinc-800"
          {...props}
        >
          {children}
        </code>
      )
    },
  }
}
