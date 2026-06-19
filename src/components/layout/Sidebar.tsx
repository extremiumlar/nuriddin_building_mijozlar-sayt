import { NavLink } from 'react-router-dom'
import { navItems } from '@/config/navigation'
import { Logo } from '@/components/Logo'
import { cn } from '@/lib/utils'

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-surface border-r border-border h-screen sticky top-0">
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-border">
        <Logo size={36} background="dark" />
        <div>
          <p className="text-sm font-extrabold tracking-tight text-ink leading-tight">NURIDDIN</p>
          <p className="text-[10px] text-ink-muted tracking-[0.18em] leading-tight font-medium">BUILDINGS</p>
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
