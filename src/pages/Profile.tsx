import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { ProfileHeader } from '@/features/profile/ProfileHeader'
import { ApartmentInfoCard } from '@/features/profile/ApartmentInfoCard'
import { FinancialSummary } from '@/features/profile/FinancialSummary'
import { PaymentScheduleCard } from '@/features/profile/PaymentScheduleCard'
import { DocumentsSection } from '@/features/profile/DocumentsSection'
import { ReferralSystem } from '@/features/profile/ReferralSystem'
import { ProfileNotificationSettings } from '@/features/profile/ProfileNotificationSettings'
import { RecentTickets } from '@/features/profile/RecentTickets'
import { SecuritySection } from '@/features/profile/SecuritySection'
import { AuditLog } from '@/features/profile/AuditLog'
import { useProfile } from '@/api/profile'

export function ProfilePage() {
  const { data, isLoading } = useProfile()
  const { notify } = useToast()

  return (
    <div className="space-y-5">
      {/* 1. Profile header */}
      {isLoading || !data ? (
        <Skeleton className="h-60" />
      ) : (
        <ProfileHeader user={data} onEdit={() => notify('Profil tahrirlash tez kunda', 'info')} />
      )}

      {/* 2. Apartment info */}
      <ApartmentInfoCard />

      {/* 3. Financial summary — markaziy blok */}
      <FinancialSummary />

      {/* 4. Payment schedule (collapsible) */}
      <PaymentScheduleCard />

      {/* 5. Documents + 6. Referral */}
      <div className="grid lg:grid-cols-2 gap-5">
        <DocumentsSection />
        <ReferralSystem />
      </div>

      {/* 7. Notifications + 8. Recent tickets */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ProfileNotificationSettings />
        <RecentTickets />
      </div>

      {/* 9. Security + Audit log */}
      <div className="grid lg:grid-cols-2 gap-5">
        <SecuritySection />
        <AuditLog />
      </div>
    </div>
  )
}
