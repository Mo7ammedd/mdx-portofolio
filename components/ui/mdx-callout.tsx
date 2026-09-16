import type { ReactNode } from 'react'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

const variants = {
  info: {
    icon: Info,
    label: 'Note',
    className: 'border-sky-400/20 bg-sky-400/[0.04]',
    color: 'text-sky-300',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Keep in mind',
    className: 'border-amber-400/20 bg-amber-400/[0.04]',
    color: 'text-amber-300',
  },
  success: {
    icon: CheckCircle,
    label: 'Key takeaway',
    className: 'border-emerald-400/20 bg-emerald-400/[0.04]',
    color: 'text-emerald-300',
  },
  error: {
    icon: XCircle,
    label: 'Common mistake',
    className: 'border-rose-400/20 bg-rose-400/[0.04]',
    color: 'text-rose-300',
  },
}

export function Callout({
  children,
  title,
  type = 'info',
}: {
  children: ReactNode
  title?: string
  type?: keyof typeof variants
}) {
  const { icon: Icon, label, className, color } = variants[type]
  return (
    <aside
      aria-label={title || label}
      className={`mdx-callout my-8 rounded-lg border p-5 ${className}`}
    >
      <div className={`mb-2 flex items-center gap-2 ${color}`}>
        <Icon aria-hidden="true" className="size-4 shrink-0" />
        <p className="m-0 text-sm font-medium text-inherit">{title || label}</p>
      </div>
      <div className="text-[0.94em] leading-relaxed [&>p]:my-3 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
