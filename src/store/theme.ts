import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  mode: ThemeMode
  resolved: 'light' | 'dark'
  setMode: (m: ThemeMode) => void
  toggle: () => void
}

const getSystem = (): 'light' | 'dark' =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const resolve = (m: ThemeMode): 'light' | 'dark' => (m === 'system' ? getSystem() : m)

const apply = (resolved: 'light' | 'dark') => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (resolved === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  root.style.colorScheme = resolved
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      resolved: resolve('system'),
      setMode: (mode) => {
        const resolved = resolve(mode)
        apply(resolved)
        set({ mode, resolved })
      },
      toggle: () => {
        const { resolved } = get()
        const next: ThemeMode = resolved === 'dark' ? 'light' : 'dark'
        apply(next)
        set({ mode: next, resolved: next })
      },
    }),
    {
      name: 'mijoz-theme',
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const resolved = resolve(state.mode)
        state.resolved = resolved
        apply(resolved)
      },
    },
  ),
)
