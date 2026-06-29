import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  rememberMe: boolean
  isHydrated: boolean

  // Uysot CRM real customer linkage
  uysotContractId: number | null
  uysotLeadId: number | null

  setTokens: (access: string, refresh: string) => void
  setUser: (user: User) => void
  setRememberMe: (v: boolean) => void
  setUysotIds: (opts: { contractId?: number | null; leadId?: number | null }) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      isHydrated: false,
      uysotContractId: null,
      uysotLeadId: null,

      setTokens: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),

      setUser: (user) => set({ user }),

      setRememberMe: (v) => set({ rememberMe: v }),

      setUysotIds: ({ contractId, leadId }) =>
        set((s) => ({
          uysotContractId: contractId !== undefined ? contractId : s.uysotContractId,
          uysotLeadId: leadId !== undefined ? leadId : s.uysotLeadId,
        })),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          uysotContractId: null,
          uysotLeadId: null,
        }),

      isAuthenticated: () => !!get().accessToken && !!get().user,
    }),
    {
      name: 'mijoz-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe,
        uysotContractId: state.uysotContractId,
        uysotLeadId: state.uysotLeadId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true
      },
    },
  ),
)
