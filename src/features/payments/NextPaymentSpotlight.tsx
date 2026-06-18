import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, Calendar, Clock, ShieldCheck, Zap } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn, daysBetween, formatDate, formatUZS } from '@/lib/utils'
import type { PaymentScheduleItem } from '@/types'

interface Props {
  item: PaymentScheduleItem
  onPayClick: () => void
}

function calc(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, finished: true }
  return {
    d: Math.floor(diff / 86_400_000),
    h: Math.floor((diff / 3_600_000) % 24),
    m: Math.floor((diff / 60_000) % 60),
    finished: false,
  }
}

export function NextPaymentSpotlight({ item, onPayClick }: Props) {
  const due = new Date(item.dueDate)
  const isOverdue = item.status === 'overdue'
  const [t, setT] = useState(() => calc(due))

  useEffect(() => {
    const id = setInterval(() => setT(calc(due)), 60_000)
    return () => clearInterval(id)
  }, [due])

  const daysLeft = daysBetween(new Date(), due)
  const overdueDays = isOverdue ? daysBetween(due, new Date()) : 0

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-2',
        isOverdue ? 'border-danger/40 bg-gradient-to-br from-danger-bg via-surface to-surface' : 'border-brand-200 bg-gradient-to-br from-brand-50 via-surface to-surface',
      )}
    >
      <div className="p-5 lg:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
              {isOverdue ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-danger" />
                  Kechikkan to'lov
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 text-brand" />
                  Keyingi to'lov
                </>
              )}
            </div>
            <p className="text-[11px] text-ink-muted mt-1 inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(item.dueDate, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {isOverdue ? (
            <Badge tone="danger" pulse>
              +{overdueDays} kun
            </Badge>
          ) : daysLeft <= 3 ? (
            <Badge tone="warning">{daysLeft === 0 ? 'Bugun' : daysLeft === 1 ? 'Ertaga' : `${daysLeft} kun qoldi`}</Badge>
          ) : (
            <Badge tone="neutral">{daysLeft} kun qoldi</Badge>
          )}
        </div>

        {/* Big amount */}
        <div>
          <p className="text-4xl lg:text-5xl font-extrabold text-ink tracking-tight">
            {formatUZS(item.amount, { short: true })}
          </p>
          <p className="text-sm text-ink-muted mt-1">{formatUZS(item.amount)}</p>
        </div>

        {/* Countdown chips (only if not overdue and within 7 days) */}
        {!isOverdue && !t.finished && daysLeft <= 7 && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning-bg text-warning-fg text-xs font-medium">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {t.d > 0 && `${t.d} kun `}
              {t.h} soat {t.m} daqiqa qoldi
            </span>
          </div>
        )}

        {/* CTA + safety note */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <Button
            onClick={onPayClick}
            size="lg"
            variant={isOverdue ? 'danger' : 'primary'}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="shadow-card-hover"
          >
            Hozir to'lash
          </Button>
          <div className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-success" />
            Xavfsiz to'lov · Click/Payme/UzCard
          </div>
        </div>
      </div>
    </Card>
  )
}
