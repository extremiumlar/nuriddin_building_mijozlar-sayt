import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
import {
  contractToPaymentSummary,
  contractToSchedule,
  uysotConfigured,
  uysotContractApi,
} from './uysot'
import { useAuthStore } from '@/store/auth'
import type { NotificationSettings, PaymentScheduleItem, PaymentSummary, SavedCard } from '@/types'

export const paymentsApi = {
  summary: async (): Promise<PaymentSummary> => {
    const res = await apiClient.get('/payments/summary')
    return unwrap(res.data)
  },
  schedule: async (): Promise<PaymentScheduleItem[]> => {
    const res = await apiClient.get('/payments/schedule')
    return unwrap(res.data)
  },
  cards: async (): Promise<SavedCard[]> => {
    const res = await apiClient.get('/payments/cards')
    return unwrap(res.data)
  },
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    const res = await apiClient.get('/notifications/settings')
    return unwrap(res.data)
  },
  updateNotificationSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    const res = await apiClient.put('/notifications/settings', settings)
    return unwrap(res.data)
  },
}

/** Returns the Uysot contract id linked to the current session, or null. */
const useContractId = () => useAuthStore((s) => s.uysotContractId)

export const usePaymentSummary = () => {
  const contractId = useContractId()
  const useUysot = uysotConfigured && typeof contractId === 'number'

  return useQuery<PaymentSummary>({
    queryKey: ['payments', 'summary', useUysot ? `uysot-${contractId}` : 'mock'],
    queryFn: async () => {
      if (useUysot) {
        const c = await uysotContractApi.getById(contractId!)
        return contractToPaymentSummary(c)
      }
      return paymentsApi.summary()
    },
  })
}

export const usePaymentSchedule = () => {
  const contractId = useContractId()
  const useUysot = uysotConfigured && typeof contractId === 'number'

  return useQuery<PaymentScheduleItem[]>({
    queryKey: ['payments', 'schedule', useUysot ? `uysot-${contractId}` : 'mock'],
    queryFn: async () => {
      if (useUysot) {
        // /contract-payment/{id} is scope-blocked for our token; the same data
        // lives inside the contract response under `monthlyPayments`.
        const contract = await uysotContractApi.getById(contractId!)
        return contractToSchedule(contract)
      }
      return paymentsApi.schedule()
    },
  })
}

export const useSavedCards = () =>
  useQuery({ queryKey: ['payments', 'cards'], queryFn: paymentsApi.cards })

export const useNotificationSettings = () =>
  useQuery({ queryKey: ['notifications', 'settings'], queryFn: paymentsApi.getNotificationSettings })

export const useUpdateNotificationSettings = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: paymentsApi.updateNotificationSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications', 'settings'] }),
  })
}
