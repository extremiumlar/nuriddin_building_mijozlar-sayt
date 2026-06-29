import {
  LayoutDashboard,
  HardHat,
  CreditCard,
  Ticket,
  CalendarRange,
  User,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  shortLabel?: string
}

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortLabel: 'Asosiy' },
  { to: '/construction', label: 'Qurilish', icon: HardHat, shortLabel: 'Qurilish' },
  { to: '/payments', label: "To'lovlar", icon: CreditCard, shortLabel: "To'lov" },
  { to: '/lottery', label: 'Omadli mijoz', icon: Ticket, shortLabel: 'Omadli' },
  { to: '/booking', label: 'Bron qilish', icon: CalendarRange, shortLabel: 'Bron' },
  { to: '/profile', label: 'Profil', icon: User, shortLabel: 'Profil' },
]

export const mobileNav: NavItem[] = navItems
