'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'
import { useInView } from '@/hooks/useInView'

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
}

export function AnimatedSection({ children, className = '' }: AnimatedSectionProps) {
  const section = useInView()

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
