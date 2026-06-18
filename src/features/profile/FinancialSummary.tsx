import { AlertTriangle, CalendarCheck, Coins, CreditCard, TrendingDown, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatUZS, formatDate, cn } from '@/lib/utils'
import { useFinancialSummary } from '@/api/profile'
import { useToast } from '@/components/ui/Toast'

function monthsLabel(months: number): string {
  if (months === 0) return "To'lov tugagan"
  if (months === 1) return 'Oxirgi to\'lov'
  return `${months} oy qoldi`
}

export function FinancialSummary() {
  const { data, isLoading } = useFinancialSummary()
  const { notify } = useToast()

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Moliyaviy holat</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80" />
        </CardContent>
      </Card>
    )
  }

  const paidPct = (data.paidTotal / data.totalPrice) * 100
  const remainingPct = 100 - paidPct
  const initialPct = (data.initialPayment / data.totalPrice) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-brand" />
          Moliyaviy holat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Total price banner */}
        <div className="rounded-[12px] bg-gradient-to-br from-brand to-brand-800 text-white p-4 lg:p-5">
          <p className="text-xs text-brand-100 uppercase tracking-wide">Umumiy narx</p>
          <p className="text-2xl lg:text-3xl font-bold mt-1">{formatUZS(data.totalPrice)}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-xs">
            <CreditCard className="h-3 w-3" />
            Boshlang'ich: {initialPct.toFixed(0)}% · {formatUZS(data.initialPayment, { short: true })}
            <span className="text-white/70">· {formatDate(data.initialPaymentDate)}</span>
          </div>
        </div>

        {/* 2x2 metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Metric
            tone="success"
            icon={<Wallet className="h-3.5 w-3.5" />}
            label="To'langan"
            value={formatUZS(data.paidTotal, { short: true })}
            sub={`${paidPct.toFixed(0)}%`}
          />
          <Metric
            tone="neutral"
            icon={<TrendingDown className="h-3.5 w-3.5" />}
            label="Qolgan"
            value={formatUZS(data.remainingTotal, { short: true })}
            sub={`${remainingPct.toFixed(0)}%`}
          />
          <Metric
            tone="brand"
            icon={<CreditCard className="h-3.5 w-3.5" />}
            label="Oylik to'lov"
            value={formatUZS(data.monthlyPayment, { short: true })}
            sub={`${data.totalMonths} oy ichida`}
          />
          <Metric
            tone="warning"
            icon={<CalendarCheck className="h-3.5 w-3.5" />}
            label="Muddat"
            value={monthsLabel(data.remainingMonths)}
            sub={`/ ${data.totalMonths} oy`}
          />
        </div>

        {/* Overall progress */}
        <div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-ink-muted">Umumiy to'lov holati</span>
            <span className="font-semibold text-ink">{paidPct.toFixed(0)}% to'langan</span>
          </div>
          <ProgressBar value={paidPct} tone="success" size="lg" />
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-ink-muted">
            <span>{formatUZS(data.paidTotal, { short: true })}</span>
            <span>{formatUZS(data.totalPrice, { short: true })}</span>
          </div>
        </div>

        {/* Next payment */}
        <div className="rounded-[10px] border border-brand-200 bg-brand-50 p-3.5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] text-brand-700 uppercase tracking-wide">Keyingi to'lov</p>
              <p className="text-base font-semibold text-ink mt-0.5">
                {formatUZS(data.nextPaymentAmount, { short: true })}
              </p>
              <p className="text-xs text-ink-muted mt-0.5">
                {formatDate(data.nextPaymentDate, { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Button onClick={() => notify("To'lov tizimi ochilmoqda...", 'info')}>To'lash</Button>
          </div>
        </div>

        {/* Debt block — only when debt > 0 */}
        {data.debt > 0 && (
          <div className="rounded-[12px] bg-danger text-white p-4 lg:p-5 shadow-card-hover">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">Qarzdorlik</p>
                  <Badge tone="danger" className="bg-white/15 text-white">
                    {data.debtDays} kun kechikkan
                  </Badge>
                </div>
                <p className="text-2xl font-bold mt-1.5">{formatUZS(data.debt)}</p>
                {data.penaltyAmount > 0 && (
                  <p className="text-xs text-white/85 mt-1">
                    Jarima: <span className="font-semibold">{formatUZS(data.penaltyAmount, { short: true })}</span>
                  </p>
                )}
              </div>
            </div>
            <Button
              fullWidth
              className={cn('mt-4 bg-white text-danger hover:bg-red-50')}
              onClick={() => notify("Qarzdorlikni to'lash ekrani ochilmoqda", 'info')}
            >
              Hozir to'lash
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Metric({
  tone,
  icon,
  label,
  value,
  sub,
}: {
  tone: 'success' | 'warning' | 'brand' | 'neutral'
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  const toneClasses = {
    success: 'bg-success-bg border-success/20',
    warning: 'bg-warning-bg border-warning/20',
    brand: 'bg-brand-50 border-brand/20',
    neutral: 'bg-surface-muted border-border',
  }
  const textTone = {
    success: 'text-success-fg',
    warning: 'text-warning-fg',
    brand: 'text-brand-700',
    neutral: 'text-ink-muted',
  }
  return (
    <div className={cn('rounded-[10px] border p-3', toneClasses[tone])}>
      <div className={cn('flex items-center gap-1.5 text-xs', textTone[tone])}>
        {icon}
        {label}
      </div>
      <p className="text-lg lg:text-xl font-bold text-ink mt-1.5">{value}</p>
      {sub && <p className="text-[11px] text-ink-muted mt-0.5">{sub}</p>}
    </div>
  )
}
