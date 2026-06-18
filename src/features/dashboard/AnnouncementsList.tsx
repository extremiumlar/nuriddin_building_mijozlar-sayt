import { AlertCircle, Calendar, Megaphone, PartyPopper } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAnnouncements } from '@/api/dashboard'
import { cn, formatDate } from '@/lib/utils'
import type { AnnouncementTone } from '@/types'

const toneMap: Record<AnnouncementTone, { icon: React.ReactNode; bg: string; fg: string; border: string }> = {
  info: {
    icon: <Megaphone className="h-4 w-4" />,
    bg: 'bg-brand-50',
    fg: 'text-brand-700',
    border: 'border-brand-200',
  },
  warning: {
    icon: <AlertCircle className="h-4 w-4" />,
    bg: 'bg-warning-bg',
    fg: 'text-warning-fg',
    border: 'border-warning/30',
  },
  celebration: {
    icon: <PartyPopper className="h-4 w-4" />,
    bg: 'bg-success-bg',
    fg: 'text-success-fg',
    border: 'border-success/30',
  },
  event: {
    icon: <Calendar className="h-4 w-4" />,
    bg: 'bg-purple-50',
    fg: 'text-purple-700',
    border: 'border-purple-200',
  },
}

export function AnnouncementsList() {
  const { data, isLoading } = useAnnouncements()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-brand" />
          E'lonlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {isLoading ? (
          <>
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </>
        ) : !data || data.length === 0 ? (
          <EmptyState icon={<Megaphone className="h-5 w-5" />} title="E'lonlar yo'q" />
        ) : (
          data.map((a) => {
            const m = toneMap[a.tone]
            return (
              <div key={a.id} className={cn('rounded-[10px] border p-3 flex items-start gap-3', m.bg, m.border)}>
                <div className={cn('h-9 w-9 rounded-[8px] bg-white/70 flex items-center justify-center shrink-0', m.fg)}>
                  {m.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-semibold', m.fg)}>{a.title}</p>
                  <p className="text-xs text-ink mt-1 line-clamp-2">{a.body}</p>
                  <p className="text-[11px] text-ink-muted mt-1">
                    {a.authorName} · {formatDate(a.publishedAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
