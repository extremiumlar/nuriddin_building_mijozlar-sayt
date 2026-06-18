import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeUpProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  delay?: number
  y?: number
  duration?: number
  children: ReactNode
}

const easeApple: [number, number, number, number] = [0.16, 1, 0.3, 1]

export function FadeUp({ delay = 0, y = 16, duration = 0.45, children, ...rest }: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: easeApple }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
