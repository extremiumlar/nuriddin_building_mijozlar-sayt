import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const tones = {
  brand: 'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
}

const sizes = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
}

export function ProgressBar({
  value,
  max = 100,
  tone = 'brand',
  size = 'md',
  showLabel,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5 text-xs text-ink-muted">
          <span>{pct.toFixed(0)}%</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
      <div className={cn('w-full bg-surface-subtle rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', tones[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

interface CircleProgressProps {
  value: number
  size?: number
  stroke?: number
  tone?: 'brand' | 'success' | 'warning' | 'danger'
  label?: string
}

const circleColors: Record<NonNullable<CircleProgressProps['tone']>, string> = {
  brand: 'stroke-brand',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger: 'stroke-danger',
}

export function CircleProgress({
  value,
  size = 120,
  stroke = 10,
  tone = 'brand',
  label,
}: CircleProgressProps) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="stroke-surface-subtle fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(circleColors[tone], 'fill-none transition-all duration-1000 ease-out')}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-ink">{value.toFixed(0)}%</span>
        {label && <span className="text-xs text-ink-muted mt-0.5">{label}</span>}
      </div>
    </div>
  )
}
