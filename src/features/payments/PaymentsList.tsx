import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowDownToLine,
  Calendar,
  CheckCircle2,
  Clock,
  Receipt,
  Search,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { cn, daysBetween, formatDate, formatUZS } from '@/lib/utils'
import type { PaymentScheduleItem, PaymentStatus } from '@/types'

type Filter = 'all' | 'overdue' | 'pending' | 'paid'

interface Props {
  schedule: PaymentScheduleItem[] | undefined
  isLoading?: boolean
}

const meta: Record<PaymentStatus, { tone: 'success' | 'warning' | 'danger'; label: string; icon: React.ReactNode; bg: string; fg: string }> = {
  paid: {
    tone: 'success',
    label: "To'langan",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    bg: 'bg-success-bg',
    fg: 'text-success-fg',
  },
  pending: {
    tone: 'warning',
    label: 'Kutilmoqda',
    icon: <Clock className="h-3.5 w-3.5" />,
    bg: 'bg-warning-bg',
    fg: 'text-warning-fg',
  },
  overdue: {
    tone: 'danger',
    label: 'Kechikkan',
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    bg: 'bg-danger-bg',
    fg: 'text-danger-fg',
  },
}

export function PaymentsList({ schedule, isLoading }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const { notify } = useToast()

  const counts = useMemo(() => {
    if (!schedule) return { all: 0, overdue: 0, pending: 0, paid: 0 }
    return {
      all: schedule.length,
      overdue: schedule.filter((s) => s.status === 'overdue').length,
      pending: schedule.filter((s) => s.status === 'pending').length,
      paid: schedule.filter((s) => s.status === 'paid').length,
    }
  }, [schedule])

  const filtered = useMemo(() => {
    if (!schedule) return []
    let list = schedule
    if (filter !== 'all') list = list.filter((s) => s.status === filter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((s) => {
        const m = new Date(s.month).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' }).toLowerCase()
        return m.includes(q) || s.amount.toString().includes(q)
      })
    }
    // Sort: overdue → pending → paid (recent first)
    return list.slice().sort((a, b) => {
      const r = rank(a.status) - rank(b.status)
      if (r !== 0) return r
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }, [schedule, filter, search])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-brand" />
            To'lov grafigi
          </CardTitle>

          {/* Filter chips */}
          <div className="inline-flex bg-surface-muted rounded-[10px] p-0.5 overflow-x-auto scrollbar-thin">
            <Chip active={filter === 'all'} onClick={() => setFilter('all')} count={counts.all}>
              Hammasi
            </Chip>
            <Chip active={filter === 'overdue'} onClick={() => setFilter('overdue')} count={counts.overdue} accent="danger">
              Kechikkan
            </Chip>
            <Chip active={filter === 'pending'} onClick={() => setFilter('pending')} count={counts.pending} accent="warning">
              Kutilmoqda
            </Chip>
            <Chip active={filter === 'paid'} onClick={() => setFilter('paid')} count={counts.paid} accent="success">
              To'langan
            </Chip>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-subtle" />
          <input
            type="search"
            placeholder="Oy yoki summa qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-[8px] border border-border bg-surface pl-9 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-surface-subtle inline-flex items-center justify-center"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title="Natija topilmadi"
            description="Filter yoki qidiruvni o'zgartiring"
          />
        ) : (
          filtered.map((item) => {
            const m = meta[item.status]
            const overdueDays = item.status === 'overdue' ? daysBetween(new Date(item.dueDate), new Date()) : 0
            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-[10px] border border-border p-3 flex items-center gap-3 transition-all',
                  'hover:border-brand-200 hover:shadow-card',
                  item.status === 'overdue' && 'bg-danger-bg/30',
                )}
              >
                <div className={cn('h-10 w-10 rounded-[8px] flex items-center justify-center shrink-0', m.bg, m.fg)}>
                  <Calendar className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {new Date(item.month).toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    {item.status === 'paid' && item.paidDate
                      ? `To'langan: ${formatDate(item.paidDate)}`
                      : `Muddat: ${formatDate(item.dueDate)}`}
                  </p>
                </div>

                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-ink">{formatUZS(item.amount, { short: true })}</p>
                  <Badge tone={m.tone} icon={m.icon} pulse={item.status === 'overdue'} className="mt-0.5 text-[10px]">
                    {m.label}
                    {overdueDays > 0 && ` · ${overdueDays}k`}
                  </Badge>
                </div>

                <div className="sm:hidden text-right">
                  <p className="text-sm font-bold text-ink">{formatUZS(item.amount, { short: true })}</p>
                  <Badge tone={m.tone} pulse={item.status === 'overdue'} className="mt-0.5 text-[10px]">
                    {m.label}
                  </Badge>
                </div>

                {item.status === 'paid' ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => notify(`Chek: ${formatDate(item.month)}`, 'info')}
                    aria-label="PDF yuklab olish"
                    title="PDF chek"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={item.status === 'overdue' ? 'danger' : 'primary'}
                    onClick={() => notify(`To'lov: ${formatUZS(item.amount, { short: true })}`, 'info')}
                  >
                    To'lash
                  </Button>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

function rank(s: PaymentStatus) {
  return s === 'overdue' ? 0 : s === 'pending' ? 1 : 2
}

function Chip({
  active,
  onClick,
  count,
  children,
  accent,
}: {
  active: boolean
  onClick: () => void
  count?: number
  children: React.ReactNode
  accent?: 'danger' | 'warning' | 'success'
}) {
  const activeStyles = {
    danger: 'bg-danger text-white',
    warning: 'bg-warning text-white',
    success: 'bg-success text-white',
    undefined: 'bg-surface text-ink shadow-card',
  } as const
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-[7px] text-xs font-medium whitespace-nowrap transition-all inline-flex items-center gap-1.5',
        active ? activeStyles[accent ?? 'undefined'] : 'text-ink-muted hover:text-ink',
      )}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={cn(
            'px-1.5 py-0.5 rounded-full text-[10px]',
            active ? 'bg-white/25' : 'bg-surface-subtle text-ink-muted',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
