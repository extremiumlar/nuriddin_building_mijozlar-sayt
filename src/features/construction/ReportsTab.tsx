import { useMemo, useState } from 'react'
import { Camera, FileText, Heart, MessageCircle, PartyPopper, ThumbsUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Skeleton } from '@/components/ui/Skeleton'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useBlocks, useReports } from '@/api/construction'
import { cn, formatDate } from '@/lib/utils'

type Reaction = 'clap' | 'celebrate' | 'love'

interface ReactionState {
  reportId: string
  reactions: Record<Reaction, number>
  mine?: Reaction
}

const initialReactionsFor = (id: string): Record<Reaction, number> => {
  // Deterministic mock counts based on id
  const seed = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return {
    clap: 12 + (seed % 18),
    celebrate: 4 + (seed % 9),
    love: 7 + (seed % 14),
  }
}

const reactionMeta: Record<Reaction, { icon: React.ReactNode; color: string; label: string }> = {
  clap: { icon: <ThumbsUp className="h-4 w-4" />, color: 'text-brand', label: 'Clap' },
  celebrate: { icon: <PartyPopper className="h-4 w-4" />, color: 'text-gold-600', label: 'Celebrate' },
  love: { icon: <Heart className="h-4 w-4" />, color: 'text-rose-600', label: 'Love' },
}

export function ReportsTab() {
  const { data: blocks } = useBlocks()
  const [activeBlock, setActiveBlock] = useState<string>('all')
  const blockId = activeBlock === 'all' ? undefined : activeBlock
  const { data: reports, isLoading } = useReports(blockId)
  const [reactions, setReactions] = useState<Record<string, ReactionState>>({})
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [limit, setLimit] = useState(3)

  const tabs = useMemo(() => {
    const t = [{ value: 'all', label: 'Hammasi' }]
    blocks?.forEach((b) => t.push({ value: b.id, label: b.name }))
    return t
  }, [blocks])

  const getReactions = (id: string) =>
    reactions[id] ?? { reportId: id, reactions: initialReactionsFor(id) }

  const toggleReaction = (id: string, r: Reaction) => {
    setReactions((prev) => {
      const cur = prev[id] ?? { reportId: id, reactions: initialReactionsFor(id) }
      const newCounts = { ...cur.reactions }
      let newMine: Reaction | undefined = cur.mine

      if (cur.mine === r) {
        newCounts[r] -= 1
        newMine = undefined
      } else {
        if (cur.mine) newCounts[cur.mine] -= 1
        newCounts[r] += 1
        newMine = r
      }
      return { ...prev, [id]: { reportId: id, reactions: newCounts, mine: newMine } }
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  if (!reports || reports.length === 0) {
    return (
      <EmptyState
        icon={<Camera className="h-6 w-6" />}
        title="Hozircha hisobot yo'q"
        description="Birinchi haftalik hisobot tayyor bo'lgach bu yerda paydo bo'ladi."
      />
    )
  }

  const shown = reports.slice(0, limit)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            Haftalik hisobotlar
          </h2>
          <p className="text-sm text-ink-muted">Foto, video va bosh injener izohi</p>
        </div>
        <Tabs tabs={tabs} value={activeBlock} onChange={setActiveBlock} />
      </div>

      <div className="space-y-4">
        {shown.map((r, idx) => {
          const rState = getReactions(r.id)
          const totalReacts = Object.values(rState.reactions).reduce((a, b) => a + b, 0)
          return (
            <Card key={r.id} className="overflow-hidden">
              <CardContent className="space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle">
                      HISOBOT {idx + 1} · {formatDate(r.date, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-lg font-extrabold text-ink mt-1">{r.title}</h3>
                  </div>
                  <Badge tone="brand">{r.uploadedBy}</Badge>
                </div>

                <p className="text-sm text-ink leading-relaxed">{r.description}</p>

                {r.mediaUrls.length > 0 && (
                  <div className={cn('grid gap-2', r.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
                    {r.mediaUrls.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox(url)}
                        className="relative aspect-video rounded-element overflow-hidden group bg-surface-subtle"
                      >
                        <img src={url} alt={`Hisobot ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Reactions strip */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    {(Object.keys(reactionMeta) as Reaction[]).map((rt) => {
                      const meta = reactionMeta[rt]
                      const active = rState.mine === rt
                      return (
                        <button
                          key={rt}
                          onClick={() => toggleReaction(r.id, rt)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-semibold transition-all press',
                            active
                              ? cn('bg-surface-subtle ring-2', meta.color)
                              : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                          )}
                          style={{ '--tw-ring-color': active ? 'currentColor' : '' } as React.CSSProperties}
                        >
                          <span className={active ? meta.color : ''}>{meta.icon}</span>
                          <span>{rState.reactions[rt]}</span>
                        </button>
                      )
                    })}
                  </div>
                  <Button size="sm" variant="ghost" leftIcon={<MessageCircle className="h-3.5 w-3.5" />}>
                    Savol berish
                  </Button>
                </div>
                <p className="text-[11px] text-ink-muted">{totalReacts} ta reaksiya</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {limit < reports.length && (
        <Button variant="outline" fullWidth onClick={() => setLimit((l) => l + 3)}>
          Yana yuklash ({reports.length - limit} ta qoldi)
        </Button>
      )}

      <Modal open={!!lightbox} onClose={() => setLightbox(null)} size="xl">
        {lightbox && <img src={lightbox} alt="Katta ko'rinish" className="w-full h-auto" />}
      </Modal>
    </div>
  )
}
