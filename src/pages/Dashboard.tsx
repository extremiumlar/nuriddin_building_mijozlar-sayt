import { StoriesStrip } from '@/features/dashboard/StoriesStrip'
import { WelcomeHero, calculateHeroStats } from '@/features/dashboard/WelcomeHero'
import { MyApartmentStages } from '@/features/dashboard/MyApartmentStages'
import { PaymentSpotlight } from '@/features/dashboard/PaymentSpotlight'
import { UpcomingEvents } from '@/features/dashboard/UpcomingEvents'
import { QuickBookingWidget } from '@/features/dashboard/QuickBookingWidget'
import { WeatherCard } from '@/features/dashboard/WeatherCard'
import { AnnouncementsList } from '@/features/dashboard/AnnouncementsList'
import { ActivityFeed } from '@/features/dashboard/ActivityFeed'
import { QuickActionsGrid } from '@/features/dashboard/QuickActionsGrid'
import { useApartmentInfo, useFinancialSummary } from '@/api/profile'
import { usePaymentSchedule } from '@/api/payments'

export function DashboardPage() {
  const { data: apt } = useApartmentInfo()
  const { data: fin } = useFinancialSummary()
  const { data: schedule } = usePaymentSchedule()

  const overdueCount = schedule?.filter((s) => s.status === 'overdue').length ?? 0
  const { daysToDelivery, paidPct } = calculateHeroStats({
    estimatedDelivery: apt?.estimatedDelivery,
    paidAmount: fin?.paidTotal,
    totalAmount: fin?.totalPrice,
  })

  return (
    <div className="space-y-5">
      {/* Row 0: Stories */}
      <StoriesStrip />

      {/* Row 1: hero */}
      <WelcomeHero overdueCount={overdueCount} daysToDelivery={daysToDelivery} paidPct={paidPct} />

      {/* Row 2: My apartment stages + Payment spotlight */}
      <div className="grid lg:grid-cols-2 gap-5">
        <MyApartmentStages />
        <PaymentSpotlight />
      </div>

      {/* Row 3: Upcoming events + Weather (both list-like, balanced height) */}
      <div className="grid lg:grid-cols-2 gap-5">
        <UpcomingEvents />
        <WeatherCard />
      </div>

      {/* Row 4: Quick booking (full width) */}
      <QuickBookingWidget />

      {/* Row 5: Announcements + Activity */}
      <div className="grid lg:grid-cols-2 gap-5">
        <AnnouncementsList />
        <ActivityFeed />
      </div>

      {/* Row 6: Quick actions grid */}
      <section>
        <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">Tezkor harakatlar</h2>
        <QuickActionsGrid />
      </section>
    </div>
  )
}
