import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  endDate: Date | string
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

function calc(end: Date) {
  const diff = end.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
    finished: false,
  }
}

export function CountdownTimer({ endDate, label, size = 'md' }: Props) {
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate
  const [time, setTime] = useState(() => calc(end))

  useEffect(() => {
    const t = setInterval(() => setTime(calc(end)), 1000)
    return () => clearInterval(t)
  }, [end])

  const urgent = !time.finished && time.days === 0 && time.hours < 24

  if (time.finished) {
    return <p className="text-sm font-medium text-ink-muted">Tugadi</p>
  }

  const sizes = {
    sm: { block: 'min-w-[44px] py-2', num: 'text-lg', cap: 'text-[9px]' },
    md: { block: 'min-w-[60px] py-2.5', num: 'text-2xl', cap: 'text-[10px]' },
    lg: { block: 'min-w-[78px] py-3.5', num: 'text-3xl lg:text-4xl', cap: 'text-xs' },
  }[size]

  return (
    <div>
      {label && <p className="text-xs text-ink-muted mb-2">{label}</p>}
      <div className="flex items-center gap-2">
        <Cell value={time.days} cap="KUN" sizes={sizes} urgent={urgent} />
        <span className={cn('font-bold', urgent ? 'text-danger' : 'text-ink-subtle', sizes.num)}>:</span>
        <Cell value={time.hours} cap="SOAT" sizes={sizes} urgent={urgent} />
        <span className={cn('font-bold', urgent ? 'text-danger' : 'text-ink-subtle', sizes.num)}>:</span>
        <Cell value={time.minutes} cap="DAQIQA" sizes={sizes} urgent={urgent} />
        <span className={cn('font-bold', urgent ? 'text-danger' : 'text-ink-subtle', sizes.num)}>:</span>
        <Cell value={time.seconds} cap="SONIYA" sizes={sizes} urgent={urgent} />
      </div>
    </div>
  )
}

function Cell({
  value,
  cap,
  urgent,
  sizes,
}: {
  value: number
  cap: string
  urgent: boolean
  sizes: { block: string; num: string; cap: string }
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-[10px] px-2',
        urgent ? 'bg-danger-bg text-danger-fg' : 'bg-surface border border-border text-ink',
        sizes.block,
      )}
    >
      <span className={cn('font-bold leading-none', sizes.num)}>{String(value).padStart(2, '0')}</span>
      <span className={cn('mt-1 text-ink-muted font-medium tracking-wide', sizes.cap)}>{cap}</span>
    </div>
  )
}
