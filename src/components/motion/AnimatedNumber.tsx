import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface Props {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
  startOnView?: boolean
}

export function AnimatedNumber({
  value,
  duration = 1200,
  format = (n) => n.toLocaleString('uz-UZ').replace(/,/g, ' '),
  className,
  startOnView = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState(startOnView ? 0 : value)
  const fromRef = useRef(startOnView ? 0 : value)
  const startRef = useRef<number | null>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    if (startOnView && !inView) return
    if (startOnView && hasAnimatedRef.current) return

    const targetValue = value
    fromRef.current = startOnView ? 0 : display
    startRef.current = null
    hasAnimatedRef.current = true
    let raf = 0

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = fromRef.current + (targetValue - fromRef.current) * eased
      setDisplay(Math.round(current))
      if (progress < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, startOnView, duration])

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  )
}
