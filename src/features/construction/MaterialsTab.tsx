import { useMemo, useState } from 'react'
import {
  Award,
  Box,
  Brush,
  Building2,
  Download,
  Hammer,
  Layers,
  RectangleHorizontal,
  Search,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useMaterials } from '@/api/construction'
import { cn, formatDate } from '@/lib/utils'
import type { ConstructionMaterial } from '@/types'

type Category = ConstructionMaterial['category']

const catMeta: Record<Category, { label: string; icon: React.ReactNode; color: string }> = {
  cement: { label: 'Sement', icon: <Hammer className="h-4 w-4" />, color: 'text-stone-700 bg-stone-100 dark:bg-stone-500/20' },
  metal: { label: 'Metall', icon: <Building2 className="h-4 w-4" />, color: 'text-slate-700 bg-slate-100 dark:bg-slate-500/20' },
  window: { label: 'Deraza', icon: <RectangleHorizontal className="h-4 w-4" />, color: 'text-sky-700 bg-sky-100 dark:bg-sky-500/20' },
  insulation: { label: 'Izolyatsiya', icon: <Layers className="h-4 w-4" />, color: 'text-amber-700 bg-amber-100 dark:bg-amber-500/20' },
  paint: { label: "Bo'yoq", icon: <Brush className="h-4 w-4" />, color: 'text-rose-700 bg-rose-100 dark:bg-rose-500/20' },
  other: { label: 'Boshqa', icon: <Box className="h-4 w-4" />, color: 'text-ink-muted bg-surface-subtle' },
}

const filters: Array<{ value: Category | 'all'; label: string }> = [
  { value: 'all', label: 'Hammasi' },
  { value: 'cement', label: 'Sement' },
  { value: 'metal', label: 'Metall' },
  { value: 'window', label: 'Deraza' },
  { value: 'insulation', label: 'Izolyatsiya' },
  { value: 'paint', label: "Bo'yoq" },
  { value: 'other', label: 'Boshqa' },
]

export function MaterialsTab() {
  const { data, isLoading } = useMaterials()
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!data) return []
    return data.filter((m) => {
      if (filter !== 'all' && m.category !== filter) return false
      if (search) {
        const q = search.toLowerCase()
        return m.name.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q)
      }
      return true
    })
  }, [data, filter, search])

  return (
    <div className="space-y-4">
      {/* Search + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" />
          <input
            type="search"
            placeholder="Material yoki brend qidiring..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-3 rounded-element bg-surface border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
          />
        </div>
        <div className="inline-flex items-center gap-1 bg-surface-muted rounded-element p-0.5 overflow-x-auto scrollbar-thin">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-[6px] text-xs font-medium whitespace-nowrap transition-colors',
                filter === f.value
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-ink-muted hover:text-ink',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((m) => {
            const meta = catMeta[m.category]
            return (
              <Card key={m.id} hoverable>
                <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className={cn('h-10 w-10 rounded-element flex items-center justify-center', meta.color)}>
                      {meta.icon}
                    </div>
                    <Badge tone="neutral" className="text-[10px]">{meta.label}</Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink leading-tight">{m.name}</h3>
                    <p className="text-xs text-ink-muted mt-0.5">Brand: <span className="font-semibold text-ink">{m.brand}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <p className="text-[10px] text-ink-muted uppercase tracking-wider">Miqdor</p>
                      <p className="text-sm font-bold text-ink">{m.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ink-muted uppercase tracking-wider">Sotib olingan</p>
                      <p className="text-sm font-semibold text-ink">{formatDate(m.purchasedAt, { day: 'numeric', month: 'short', year: '2-digit' })}</p>
                    </div>
                  </div>

                  {m.certificateUrl && (
                    <Button size="sm" variant="ghost" fullWidth leftIcon={<Award className="h-3.5 w-3.5" />} rightIcon={<Download className="h-3.5 w-3.5" />}>
                      Sertifikat
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
