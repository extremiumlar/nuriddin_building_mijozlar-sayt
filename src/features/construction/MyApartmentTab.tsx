import { Check, Clock, Loader2, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useMyApartmentStages } from '@/api/dashboard'
import { useApartmentInfo } from '@/api/profile'
import { cn, formatDate } from '@/lib/utils'
import type { StageStatus } from '@/types'

const statusMeta: Record<StageStatus, { bg: string; fg: string; icon: React.ReactNode; label: string }> = {
  done: {
    bg: 'bg-success-bg',
    fg: 'text-success-fg',
    icon: <Check className="h-4 w-4" />,
    label: 'Tugadi',
  },
  in_progress: {
    bg: 'bg-warning-bg',
    fg: 'text-warning-fg',
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
    label: 'Jarayonda',
  },
  not_started: {
    bg: 'bg-surface-subtle',
    fg: 'text-ink-muted',
    icon: <Clock className="h-4 w-4" />,
    label: 'Boshlanmagan',
  },
}

export function MyApartmentTab() {
  const { data: apt } = useApartmentInfo()
  const { data: stages, isLoading } = useMyApartmentStages()

  if (isLoading || !stages) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  const overall = Math.round(stages.reduce((sum, s) => sum + s.progress, 0) / stages.length)

  return (
    <div className="space-y-5">
      {/* Header card */}
      <Card>
        <CardContent className="flex items-center gap-4 flex-wrap">
          <div className="h-14 w-14 rounded-element bg-gradient-to-br from-brand to-brand-700 text-white flex items-center justify-center text-xl font-extrabold">
            {apt?.number ?? '—'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-muted uppercase tracking-wider">Sizning kvartirangiz</p>
            <h2 className="text-lg font-extrabold text-ink">
              {apt ? `${apt.block} · ${apt.floor}-qavat · ${apt.rooms} xonali` : '...'}
            </h2>
            {apt && <p className="text-xs text-ink-muted">{apt.objectName}</p>}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-ink-muted uppercase tracking-wider">Umumiy</p>
            <p className="text-3xl font-extrabold text-ink tracking-tight">{overall}%</p>
          </div>
        </CardContent>
      </Card>

      {/* Stages */}
      <Card>
        <CardHeader>
          <CardTitle>6 bosqichli timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {stages.map((stage, idx) => {
            const m = statusMeta[stage.status]
            return (
              <div
                key={stage.key}
                className={cn(
                  'rounded-element border p-4 transition-all',
                  stage.status === 'in_progress'
                    ? 'border-warning/40 bg-warning-bg/30'
                    : 'border-border',
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div className={cn('h-10 w-10 rounded-element shrink-0 flex items-center justify-center', m.bg, m.fg)}>
                    {m.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">
                          BOSQICH {idx + 1}
                        </span>
                        <h3 className="text-base font-bold text-ink">{stage.label}</h3>
                      </div>
                      <Badge tone={stage.status === 'done' ? 'success' : stage.status === 'in_progress' ? 'warning' : 'neutral'}>
                        {m.label}
                      </Badge>
                    </div>

                    {stage.note && (
                      <p className="text-sm text-ink-muted mt-1.5">{stage.note}</p>
                    )}

                    <div className="mt-3">
                      <ProgressBar
                        value={stage.progress}
                        tone={stage.status === 'done' ? 'success' : stage.status === 'in_progress' ? 'warning' : 'brand'}
                        size="md"
                      />
                      <div className="flex items-center justify-between mt-1.5 text-[11px] text-ink-muted">
                        <span className="font-semibold">{stage.progress}%</span>
                        {stage.completedAt && (
                          <span>Tugadi: {formatDate(stage.completedAt)}</span>
                        )}
                        {!stage.completedAt && stage.startedAt && (
                          <span>Boshlandi: {formatDate(stage.startedAt)}</span>
                        )}
                      </div>
                    </div>

                    {stage.status === 'done' && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-success-fg">
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        <span className="ml-1">Sifat nazoratchisi tasdiqlagan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
