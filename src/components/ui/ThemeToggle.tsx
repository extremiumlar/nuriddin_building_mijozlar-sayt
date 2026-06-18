import { Moon, Sun, Monitor } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useThemeStore, type ThemeMode } from '@/store/theme'
import { cn } from '@/lib/utils'

interface Option {
  value: ThemeMode
  label: string
  icon: typeof Sun
}

const options: Option[] = [
  { value: 'light', label: 'Yorug\'', icon: Sun },
  { value: 'dark', label: 'Qorong\'i', icon: Moon },
  { value: 'system', label: 'Tizim', icon: Monitor },
]

export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode)
  const resolved = useThemeStore((s) => s.resolved)
  const setMode = useThemeStore((s) => s.setMode)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const current = options.find((o) => o.value === mode) ?? options[2]
  const CurrentIcon = resolved === 'dark' ? Moon : Sun

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-10 w-10 rounded-full hover:bg-surface-subtle inline-flex items-center justify-center text-ink-muted hover:text-ink transition-colors press"
        aria-label={`Mavzu: ${current.label}`}
        title={`Mavzu: ${current.label}`}
      >
        <CurrentIcon className="h-[18px] w-[18px]" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 min-w-[160px] bg-surface border border-border rounded-element shadow-card-hover p-1 animate-slide-up">
          {options.map((opt) => {
            const Icon = opt.icon
            const active = mode === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setMode(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand/15 dark:text-brand-300'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-subtle',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {opt.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
