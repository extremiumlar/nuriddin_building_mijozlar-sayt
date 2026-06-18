import { useMemo, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn, formatUZS } from '@/lib/utils'
import type { PaymentScheduleItem, PaymentStatus } from '@/types'

interface Props {
  schedule: PaymentScheduleItem[] | undefined
  isLoading?: boolean
}

const monthShort = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']

const cellStyle: Record<PaymentStatus | 'future', string> = {
  paid: 'bg-success border-success text-white',
  pending: 'bg-warning-bg border-warning text-warning-fg',
  overdue: 'bg-danger border-danger text-white animate-pulse',
  future: 'bg-surface-muted border-border text-ink-subtle',
}

export function YearTimeline({ schedule, isLoading }: Props) {
  const years = useMemo(() => {
    if (!schedule) return [] as number[]
    const set = new Set<number>()
    schedule.forEach((s) => set.add(new Date(s.month).getFullYear()))
    return Array.from(set).sort()
  }, [schedule])

  const [yearIdx, setYearIdx] = useState(0)
  const [hover, setHover] = useState<PaymentScheduleItem | null>(null)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>To'lov yili</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  if (!schedule || schedule.length === 0 || years.length === 0) return null

  const year = years[yearIdx]
  const byMonth = new Map<number, PaymentScheduleItem>()
  schedule
    .filter((s) => new Date(s.month).getFullYear() === year)
    .forEach((s) => byMonth.set(new Date(s.month).getMonth(), s))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand" />
            Yillik to'lov chizmasi
          </CardTitle>
          <div className="inline-flex items-center gap-1.5">
            <button
              disabled={yearIdx === 0}
              onClick={() => setYearIdx((i) => Math.max(0, i - 1))}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-surface-subtle text-ink-muted disabled:opacity-30"
              aria-label="Oldingi yil"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-ink min-w-[3.5rem] text-center">{year}</span>
            <button
              disabled={yearIdx === years.length - 1}
              onClick={() => setYearIdx((i) => Math.min(years.length - 1, i + 1))}
              className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-surface-subtle text-ink-muted disabled:opacity-30"
              aria-label="Keyingi yil"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 lg:gap-2">
          {monthShort.map((m, i) => {
            const item = byMonth.get(i)
            const key = item ? (item.status as PaymentStatus) : ('future' as const)
            return (
              <div
                key={m}
                className="relative group"
                onMouseEnter={() => item && setHover(item)}
                onMouseLeave={() => setHover(null)}
              >
                <div
                  className={cn(
                    'aspect-square rounded-[10px] border-2 flex flex-col items-center justify-center cursor-pointer transition-all',
                    cellStyle[key],
                    item && 'hover:scale-[1.08] hover:shadow-card-hover',
                  )}
                >
                  <span className="text-[10px] font-bold uppercase">{m}</span>
                  {item && <span className="text-[9px] opacity-80 mt-0.5">{formatUZS(item.amount, { short: true }).replace(' so\'m', '')}</span>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Hover detail */}
        <div className="mt-3 min-h-[42px] flex items-center justify-between gap-3 px-3 py-2 rounded-[10px] bg-surface-muted border border-border text-xs">
          {hover ? (
            <>
              <span className="font-medium text-ink">
                {new Date(hover.month).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
              </span>
              <span className="font-bold text-ink">{formatUZS(hover.amount, { short: true })}</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase',
                  hover.status === 'paid' && 'bg-success-bg text-success-fg',
                  hover.status === 'pending' && 'bg-warning-bg text-warning-fg',
                  hover.status === 'overdue' && 'bg-danger-bg text-danger-fg',
                )}
              >
                {hover.status === 'paid' ? "To'langan" : hover.status === 'pending' ? 'Kutilmoqda' : 'Kechikkan'}
              </span>
            </>
          ) : (
            <span className="text-ink-muted">Oy ustiga kursorni olib boring</span>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center gap-3 flex-wrap text-[11px]">
          <LegendDot className="bg-success" label="To'langan" />
          <LegendDot className="bg-warning" label="Kutilmoqda" />
          <LegendDot className="bg-danger" label="Kechikkan" />
          <LegendDot className="bg-surface-muted border border-border" label="Kelajak" />
        </div>
      </CardContent>
    </Card>
  )
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-ink-muted">
      <span className={cn('h-3 w-3 rounded', className)} />
      {label}
    </span>
  )
}
