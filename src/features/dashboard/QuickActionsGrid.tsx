import {
  ArrowRight,
  Building2,
  CalendarRange,
  CreditCard,
  FileText,
  Gift,
  HardHat,
  LifeBuoy,
  Ticket,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'

interface Action {
  to: string
  label: string
  description: string
  icon: LucideIcon
  color: string
}

const actions: Action[] = [
  {
    to: '/construction',
    label: 'Qurilish',
    description: 'Foto/video hisobotlar',
    icon: HardHat,
    color: 'text-brand bg-brand-50',
  },
  {
    to: '/payments',
    label: "To'lovlar",
    description: 'Grafik va chek',
    icon: CreditCard,
    color: 'text-success-fg bg-success-bg',
  },
  {
    to: '/lottery',
    label: 'Loterеya',
    description: 'Chiptalar va g\'oliblar',
    icon: Ticket,
    color: 'text-amber-700 bg-amber-50',
  },
  {
    to: '/booking',
    label: 'Bron',
    description: 'Bilyard, basseyn, gym...',
    icon: CalendarRange,
    color: 'text-rose-700 bg-rose-50',
  },
  {
    to: '/profile?section=documents',
    label: 'Hujjatlar',
    description: 'PDF yuklab olish',
    icon: FileText,
    color: 'text-teal-700 bg-teal-50',
  },
  {
    to: '/profile?section=referral',
    label: 'Referal',
    description: 'Do\'stim taklif → bonus',
    icon: Gift,
    color: 'text-pink-700 bg-pink-50',
  },
  {
    to: '/profile?section=support',
    label: 'Murojaat',
    description: 'Savol yoki muammo',
    icon: LifeBuoy,
    color: 'text-orange-700 bg-orange-50',
  },
  {
    to: '/profile',
    label: 'Mening uyim',
    description: "Kvartira ma'lumotlari",
    icon: Building2,
    color: 'text-indigo-700 bg-indigo-50',
  },
]

export function QuickActionsGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((a) => (
        <Link key={a.to} to={a.to} className="group">
          <Card className="p-3.5 h-full hover:shadow-card-hover hover:border-brand-200 transition-all">
            <div className={`h-10 w-10 rounded-[10px] flex items-center justify-center ${a.color}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-ink mt-2.5">{a.label}</p>
            <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-1">{a.description}</p>
            <div className="flex items-center justify-end mt-2 text-ink-subtle group-hover:text-brand transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
