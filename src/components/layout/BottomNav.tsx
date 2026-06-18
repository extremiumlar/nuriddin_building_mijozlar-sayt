import { NavLink } from 'react-router-dom'
import { mobileNav } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40 pb-safe">
      <ul className="grid grid-cols-5">
        {mobileNav.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium',
                  isActive ? 'text-brand' : 'text-ink-subtle',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.shortLabel ?? item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
