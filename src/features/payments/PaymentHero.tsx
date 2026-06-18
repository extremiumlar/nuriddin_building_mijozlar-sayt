import { useState } from 'react'
import { ArrowDownToLine, Eye, EyeOff, FileSignature, Sparkles, TrendingUp, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn, formatUZS, formatDate } from '@/lib/utils'
import type { PaymentSummary } from '@/types'

interface Props {
  summary: PaymentSummary
  overdueCount: number
  onPayClick: () => void
}

// Approximate USD rate for display only
const USD_RATE = 12_500

export function PaymentHero({ summary, overdueCount, onPayClick }: Props) {
  const [hidden, setHidden] = useState(false)
  const [unit, setUnit] = useState<'UZS' | 'USD'>('UZS')

  const pct = (summary.paidAmount / summary.totalAmount) * 100
  const display = (n: number) => {
    if (hidden) return '••••••••'
    if (unit === 'USD') return `$${Math.round(n / USD_RATE).toLocaleString('en-US')}`
    return formatUZS(n)
  }

  return (
    <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 text-white shadow-card-hover">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl pointer-events-none" />

      <div className="relative p-5 lg:p-6">
        {/* Top row: contract + unit toggle */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-brand-100">
            <FileSignature className="h-3.5 w-3.5" />
            <span>Shartnoma {summary.contractNumber}</span>
            <span className="opacity-60">·</span>
            <span>{formatDate(summary.contractDate, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="inline-flex bg-white/10 backdrop-blur rounded-full p-0.5">
              {(['UZS', 'USD'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
                  className={cn(
                    'px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-colors',
                    unit === u ? 'bg-white text-brand' : 'text-brand-100',
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
            <button
              onClick={() => setHidden((h) => !h)}
              className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur text-brand-100 hover:text-white"
              aria-label={hidden ? "Ko'rsatish" : 'Yashirish'}
              title={hidden ? "Ko'rsatish" : 'Yashirish'}
            >
              {hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Big balance */}
        <div className="mt-4">
          <p className="text-xs uppercase tracking-wider text-brand-100">To'langan</p>
          <div className="flex items-baseline gap-3 mt-1 flex-wrap">
            <span className="text-3xl lg:text-5xl font-extrabold tracking-tight">{display(summary.paidAmount)}</span>
            <span className="text-brand-100 text-sm">/ {display(summary.totalAmount)}</span>
          </div>
        </div>

        {/* Progress bar with markers */}
        <div className="mt-4">
          <div className="relative h-2 bg-white/15 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-brand-100">
            <span className="inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-300" />
              {pct.toFixed(1)}% to'langan
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              {display(summary.remainingAmount)} qoldi
            </span>
          </div>
        </div>

        {/* 4 metric chips */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Metric icon={<Sparkles className="h-3.5 w-3.5" />} label="Jami" value={display(summary.totalAmount)} />
          <Metric icon={<TrendingUp className="h-3.5 w-3.5 text-emerald-300" />} label="To'langan" value={display(summary.paidAmount)} />
          <Metric icon={<Wallet className="h-3.5 w-3.5" />} label="Qoldi" value={display(summary.remainingAmount)} />
          <Metric
            icon={<ArrowDownToLine className="h-3.5 w-3.5" />}
            label="Foiz"
            value={hidden ? '••%' : `${pct.toFixed(1)}%`}
          />
        </div>

        {/* CTA row */}
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <Button
            onClick={onPayClick}
            variant="primary"
            size="lg"
            className="bg-white text-brand hover:bg-brand-50 shadow-card"
          >
            To'lov qilish
          </Button>
          {overdueCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-danger/90 text-white text-xs font-semibold animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {overdueCount} ta kechikkan
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-[10px] p-2.5">
      <div className="flex items-center gap-1.5 text-brand-100 text-[10px] uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className="text-sm lg:text-base font-bold mt-1 truncate">{value}</p>
    </div>
  )
}
