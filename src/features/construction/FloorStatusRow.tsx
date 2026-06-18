import { Check, Clock, Loader2 } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import type { Floor } from '@/types'

interface Props {
  floor: Floor
  delayMs?: number
}

const map = {
  done: {
    bg: 'bg-success-bg',
    fg: 'text-success-fg',
    icon: <Check className="h-3.5 w-3.5" />,
    label: 'Tugallangan',
  },
  in_progress: {
    bg: 'bg-warning-bg',
    fg: 'text-warning-fg',
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    label: 'Jarayonda',
  },
  not_started: {
    bg: 'bg-surface-subtle',
    fg: 'text-ink-muted',
    icon: <Clock className="h-3.5 w-3.5" />,
    label: 'Boshlanmagan',
  },
}

export function FloorStatusRow({ floor, delayMs = 0 }: Props) {
  const m = map[floor.status]
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-[10px] border border-border animate-slide-up"
      style={{ animationDelay: `${delayMs}ms`, animationFillMode: 'backwards' }}
    >
      <div className={cn('h-8 w-8 rounded-full flex items-center justify-center', m.bg, m.fg)}>
        {m.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink">{floor.number}-qavat</p>
        {floor.note && <p className="text-xs text-ink-muted truncate">{floor.note}</p>}
      </div>
      <div className="text-right">
        <p className={cn('text-xs font-medium', m.fg)}>{m.label}</p>
        {floor.completionDate && (
          <p className="text-[11px] text-ink-subtle">{formatDate(floor.completionDate)}</p>
        )}
      </div>
    </div>
  )
}
