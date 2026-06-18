import { useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { formatUZS } from '@/lib/utils'
import type { PaymentScheduleItem } from '@/types'

interface Props {
  schedule: PaymentScheduleItem[] | undefined
  totalPrice: number
  isLoading?: boolean
}

export function PaymentChart({ schedule, totalPrice, isLoading }: Props) {
  const data = useMemo(() => {
    if (!schedule) return []
    const sorted = [...schedule].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    let cumulPlan = 0
    let cumulActual = 0
    return sorted.map((s) => {
      cumulPlan += s.amount
      if (s.status === 'paid') cumulActual += s.amount
      const d = new Date(s.month)
      return {
        label: d.toLocaleDateString('uz-UZ', { month: 'short', year: '2-digit' }),
        plan: cumulPlan,
        actual: s.status === 'paid' ? cumulActual : null,
      }
    })
  }, [schedule])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>To'lov grafigi</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    )
  }

  if (!schedule || schedule.length === 0) return null

  const lastActual = [...data].reverse().find((d) => d.actual !== null)?.actual ?? 0
  const expectedAtNow = (() => {
    const today = Date.now()
    let total = 0
    schedule.forEach((s) => {
      if (new Date(s.dueDate).getTime() <= today) total += s.amount
    })
    return total
  })()
  const variance = lastActual - expectedAtNow
  const onTrack = variance >= 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand" />
              Reja vs Fakt
            </CardTitle>
            <p className="text-xs text-ink-muted mt-0.5">Kumulyativ to'lov dinamikasi</p>
          </div>
          <Badge tone={onTrack ? 'success' : 'warning'}>
            {onTrack
              ? `Rejada · +${formatUZS(Math.abs(variance), { short: true })}`
              : `Orqada · −${formatUZS(Math.abs(variance), { short: true })}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#6B7280' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => {
                  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`
                  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(0)}M`
                  return v.toString()
                }}
                domain={[0, totalPrice * 1.05]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="plan"
                stroke="#9CA3AF"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="Reja"
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#16A34A"
                strokeWidth={2.5}
                fill="url(#actualGrad)"
                dot={{ r: 3, fill: '#16A34A', strokeWidth: 0 }}
                connectNulls={false}
                name="Fakt"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend below */}
        <div className="flex items-center justify-center gap-5 mt-2 text-xs">
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <span className="inline-block w-4 border-b-2 border-dashed border-ink-subtle" />
            Reja
          </span>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <span className="inline-block w-4 h-0.5 bg-success rounded-full" />
            Fakt
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null
  const plan = payload.find((p) => p.dataKey === 'plan')?.value as number | undefined
  const actual = payload.find((p) => p.dataKey === 'actual')?.value as number | undefined
  return (
    <div className="bg-ink text-white rounded-[8px] shadow-card-hover px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {plan !== undefined && (
        <p className="text-white/80">Reja: <span className="font-semibold text-white">{formatUZS(plan, { short: true })}</span></p>
      )}
      {actual !== undefined && actual !== null && (
        <p className="text-success">Fakt: <span className="font-semibold">{formatUZS(actual, { short: true })}</span></p>
      )}
    </div>
  )
}
