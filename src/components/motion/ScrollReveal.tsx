import { motion, useInView, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

const easeApple: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  once?: boolean
  amount?: 'some' | 'all' | number
}

export function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.5,
  once = true,
  amount = 0.2,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: easeApple }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
