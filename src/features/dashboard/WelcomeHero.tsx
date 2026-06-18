import { Bell, MapPin, Sparkles, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { AnimatedNumber } from '@/components/motion'
import { useAuthStore } from '@/store/auth'
import { daysBetween } from '@/lib/utils'

interface Props {
  overdueCount: number
  daysToDelivery: number
  paidPct: number
}

const greetForHour = () => {
  const h = new Date().getHours()
  if (h < 6) return 'Hayrli tun'
  if (h < 12) return "Xayrli tong"
  if (h < 18) return "Xayrli kun"
  return 'Xayrli kech'
}

export function WelcomeHero({ overdueCount, daysToDelivery, paidPct }: Props) {
  const user = useAuthStore((s) => s.user)
  const first = user?.fullName.split(' ')[0] ?? 'Mijoz'

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand via-brand-700 to-brand-900 rounded-card p-5 lg:p-6 text-white">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-10 h-60 w-60 rounded-full bg-brand-300/20 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <p className="text-brand-100 text-sm">{greetForHour()},</p>
          <h2 className="text-2xl lg:text-3xl font-bold mt-1 truncate">{first}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {user?.apartment && (
              <span className="inline-flex items-center gap-1.5 text-xs text-brand-100">
                <MapPin className="h-3.5 w-3.5" />
                {user.apartment.block}, #{user.apartment.number}
              </span>
            )}
            {user?.contractNumber && (
              <span className="inline-flex items-center gap-1.5 text-xs text-brand-100">
                · {user.contractNumber}
              </span>
            )}
          </div>
        </div>

        {overdueCount > 0 && (
          <Badge tone="danger" pulse className="bg-white/15 text-white border-0">
            <Bell className="h-3 w-3" />
            {overdueCount} ta kechikkan to'lov
          </Badge>
        )}
      </div>

      {/* Hero metrics ribbon */}
      <div className="relative mt-5 grid grid-cols-3 gap-2.5">
        <HeroMetric
          icon={<Sparkles className="h-3.5 w-3.5" />}
          label="Topshirilishga qadar"
          value={daysToDelivery > 0 ? `${daysToDelivery}` : '0'}
          unit="kun"
        />
        <HeroMetric
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="To'langan"
          value={`${Math.round(paidPct)}`}
          unit="%"
        />
        <HeroMetric icon={<Bell className="h-3.5 w-3.5" />} label="Faol bron" value="1" unit="ta" />
      </div>
    </div>
  )
}

function HeroMetric({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
}) {
  const num = parseInt(value, 10)
  const isNum = !Number.isNaN(num) && String(num) === value
  return (
    <div className="bg-white/10 backdrop-blur rounded-element p-2.5 lg:p-3">
      <div className="flex items-center gap-1.5 text-brand-100 text-[10px] lg:text-xs">
        {icon}
        {label}
      </div>
      <p className="text-xl lg:text-2xl font-extrabold mt-1 tracking-tight">
        {isNum ? <AnimatedNumber value={num} duration={1100} format={(n) => String(n)} /> : value}{' '}
        <span className="text-xs font-medium text-brand-100">{unit}</span>
      </p>
    </div>
  )
}

export function calculateHeroStats(opts: {
  estimatedDelivery?: string
  paidAmount?: number
  totalAmount?: number
}) {
  const daysToDelivery = opts.estimatedDelivery ? Math.max(0, daysBetween(new Date(), new Date(opts.estimatedDelivery))) : 0
  const paidPct = opts.totalAmount && opts.totalAmount > 0 ? (opts.paidAmount ?? 0) / opts.totalAmount * 100 : 0
  return { daysToDelivery, paidPct }
}
