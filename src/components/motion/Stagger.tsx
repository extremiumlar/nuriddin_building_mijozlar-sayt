import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

const easeApple: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface StaggerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delayChildren?: number
  staggerChildren?: number
}

export function Stagger({
  children,
  delayChildren = 0,
  staggerChildren = 0.05,
  ...rest
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren, staggerChildren },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  y?: number
}

export function StaggerItem({ children, y = 16, ...rest }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeApple } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
