import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
import {
  contractToApartmentInfo,
  contractToFinancialSummary,
  uysotConfigured,
  uysotContractApi,
} from './uysot'
import { useAuthStore } from '@/store/auth'
import type {
  ActiveDevice,
  ApartmentInfo,
  AppDocument,
  FinancialSummary,
  ProfileNotificationConfig,
  ReferralInfo,
  SupportTicket,
  TicketCategory,
  User,
} from '@/types'

export const profileApi = {
  me: async (): Promise<User> => {
    const res = await apiClient.get('/profile')
    return unwrap(res.data)
  },
  apartment: async (): Promise<ApartmentInfo> => {
    const res = await apiClient.get('/profile/apartment')
    return unwrap(res.data)
  },
  financial: async (): Promise<FinancialSummary> => {
    const res = await apiClient.get('/profile/financial')
    return unwrap(res.data)
  },
  devices: async (): Promise<ActiveDevice[]> => {
    const res = await apiClient.get('/profile/devices')
    return unwrap(res.data)
  },
  revokeDevice: async (id: string): Promise<void> => {
    await apiClient.delete(`/profile/devices/${id}`)
  },
  logoutAllDevices: async (): Promise<void> => {
    await apiClient.post('/profile/devices/logout-all')
  },
  getProfileNotifications: async (): Promise<ProfileNotificationConfig> => {
    const res = await apiClient.get('/profile/notifications')
    return unwrap(res.data)
  },
  updateProfileNotifications: async (config: ProfileNotificationConfig): Promise<ProfileNotificationConfig> => {
    const res = await apiClient.put('/profile/notifications', config)
    return unwrap(res.data)
  },
  documents: async (): Promise<AppDocument[]> => {
    const res = await apiClient.get('/documents')
    return unwrap(res.data)
  },
  referral: async (): Promise<ReferralInfo> => {
    const res = await apiClient.get('/referral/my')
    return unwrap(res.data)
  },
  listTickets: async (): Promise<SupportTicket[]> => {
    const res = await apiClient.get('/support/tickets')
    return unwrap(res.data)
  },
  createTicket: async (payload: { category: TicketCategory; subject: string; description: string }): Promise<SupportTicket> => {
    const res = await apiClient.post('/support/tickets', payload)
    return unwrap(res.data)
  },
}

export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: profileApi.me })

export const useApartmentInfo = () => {
  const contractId = useAuthStore((s) => s.uysotContractId)
  const useUysot = uysotConfigured && typeof contractId === 'number'
  return useQuery<ApartmentInfo>({
    queryKey: ['profile', 'apartment', useUysot ? `uysot-${contractId}` : 'mock'],
    queryFn: async () => {
      if (useUysot) {
        const c = await uysotContractApi.getById(contractId!)
        return contractToApartmentInfo(c)
      }
      return profileApi.apartment()
    },
  })
}

export const useFinancialSummary = () => {
  const contractId = useAuthStore((s) => s.uysotContractId)
  const useUysot = uysotConfigured && typeof contractId === 'number'
  return useQuery<FinancialSummary>({
    queryKey: ['profile', 'financial', useUysot ? `uysot-${contractId}` : 'mock'],
    queryFn: async () => {
      if (useUysot) {
        const c = await uysotContractApi.getById(contractId!)
        return contractToFinancialSummary(c)
      }
      return profileApi.financial()
    },
  })
}

export const useActiveDevices = () =>
  useQuery({ queryKey: ['profile', 'devices'], queryFn: profileApi.devices })

export const useRevokeDevice = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: profileApi.revokeDevice,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', 'devices'] }),
  })
}

export const useLogoutAllDevices = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: profileApi.logoutAllDevices,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', 'devices'] }),
  })
}

export const useProfileNotifications = () =>
  useQuery({ queryKey: ['profile', 'notifications'], queryFn: profileApi.getProfileNotifications })

export const useUpdateProfileNotifications = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: profileApi.updateProfileNotifications,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', 'notifications'] }),
  })
}

export const useDocuments = () =>
  useQuery({ queryKey: ['documents'], queryFn: profileApi.documents })

export const useReferral = () =>
  useQuery({ queryKey: ['referral'], queryFn: profileApi.referral })

export const useSupportTickets = () =>
  useQuery({ queryKey: ['support', 'tickets'], queryFn: profileApi.listTickets })

export const useCreateTicket = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: profileApi.createTicket,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['support', 'tickets'] }),
  })
}
