import { Building2, Calendar, Compass, Home, Layers, MapPin, Maximize2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate, daysBetween } from '@/lib/utils'
import { useApartmentInfo } from '@/api/profile'
import type { ApartmentInfo } from '@/types'

const viewLabels: Record<ApartmentInfo['view'], string> = {
  street: "Ko'cha tomoni",
  garden: "Bog' tomoni",
  mountain: "Tog' tomoni",
}

export function ApartmentInfoCard() {
  const { data, isLoading } = useApartmentInfo()

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mening kvartiram</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72" />
        </CardContent>
      </Card>
    )
  }

  const daysToDelivery = daysBetween(new Date(), new Date(data.estimatedDelivery))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-4 w-4 text-brand" />
              Mening kvartiram
            </CardTitle>
            <p className="text-xs text-ink-muted mt-1 truncate">{data.objectName}</p>
          </div>
          <Badge tone="brand">
            #{data.number}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-4 flex-wrap">
          {/* Mini building SVG */}
          <BuildingMini totalFloors={5} highlightFloor={data.floor} />

          <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <Stat icon={<Building2 className="h-3.5 w-3.5" />} label="Blok" value={data.block} />
            <Stat icon={<Layers className="h-3.5 w-3.5" />} label="Qavat" value={`${data.floor}-qavat`} />
            <Stat icon={<Home className="h-3.5 w-3.5" />} label="Xonalar" value={`${data.rooms} xonali`} />
            <Stat icon={<Maximize2 className="h-3.5 w-3.5" />} label="Maydon" value={`${data.area} m²`} />
            <Stat icon={<Compass className="h-3.5 w-3.5" />} label="Tomon" value={viewLabels[data.view]} />
            <Stat icon={<Calendar className="h-3.5 w-3.5" />} label="Topshirish" value={formatDate(data.estimatedDelivery, { day: 'numeric', month: 'short' })} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted">Qurilish holati</span>
            <span className="font-semibold text-ink">{data.constructionProgress}%</span>
          </div>
          <ProgressBar value={data.constructionProgress} tone="success" size="md" />
          <p className="text-[11px] text-ink-muted">
            {daysToDelivery > 0 ? `Topshirilishigacha ~${daysToDelivery} kun` : 'Topshirildi'}
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-[10px] bg-surface-muted border border-border p-3">
          <MapPin className="h-4 w-4 text-ink-muted shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-[11px] text-ink-muted uppercase tracking-wide">Manzil</p>
            <p className="text-sm text-ink leading-snug mt-0.5">{data.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-border p-2.5">
      <div className="flex items-center gap-1 text-[11px] text-ink-muted">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold text-ink mt-0.5">{value}</p>
    </div>
  )
}

function BuildingMini({ totalFloors, highlightFloor }: { totalFloors: number; highlightFloor: number }) {
  const width = 88
  const floorH = 18
  const gap = 3
  const padding = 8
  const height = totalFloors * (floorH + gap) - gap + padding * 2 + 14

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-[88px] h-auto shrink-0">
      {/* Roof */}
      <polygon points={`${padding - 4},${padding + 8} ${width / 2},${padding} ${width - padding + 4},${padding + 8}`} className="fill-brand-700" />
      {/* Floors */}
      {Array.from({ length: totalFloors }).map((_, i) => {
        const floor = totalFloors - i
        const isMine = floor === highlightFloor
        return (
          <g key={floor}>
            <rect
              x={padding}
              y={padding + 12 + i * (floorH + gap)}
              width={width - padding * 2}
              height={floorH}
              rx={3}
              className={isMine ? 'fill-brand' : 'fill-brand-100'}
            />
            {/* Windows */}
            <rect x={padding + 8} y={padding + 12 + i * (floorH + gap) + 4} width={10} height={floorH - 8} rx={1} className={isMine ? 'fill-white/80' : 'fill-brand-300'} />
            <rect x={padding + 22} y={padding + 12 + i * (floorH + gap) + 4} width={10} height={floorH - 8} rx={1} className={isMine ? 'fill-white/80' : 'fill-brand-300'} />
            <rect x={padding + 38} y={padding + 12 + i * (floorH + gap) + 4} width={10} height={floorH - 8} rx={1} className={isMine ? 'fill-white/80' : 'fill-brand-300'} />
            <rect x={padding + 52} y={padding + 12 + i * (floorH + gap) + 4} width={10} height={floorH - 8} rx={1} className={isMine ? 'fill-white/80' : 'fill-brand-300'} />
          </g>
        )
      })}
    </svg>
  )
}
