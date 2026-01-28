import type { MDXComponents } from 'mdx/types'
import { ReactNode } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: any) => (
      <h1 
        className="scroll-m-20 text-3xl font-bold tracking-tight mb-8 mt-8 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent" 
        {...props} 
      />
    ),
    h2: (props: any) => (
      <h2 
        className="scroll-m-20 border-b border-zinc-200 dark:border-zinc-800 pb-2 text-2xl font-semibold tracking-tight mt-12 mb-6 first:mt-0" 
        {...props} 
      />
    ),
    h3: (props: any) => (
      <h3 
        className="scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-4" 
        {...props} 
      />
    ),
    h4: (props: any) => (
      <h4 
        className="scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-3" 
        {...props} 
      />
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
    blockquote: (props: any) => (
      <blockquote 
        className="mt-6 border-l-4 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 pl-6 pr-4 py-4 italic rounded-r-lg" 
        {...props} 
      />
    ),
    ul: (props: any) => (
      <ul 
        className="my-6 ml-6 list-disc [&>li]:mt-2 space-y-2" 
        {...props} 
      />
    ),
    ol: (props: any) => (
      <ol 
        className="my-6 ml-6 list-decimal [&>li]:mt-2 space-y-2" 
        {...props} 
      />
    ),
    li: (props: any) => (
      <li 
        className="leading-7 text-zinc-700 dark:text-zinc-300" 
        {...props} 
      />
    ),
    code: (props: any) => {
      const { children, className } = props
      const isCodeBlock = className?.includes('language-')
      
      if (isCodeBlock) {
        return (
          <code 
            className={`${className} block bg-zinc-900 dark:bg-zinc-950 text-zinc-100 rounded-xl p-6 overflow-x-auto text-sm leading-relaxed border border-zinc-800 dark:border-zinc-800`}
            {...props} 
          />
        )
      }
      
      return (
        <code 
          className="relative rounded bg-zinc-100 dark:bg-zinc-900 px-[0.4rem] py-[0.2rem] font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800"
          {...props}
        />
      )
    },
    pre: (props: any) => (
      <pre 
        className="mt-6 mb-6 overflow-x-auto rounded-xl bg-zinc-900 dark:bg-zinc-950 p-6 border border-zinc-800 dark:border-zinc-800 shadow-lg" 
        {...props} 
      />
    ),
    table: (props: any) => (
      <div className="my-6 w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <table className="w-full" {...props} />
      </div>
    ),
    thead: (props: any) => (
      <thead className="bg-zinc-50 dark:bg-zinc-900/50" {...props} />
    ),
    tbody: (props: any) => (
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800" {...props} />
    ),
    tr: (props: any) => (
      <tr className="border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30" {...props} />
    ),
    th: (props: any) => (
      <th className="px-4 py-3 text-left font-semibold text-zinc-900 dark:text-zinc-100 text-sm" {...props} />
    ),
    td: (props: any) => (
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 text-sm" {...props} />
    ),
    hr: (props: any) => (
      <hr className="my-8 border-zinc-200 dark:border-zinc-800" {...props} />
    ),
    img: (props: any) => (
      <img 
        className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-md my-8" 
        {...props} 
      />
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
          <img 
            src={src} 
            alt={alt} 
            className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg w-full" 
          />
          <figcaption className="text-center mt-3 text-sm text-zinc-600 dark:text-zinc-400 italic">
            {caption}
          </figcaption>
        </figure>
      )
    },
    Callout: ({ 
      children, 
      type = 'info' 
    }: { 
      children: ReactNode
      type?: 'info' | 'warning' | 'success' | 'error'
    }) => {
      const styles = {
        info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100',
        warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900 text-yellow-900 dark:text-yellow-100',
        success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900 text-green-900 dark:text-green-100',
        error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-100',
      }
      
      return (
        <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
          {children}
        </div>
      )
    },
  }
}
