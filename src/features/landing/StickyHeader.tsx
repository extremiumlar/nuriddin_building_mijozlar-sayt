import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { appConfig } from '@/config/app'

const navItems = [
  { label: 'Imkoniyatlar', href: '#features' },
  { label: 'Loyihalar', href: '#projects' },
  { label: 'Sharhlar', href: '#testimonials' },
  { label: 'Yangiliklar', href: '#news' },
]

export function StickyHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300 ease-apple',
        scrolled
          ? 'glass border-b border-border shadow-xs'
          : 'bg-transparent border-b border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="h-9 w-9 rounded-element bg-brand flex items-center justify-center shadow-card">
            <Building className="h-4 w-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-ink leading-tight">{appConfig.companyName}</p>
            <p className="text-[10px] text-ink-muted leading-tight">Mijozlar portali</p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-ink-muted hover:text-ink rounded-element hover:bg-surface-subtle transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="primary" size="md">
              Kirish
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
