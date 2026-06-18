import { useMemo, useState } from 'react'
import { AlertCircle, ArrowDownToLine, Calendar, CheckCircle2, ChevronDown, ChevronUp, Clock, ListChecks } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { usePaymentSchedule } from '@/api/payments'
import { cn, formatDate, formatUZS, daysBetween } from '@/lib/utils'
import type { PaymentScheduleItem } from '@/types'

const statusMeta = {
  paid: {
    tone: 'success' as const,
    label: "To'langan",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  pending: {
    tone: 'warning' as const,
    label: 'Kutilmoqda',
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  overdue: {
    tone: 'danger' as const,
    label: 'Kechikkan',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
  },
}

const PREVIEW_COUNT = 3

export function PaymentScheduleCard() {
  const { data, isLoading } = usePaymentSchedule()
  const { notify } = useToast()
  const [expanded, setExpanded] = useState(false)

  // Sort: overdue → pending (next first) → paid (recent first); used for prioritized view
  const sorted = useMemo(() => {
    if (!data) return []
    const rank = (s: PaymentScheduleItem['status']) => (s === 'overdue' ? 0 : s === 'pending' ? 1 : 2)
    return [...data].sort((a, b) => {
      const r = rank(a.status) - rank(b.status)
      if (r !== 0) return r
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }, [data])

  const nextPending = useMemo(
    () => sorted.find((s) => s.status === 'pending') ?? sorted.find((s) => s.status !== 'paid'),
    [sorted],
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>To'lov grafigi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>To'lov grafigi</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={<Calendar className="h-6 w-6" />}
            title="Grafik yo'q"
            description="To'lov grafigi hozircha mavjud emas."
          />
        </CardContent>
      </Card>
    )
  }

  const shown = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT)

  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-brand" />
          To'lov grafigi
          <Badge tone="neutral">{data.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {shown.map((item) => {
          const meta = statusMeta[item.status]
          const isNext = nextPending?.id === item.id
          const overdueDays = item.status === 'overdue' ? daysBetween(new Date(item.dueDate), new Date()) : 0
          return (
            <div
              key={item.id}
              className={cn(
                'rounded-[10px] border p-3.5 flex items-center gap-3 flex-wrap',
                isNext ? 'border-brand bg-brand-50/40 ring-1 ring-brand-200' : 'border-border',
                item.status === 'overdue' && !isNext && 'bg-danger-bg/40',
              )}
            >
              <div
                className={cn(
                  'h-10 w-10 rounded-[8px] flex items-center justify-center shrink-0',
                  item.status === 'paid' && 'bg-success-bg text-success-fg',
                  item.status === 'pending' && 'bg-warning-bg text-warning-fg',
                  item.status === 'overdue' && 'bg-danger-bg text-danger-fg',
                )}
              >
                <Calendar className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-ink">
                    {new Date(item.month).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
                  </p>
                  {isNext && <Badge tone="brand">Keyingi</Badge>}
                </div>
                <p className="text-xs text-ink-muted mt-0.5">
                  {item.status === 'paid' && item.paidDate
                    ? `To'langan: ${formatDate(item.paidDate)}`
                    : `Muddat: ${formatDate(item.dueDate)}`}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-ink">{formatUZS(item.amount, { short: true })}</p>
                <Badge tone={meta.tone} icon={meta.icon} pulse={item.status === 'overdue'} className="mt-1">
                  {meta.label}
                  {overdueDays > 0 && ` · ${overdueDays} kun`}
                </Badge>
              </div>

              <div className="w-full sm:w-auto flex justify-end">
                {item.status === 'paid' ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<ArrowDownToLine className="h-3.5 w-3.5" />}
                    onClick={() => notify(`Chek: ${formatDate(item.month)}`, 'info')}
                  >
                    PDF chek
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={item.status === 'overdue' ? 'danger' : 'primary'}
                    onClick={() => notify(`To'lov boshlandi: ${formatUZS(item.amount, { short: true })}`, 'info')}
                  >
                    To'lash
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        {sorted.length > PREVIEW_COUNT && (
          <Button
            variant="ghost"
            fullWidth
            onClick={() => setExpanded((e) => !e)}
            rightIcon={expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          >
            {expanded ? 'Yopish' : `Barchasini ko'rish (${sorted.length - PREVIEW_COUNT} ta yana)`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
