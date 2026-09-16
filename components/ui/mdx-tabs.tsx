'use client'

import {
  Children,
  isValidElement,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type KeyboardEvent,
} from 'react'

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function Tab({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function Tabs({
  labels,
  children,
  label = 'Code examples',
}: {
  labels: string[]
  children: ReactNode
  label?: string
}) {
  const id = useId()
  const [active, setActive] = useState(0)
  const ready = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  )
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const panels = Children.toArray(children).filter(isValidElement)

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let next: number
    switch (event.key) {
      case 'ArrowRight':
        next = (index + 1) % panels.length
        break
      case 'ArrowLeft':
        next = (index - 1 + panels.length) % panels.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = panels.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="mdx-tabs my-8 overflow-hidden rounded-lg border border-white/10">
      <div
        hidden={!ready}
        role="tablist"
        aria-label={label}
        className="not-prose flex overflow-x-auto border-b border-white/10 bg-white/[0.02] p-1"
      >
        {panels.map((_, index) => (
          <button
            key={index}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className="min-h-11 shrink-0 rounded-md px-4 text-sm text-zinc-400 transition-colors hover:text-zinc-100 aria-selected:bg-white/[0.07] aria-selected:text-zinc-100"
          >
            {labels[index] || `Example ${index + 1}`}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <section
          key={index}
          id={`${id}-panel-${index}`}
          role={ready ? 'tabpanel' : undefined}
          aria-labelledby={`${id}-${ready ? 'tab' : 'label'}-${index}`}
          tabIndex={ready ? 0 : undefined}
          hidden={ready && active !== index}
          className="mdx-tab-panel px-4 py-4 sm:px-5"
        >
          <p
            hidden={ready}
            id={`${id}-label-${index}`}
            className="mt-0 text-sm font-medium text-zinc-100"
          >
            {labels[index] || `Example ${index + 1}`}
          </p>
          {panel}
        </section>
      ))}
    </div>
  )
}
