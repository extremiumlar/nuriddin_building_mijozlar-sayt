import { CalendarCheck, TrendingDown, TrendingUp } from 'lucide-react'
import { cn, formatDate, daysBetween } from '@/lib/utils'
import type { Block } from '@/types'

interface Props {
  block: Block
}

export function DeliveryCalculator({ block }: Props) {
  const remaining = 100 - block.percentage
  const weeksLeft = block.weeklyRate > 0 ? remaining / block.weeklyRate : 0
  const estimated = new Date()
  estimated.setDate(estimated.getDate() + Math.round(weeksLeft * 7))
  const planned = new Date(block.deliveryDate)
  const diffDays = daysBetween(planned, estimated)
  const early = diffDays < 0

  return (
    <div className="rounded-[10px] bg-surface-muted border border-border p-3.5">
      <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
        <CalendarCheck className="h-3.5 w-3.5" />
        Bashorat (so'nggi 4 hafta sur'atiga ko'ra)
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{formatDate(estimated)}</p>
          <p
            className={cn(
              'text-xs font-medium mt-0.5 inline-flex items-center gap-1',
              early ? 'text-success' : Math.abs(diffDays) <= 7 ? 'text-ink-muted' : 'text-warning',
            )}
          >
            {early ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {early
              ? `${Math.abs(diffDays)} kun erta`
              : Math.abs(diffDays) <= 7
                ? "Rejaga muvofiq"
                : `${Math.abs(diffDays)} kun kechikishi mumkin`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-ink-subtle uppercase">Reja</p>
          <p className="text-xs text-ink-muted">{formatDate(block.deliveryDate)}</p>
        </div>
      </div>
    </div>
  )
}
