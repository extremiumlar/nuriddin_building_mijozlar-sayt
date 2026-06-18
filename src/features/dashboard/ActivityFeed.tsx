import {
  Activity,
  CalendarRange,
  CreditCard,
  FileText,
  HardHat,
  Megaphone,
  Ticket,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useActivity } from '@/api/dashboard'
import { cn, formatDateTime } from '@/lib/utils'
import type { ActivityKind } from '@/types'

const kindMeta: Record<ActivityKind, { icon: React.ReactNode; bg: string; fg: string }> = {
  payment: { icon: <CreditCard className="h-4 w-4" />, bg: 'bg-success-bg', fg: 'text-success-fg' },
  construction: { icon: <HardHat className="h-4 w-4" />, bg: 'bg-brand-50', fg: 'text-brand' },
  lottery: { icon: <Ticket className="h-4 w-4" />, bg: 'bg-purple-50', fg: 'text-purple-700' },
  booking: { icon: <CalendarRange className="h-4 w-4" />, bg: 'bg-amber-50', fg: 'text-amber-700' },
  document: { icon: <FileText className="h-4 w-4" />, bg: 'bg-surface-subtle', fg: 'text-ink-muted' },
  announcement: { icon: <Megaphone className="h-4 w-4" />, bg: 'bg-rose-50', fg: 'text-rose-700' },
}

export function ActivityFeed() {
  const { data, isLoading } = useActivity()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand" />
          So'nggi harakatlar
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : !data || data.length === 0 ? (
          <EmptyState icon={<Activity className="h-5 w-5" />} title="Harakat yo'q" />
        ) : (
          <div className="relative pl-5">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-3">
              {data.slice(0, 6).map((a) => {
                const m = kindMeta[a.kind]
                return (
                  <div key={a.id} className="relative">
                    <div
                      className={cn(
                        'absolute -left-[18px] top-1 h-3 w-3 rounded-full ring-2 ring-surface',
                        m.bg.replace('bg-', 'bg-'),
                      )}
                    />
                    <div className="flex items-start gap-2.5">
                      <div className={cn('h-8 w-8 rounded-[8px] flex items-center justify-center shrink-0', m.bg, m.fg)}>
                        {m.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{a.title}</p>
                        <p className="text-xs text-ink-muted">{a.description}</p>
                        <p className="text-[11px] text-ink-subtle mt-0.5">{formatDateTime(a.occurredAt)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
