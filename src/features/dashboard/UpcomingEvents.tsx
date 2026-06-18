import { Bell, CalendarRange, CreditCard, Megaphone, Sparkles, Ticket } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useUpcoming } from '@/api/dashboard'
import { cn, daysBetween, formatDate } from '@/lib/utils'
import type { UpcomingEventKind } from '@/types'

const kindMeta: Record<UpcomingEventKind, { icon: React.ReactNode; bg: string; fg: string }> = {
  payment: { icon: <CreditCard className="h-4 w-4" />, bg: 'bg-warning-bg', fg: 'text-warning-fg' },
  lottery: { icon: <Ticket className="h-4 w-4" />, bg: 'bg-purple-50', fg: 'text-purple-600' },
  booking: { icon: <CalendarRange className="h-4 w-4" />, bg: 'bg-brand-50', fg: 'text-brand' },
  milestone: { icon: <Sparkles className="h-4 w-4" />, bg: 'bg-success-bg', fg: 'text-success-fg' },
  announcement: { icon: <Megaphone className="h-4 w-4" />, bg: 'bg-surface-subtle', fg: 'text-ink-muted' },
}

export function UpcomingEvents() {
  const { data, isLoading } = useUpcoming()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yaqin event'lar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </CardContent>
      </Card>
    )
  }

  const sorted = data?.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-brand" />
          Yaqin event'lar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {sorted.length === 0 ? (
          <EmptyState icon={<Bell className="h-5 w-5" />} title="Hech narsa yo'q" />
        ) : (
          sorted.map((ev) => {
            const m = kindMeta[ev.kind]
            const daysLeft = daysBetween(new Date(), new Date(ev.date))
            return (
              <div key={ev.id} className="flex items-start gap-3 rounded-[10px] border border-border p-3">
                <div className={cn('h-9 w-9 rounded-[8px] flex items-center justify-center shrink-0', m.bg, m.fg)}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{ev.title}</p>
                  {ev.subtitle && <p className="text-xs text-ink-muted truncate">{ev.subtitle}</p>}
                  <p className="text-[11px] text-ink-subtle mt-0.5">{formatDate(ev.date)}</p>
                </div>
                <Badge
                  tone={daysLeft <= 1 ? 'danger' : daysLeft <= 3 ? 'warning' : 'neutral'}
                  pulse={ev.priority === 'high' && daysLeft <= 1}
                >
                  {daysLeft <= 0 ? 'Bugun' : daysLeft === 1 ? 'Ertaga' : `${daysLeft} kun`}
                </Badge>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
