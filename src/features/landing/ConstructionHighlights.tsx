import { Building2, CalendarCheck, HardHat, Layers, Loader2 } from 'lucide-react'
import { ScrollReveal } from '@/components/motion'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePublicBlocks, usePublicProject } from '@/api/public'
import { cn, formatDate } from '@/lib/utils'

const statusMeta = {
  active: { label: 'Faol qurilish', tone: 'brand' as const },
  planned: { label: 'Rejada', tone: 'neutral' as const },
  completed: { label: 'Tugallangan', tone: 'success' as const },
}

export function ConstructionHighlights() {
  const { data: blocks, isLoading: blocksLoading } = usePublicBlocks()
  const { data: project } = usePublicProject()

  return (
    <section id="construction" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-brand/10 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
              <HardHat className="h-3 w-3" />
              Qurilish jarayoni
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-ink text-balance">
              5 ta blok — har biri shaffof nazoratda
            </h2>
            <p className="mt-4 text-base text-ink-muted text-pretty">
              Har blok uchun real vaqt progress, qavatlar holati va topshirish sanasi.
              Mijoz kabinetida — haftalik foto/video hisobotlar.
            </p>
          </div>
        </ScrollReveal>

        {/* Overall project progress */}
        {project && (
          <ScrollReveal delay={0.05}>
            <div className="mb-8 rounded-card border border-border bg-surface p-5 lg:p-6 shadow-card">
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand" />
                  <span className="text-sm font-semibold text-ink">
                    {project.name} — umumiy progress
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-ink tracking-tight">
                  {project.construction_progress}%
                </span>
              </div>
              <ProgressBar value={project.construction_progress} tone="success" size="lg" />
              {project.estimated_delivery_label && (
                <p className="mt-2 text-xs text-ink-muted inline-flex items-center gap-1.5">
                  <CalendarCheck className="h-3.5 w-3.5 text-success" />
                  Topshirish: {project.estimated_delivery_label}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        {/* Block cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {blocksLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-56" />)
          ) : (
            blocks?.map((b, idx) => {
              const m = statusMeta[b.status]
              return (
                <ScrollReveal key={b.id} delay={idx * 0.05}>
                  <article className="bg-surface rounded-card border border-border p-4 h-full">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="h-10 w-10 rounded-element bg-brand/10 dark:bg-brand/15 text-brand flex items-center justify-center">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <Badge tone={m.tone}>{m.label}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-ink">{b.name}</h3>
                    <p className="text-xs text-ink-muted mt-0.5 inline-flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {b.completed_floors} / {b.total_floors} qavat
                    </p>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5 text-xs">
                        <span className="text-ink-muted">Qurilish</span>
                        <span className={cn('font-bold', b.percentage >= 70 ? 'text-success' : 'text-ink')}>
                          {b.percentage}%
                        </span>
                      </div>
                      <ProgressBar
                        value={b.percentage}
                        tone={b.percentage >= 70 ? 'success' : 'brand'}
                        size="sm"
                      />
                    </div>

                    {b.delivery_date && (
                      <p className="mt-3 text-[11px] text-ink-muted inline-flex items-center gap-1">
                        <CalendarCheck className="h-3 w-3" />
                        {formatDate(b.delivery_date, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </article>
                </ScrollReveal>
              )
            })
          )}
        </div>

        {/* Hint when API offline */}
        {!blocksLoading && !blocks?.length && (
          <p className="mt-6 text-center text-xs text-ink-muted inline-flex items-center gap-1.5 justify-center w-full">
            <Loader2 className="h-3 w-3 animate-spin" />
            Ma'lumot kelmadi — Django backend ishlayaptimi tekshiring (`python manage.py runserver`)
          </p>
        )}
      </div>
    </section>
  )
}
