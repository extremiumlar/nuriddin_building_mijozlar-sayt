import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
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

export const usePaymentSummary = () =>
  useQuery({ queryKey: ['payments', 'summary'], queryFn: paymentsApi.summary })

export const usePaymentSchedule = () =>
  useQuery({ queryKey: ['payments', 'schedule'], queryFn: paymentsApi.schedule })

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
