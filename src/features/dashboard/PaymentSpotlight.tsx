import { ArrowRight, CreditCard, TrendingUp, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { usePaymentSchedule, usePaymentSummary } from '@/api/payments'
import { formatUZS, formatDate } from '@/lib/utils'

export function PaymentSpotlight() {
  const { data: summary, isLoading: sLoading } = usePaymentSummary()
  const { data: schedule } = usePaymentSchedule()

  const nextPending = schedule?.find((s) => s.status !== 'paid')
  const overdue = schedule?.filter((s) => s.status === 'overdue').length ?? 0

  if (sLoading || !summary) {
    return <Skeleton className="h-64 rounded-card" />
  }

  const pct = (summary.paidAmount / summary.totalAmount) * 100

  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold text-ink">To'lov holati</span>
          </div>
          {overdue > 0 && (
            <Badge tone="danger" pulse>
              {overdue} kechikkan
            </Badge>
          )}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl lg:text-3xl font-bold text-ink">{formatUZS(summary.paidAmount, { short: true })}</span>
          <span className="text-sm text-ink-muted">/ {formatUZS(summary.totalAmount, { short: true })}</span>
        </div>
        <ProgressBar value={pct} tone="success" size="md" />
        <div className="flex items-center justify-between mt-1.5 text-[11px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {pct.toFixed(1)}% to'langan
          </span>
          <span className="inline-flex items-center gap-1">
            <Wallet className="h-3 w-3" />
            Qoldi: {formatUZS(summary.remainingAmount, { short: true })}
          </span>
        </div>
      </div>

      {nextPending && (
        <div className="p-4 bg-surface-muted/60 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] text-ink-muted uppercase tracking-wide">Keyingi to'lov</p>
            <p className="text-base font-semibold text-ink mt-0.5">{formatUZS(nextPending.amount, { short: true })}</p>
            <p className="text-xs text-ink-muted">{formatDate(nextPending.dueDate)}</p>
          </div>
          <Link to="/payments">
            <Button size="sm" variant={nextPending.status === 'overdue' ? 'danger' : 'primary'} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              {nextPending.status === 'overdue' ? "Qarzni to'lash" : "To'lov qilish"}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  )
}
