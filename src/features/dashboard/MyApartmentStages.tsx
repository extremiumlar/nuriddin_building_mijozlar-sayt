import { ArrowRight, Check, Clock, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useMyApartmentStages } from '@/api/dashboard'
import { cn } from '@/lib/utils'
import type { StageStatus } from '@/types'

const statusMap: Record<StageStatus, { icon: React.ReactNode; bg: string; fg: string; label: string }> = {
  done: {
    icon: <Check className="h-3.5 w-3.5" />,
    bg: 'bg-success-bg',
    fg: 'text-success-fg',
    label: 'Tugadi',
  },
  in_progress: {
    icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
    bg: 'bg-warning-bg',
    fg: 'text-warning-fg',
    label: 'Jarayonda',
  },
  not_started: {
    icon: <Clock className="h-3.5 w-3.5" />,
    bg: 'bg-surface-subtle',
    fg: 'text-ink-muted',
    label: 'Boshlanmagan',
  },
}

export function MyApartmentStages() {
  const { data, isLoading } = useMyApartmentStages()

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mening kvartiram</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    )
  }

  const overall = Math.round(data.reduce((s, st) => s + st.progress, 0) / data.length)
  const inProgress = data.filter((s) => s.status === 'in_progress')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle>Mening kvartiram</CardTitle>
          <div className="flex items-center gap-2">
            <Badge tone="brand">{overall}% umumiy</Badge>
            <Link to="/construction" className="text-xs text-brand font-medium inline-flex items-center gap-1">
              Batafsil <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        {inProgress.length > 0 && (
          <p className="text-xs text-ink-muted mt-1">
            Hozir: {inProgress.map((s) => s.label).join(', ')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {data.map((stage, i) => {
            const m = statusMap[stage.status]
            return (
              <div
                key={stage.key}
                className="flex items-center gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
              >
                <div className={cn('h-8 w-8 rounded-full flex items-center justify-center shrink-0', m.bg, m.fg)}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-ink truncate">{stage.label}</p>
                    <span className={cn('text-xs font-semibold', m.fg)}>{stage.progress}%</span>
                  </div>
                  <ProgressBar
                    value={stage.progress}
                    tone={stage.status === 'done' ? 'success' : stage.status === 'in_progress' ? 'warning' : 'brand'}
                    size="sm"
                  />
                  {stage.note && <p className="text-[11px] text-ink-muted mt-1 truncate">{stage.note}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
