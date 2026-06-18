import { Activity, CloudSun, Hammer, Truck, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { BlockProgressCard } from '@/features/construction/BlockProgressCard'
import { AnimatedNumber } from '@/components/motion'
import { useBlocks, useDailyResources } from '@/api/construction'

export function OverviewTab() {
  const { data: blocks, isLoading: blocksLoading } = useBlocks()
  const { data: resources } = useDailyResources()

  return (
    <div className="space-y-5">
      {/* Daily resources strip */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" />
            Bugun saytda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!resources ? (
            <Skeleton className="h-24" />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ResourceMetric
                icon={<Users className="h-4 w-4" />}
                label="Ishchilar"
                value={resources.workerCount}
                unit="kishi"
                tone="bg-brand-50 dark:bg-brand/15 text-brand"
              />
              <ResourceMetric
                icon={<Hammer className="h-4 w-4" />}
                label="Sement"
                value={resources.cementTons}
                unit="tonna"
                decimals={1}
                tone="bg-warning-bg text-warning-fg"
              />
              <ResourceMetric
                icon={<Truck className="h-4 w-4" />}
                label="Kran"
                value={resources.craneCount}
                unit="dona"
                tone="bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300"
              />
              <ResourceMetric
                icon={<CloudSun className="h-4 w-4" />}
                label="Ob-havo"
                value={null}
                customText={resources.weatherNote ?? "Ma'lumot yo'q"}
                tone="bg-success-bg text-success-fg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blocks grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {blocksLoading
          ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-80" />)
          : blocks?.map((b) => <BlockProgressCard key={b.id} block={b} expanded />)}
      </div>
    </div>
  )
}

function ResourceMetric({
  icon,
  label,
  value,
  unit,
  decimals = 0,
  customText,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number | null
  unit?: string
  decimals?: number
  customText?: string
  tone: string
}) {
  return (
    <div className="rounded-element border border-border p-3.5">
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded-element flex items-center justify-center ${tone}`}>{icon}</div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2.5">
        {value !== null ? (
          <p className="text-2xl font-extrabold text-ink tracking-tight">
            <AnimatedNumber
              value={value}
              duration={1100}
              format={(n) => (decimals ? n.toFixed(decimals) : String(n))}
            />
            {unit && <span className="text-xs font-medium text-ink-muted ml-1">{unit}</span>}
          </p>
        ) : (
          <p className="text-sm text-ink leading-snug">{customText}</p>
        )}
      </div>
    </div>
  )
}
