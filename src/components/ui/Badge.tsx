import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'gold'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  icon?: ReactNode
  pulse?: boolean
}

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-subtle text-ink-muted',
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-bg text-success-fg',
  warning: 'bg-warning-bg text-warning-fg',
  danger: 'bg-danger-bg text-danger-fg',
  gold: 'bg-amber-100 text-amber-800',
}

export function Badge({ tone = 'neutral', icon, pulse, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-badge text-xs font-medium',
        tones[tone],
        pulse && 'animate-pulse',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
