import { useState } from 'react'
import { Camera, ChevronDown, Play, User } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'
import type { ConstructionReport } from '@/types'

interface Props {
  reports: ConstructionReport[] | undefined
  isLoading?: boolean
}

export function WeeklyReportFeed({ reports, isLoading }: Props) {
  const [limit, setLimit] = useState(3)
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        icon={<Camera className="h-6 w-6" />}
        title="Hozircha hisobot yo'q"
        description="Birinchi hisobot tayyor bo'lishi bilan bu yerda paydo bo'ladi."
      />
    )
  }

  const shown = reports.slice(0, limit)

  return (
    <>
      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {shown.map((r, idx) => (
            <div key={r.id} className="relative animate-slide-up" style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards' }}>
              <div className="absolute -left-[18px] top-4 h-3 w-3 rounded-full bg-brand ring-4 ring-surface" />
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div>
                    <h4 className="text-sm font-semibold text-ink">{r.title}</h4>
                    <p className="text-xs text-ink-muted mt-0.5">{formatDate(r.date, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <Badge tone="brand" icon={<User className="h-3 w-3" />}>
                    {r.uploadedBy}
                  </Badge>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed">{r.description}</p>
                {r.mediaUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {r.mediaUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox(url)}
                        className="relative aspect-video rounded-[10px] overflow-hidden group bg-surface-subtle"
                      >
                        <img src={url} alt={`Hisobot ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition" />
                        {url.includes('video') && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-12 w-12 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">
                              <Play className="h-5 w-5 text-white fill-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {limit < reports.length && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => setLimit((l) => l + 3)} leftIcon={<ChevronDown className="h-4 w-4" />}>
            Yana yuklash ({reports.length - limit} ta qoldi)
          </Button>
        </div>
      )}

      <Modal open={!!lightbox} onClose={() => setLightbox(null)} size="xl">
        {lightbox && <img src={lightbox} alt="Katta ko'rinish" className="w-full h-auto" />}
      </Modal>
    </>
  )
}
