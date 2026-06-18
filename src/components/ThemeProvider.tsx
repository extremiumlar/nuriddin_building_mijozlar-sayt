import { useEffect, type ReactNode } from 'react'
import { useThemeStore } from '@/store/theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)

  // Initial apply on mount
  useEffect(() => {
    setMode(mode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen to system preference when in 'system' mode
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handle = () => setMode('system')
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [mode, setMode])

  return <>{children}</>
}
