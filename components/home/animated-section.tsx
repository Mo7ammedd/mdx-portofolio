'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Use GPU-accelerated properties only (transform, opacity)
// Avoid filter: blur() which causes non-composited animations
const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const TRANSITION_SECTION = {
  duration: 0.3,
  ease: 'easeOut',
}

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
}

export function AnimatedSection({ children, className = '' }: AnimatedSectionProps) {
  const section = useInView()
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return (
      <section ref={section.ref} className={className}>
        {section.isInView && children}
      </section>
    )
  }

  return (
    <motion.section
      ref={section.ref}
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      className={className}
    >
      {section.isInView && children}
    </motion.section>
  )
}

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
}

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export function AnimatedContainer({ children, className = '' }: AnimatedContainerProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <main className={className}>{children}</main>
  }

  return (
    <motion.main
      className={className}
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.main>
  )
}

export function StaticSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <section className={className}>{children}</section>
  }

  return (
    <motion.section
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      className={className}
    >
      {children}
    </motion.section>
  )
}
