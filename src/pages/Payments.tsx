import { useMemo, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { PaymentHero } from '@/features/payments/PaymentHero'
import { NextPaymentSpotlight } from '@/features/payments/NextPaymentSpotlight'
import { YearTimeline } from '@/features/payments/YearTimeline'
import { PaymentChart } from '@/features/payments/PaymentChart'
import { PaymentMethodsCard } from '@/features/payments/PaymentMethodsCard'
import { PaymentsList } from '@/features/payments/PaymentsList'
import { NotificationSettings } from '@/features/payments/NotificationSettings'
import { usePaymentSchedule, usePaymentSummary } from '@/api/payments'

export function PaymentsPage() {
  const { data: summary, isLoading: summaryLoading } = usePaymentSummary()
  const { data: schedule, isLoading: scheduleLoading } = usePaymentSchedule()
  const { notify } = useToast()
  const [showSettings, setShowSettings] = useState(false)

  const next = useMemo(() => {
    if (!schedule) return undefined
    const overdue = schedule.find((s) => s.status === 'overdue')
    if (overdue) return overdue
    return schedule.find((s) => s.status === 'pending')
  }, [schedule])

  const overdueCount = schedule?.filter((s) => s.status === 'overdue').length ?? 0

  const handlePay = () => notify("To'lov tizimi ochilmoqda...", 'info')

  return (
    <div className="space-y-5">
      {/* Row 1: Hero (full width) */}
      {summaryLoading || !summary ? (
        <Skeleton className="h-64" />
      ) : (
        <PaymentHero summary={summary} overdueCount={overdueCount} onPayClick={handlePay} />
      )}

      {/* Row 2: Next payment + Payment methods (2 col on lg) */}
      <div className="grid lg:grid-cols-2 gap-5">
        {scheduleLoading || !next ? (
          <Skeleton className="h-56" />
        ) : (
          <NextPaymentSpotlight item={next} onPayClick={handlePay} />
        )}
        <PaymentMethodsCard />
      </div>

      {/* Row 3: Year timeline (full) */}
      <YearTimeline schedule={schedule} isLoading={scheduleLoading} />

      {/* Row 4: Chart (full) */}
      {summary && (
        <PaymentChart schedule={schedule} totalPrice={summary.totalAmount} isLoading={scheduleLoading} />
      )}

      {/* Row 5: Filtered list */}
      <PaymentsList schedule={schedule} isLoading={scheduleLoading} />

      {/* Row 6: Settings (toggleable) */}
      <section>
        <button
          onClick={() => setShowSettings((s) => !s)}
          className="w-full flex items-center gap-2 text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3 hover:text-ink"
        >
          <Settings2 className="h-4 w-4" />
          Eslatma sozlamalari
          <span className="text-xs font-normal text-ink-subtle ml-auto normal-case tracking-normal">
            {showSettings ? 'Yashirish' : "Ko'rsatish"}
          </span>
        </button>
        {showSettings && (
          <div className="max-w-2xl">
            <NotificationSettings />
          </div>
        )}
      </section>
    </div>
  )
}
