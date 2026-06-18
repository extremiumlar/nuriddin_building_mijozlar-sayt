import { NavLink } from 'react-router-dom'
import { Building } from 'lucide-react'
import { navItems } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface border-r border-border h-screen sticky top-0">
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-border">
        <div className="h-9 w-9 rounded-[10px] bg-brand flex items-center justify-center shadow-card">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink leading-tight">Mijoz portali</p>
          <p className="text-[11px] text-ink-muted leading-tight">Build Co.</p>
        </div>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-muted hover:bg-surface-subtle hover:text-ink',
                  )
                }
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-border text-[11px] text-ink-subtle">
        v0.1.0 · 2026
      </div>
    </aside>
  )
}
