import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { initials } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="h-16 px-4 lg:px-6 glass border-b border-border sticky top-0 z-30 flex items-center gap-2 lg:gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-base lg:text-lg font-semibold text-ink truncate leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-ink-muted truncate">{subtitle}</p>}
      </div>

      <div className="hidden md:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" />
        <input
          type="search"
          placeholder="Qidirish..."
          className="h-10 w-64 rounded-[8px] bg-surface-muted border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand"
        />
      </div>

      <ThemeToggle />

      <button
        className="h-10 w-10 rounded-full hover:bg-surface-subtle inline-flex items-center justify-center text-ink-muted relative"
        aria-label="Xabarnomalar"
      >
        <Bell className="h-[18px] w-[18px]" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger" />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 inline-flex items-center justify-center text-sm font-semibold">
          {user ? initials(user.fullName) : 'M'}
        </div>
        <div className="hidden md:block min-w-0 max-w-[140px]">
          <p className="text-sm font-medium text-ink truncate leading-tight">{user?.fullName ?? 'Mijoz'}</p>
          <p className="text-[11px] text-ink-muted truncate">{user?.contractNumber ?? 'Mehmon'}</p>
        </div>
        <button
          onClick={onLogout}
          className="h-10 w-10 rounded-full hover:bg-surface-subtle inline-flex items-center justify-center text-ink-muted"
          aria-label="Chiqish"
          title="Chiqish"
        >
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </header>
  )
}
