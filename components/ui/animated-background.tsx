'use client'
import { cn } from '@/lib/utils'
import { AnimatePresence, Transition, motion } from 'motion/react'
import {
  Children,
  cloneElement,
  ReactElement,
  useState,
  useId,
  type HTMLAttributes,
} from 'react'

type BackgroundChildProps = HTMLAttributes<HTMLElement> & {
  'data-id': string
  'data-checked'?: string
}

export type AnimatedBackgroundProps = {
  children:
    | ReactElement<BackgroundChildProps>[]
    | ReactElement<BackgroundChildProps>
  defaultValue?: string
  onValueChange?: (newActiveId: string | null) => void
  className?: string
  transition?: Transition
  enableHover?: boolean
}

export function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [selection, setSelection] = useState<{
    defaultValue: string | undefined
    activeId: string | null
  }>({
    defaultValue,
    activeId: defaultValue ?? null,
  })
  const uniqueId = useId()

  if (selection.defaultValue !== defaultValue) {
    setSelection({
      defaultValue,
      activeId: defaultValue ?? selection.activeId,
    })
  }
  const activeId = selection.activeId

  const handleSetActiveId = (id: string | null) => {
    setSelection({ defaultValue, activeId: id })

    if (onValueChange) {
      onValueChange(id)
    }
  }

  return Children.map(children, (child, index) => {
    const id = child.props['data-id']

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {
          onClick: () => handleSetActiveId(id),
        }

    return cloneElement(
      child,
      {
        key: index,
        className: cn('relative inline-flex', child.props.className),
        'data-checked': activeId === id ? 'true' : 'false',
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn('absolute inset-0', className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <div className="z-10">{child.props.children}</div>
      </>,
    )
  })
}
