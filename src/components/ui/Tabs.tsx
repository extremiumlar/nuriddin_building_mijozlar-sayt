import { cn } from '@/lib/utils'

interface Tab {
  value: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-surface-subtle rounded-[10px] overflow-x-auto scrollbar-thin',
        className,
      )}
    >
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              'px-3.5 py-1.5 rounded-[7px] text-sm font-medium whitespace-nowrap transition-all',
              active
                ? 'bg-surface text-ink shadow-card'
                : 'text-ink-muted hover:text-ink',
            )}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span
                className={cn(
                  'ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]',
                  active ? 'bg-brand-50 text-brand' : 'bg-surface-subtle text-ink-muted',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
