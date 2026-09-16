import type { ReactNode } from 'react'

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="mdx-steps my-8 list-none" role="list">
      {children}
    </ol>
  )
}

export function Step({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <li className="mdx-step relative pb-6 pl-11 last:pb-0">
      <p className="mt-0 mb-2 font-medium text-zinc-100">{title}</p>
      <div className="text-[0.94em] [&>p]:my-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </li>
  )
}
