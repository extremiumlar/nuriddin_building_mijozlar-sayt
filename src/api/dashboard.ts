import { useQuery } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
import type {
  ActivityItem,
  Announcement,
  ApartmentStage,
  DailyForecast,
  UpcomingEvent,
} from '@/types'

export const dashboardApi = {
  activity: async (): Promise<ActivityItem[]> => {
    const res = await apiClient.get('/dashboard/activity')
    return unwrap(res.data)
  },
  announcements: async (): Promise<Announcement[]> => {
    const res = await apiClient.get('/dashboard/announcements')
    return unwrap(res.data)
  },
  forecast: async (): Promise<DailyForecast[]> => {
    const res = await apiClient.get('/dashboard/forecast')
    return unwrap(res.data)
  },
  upcoming: async (): Promise<UpcomingEvent[]> => {
    const res = await apiClient.get('/dashboard/upcoming')
    return unwrap(res.data)
  },
  myStages: async (): Promise<ApartmentStage[]> => {
    const res = await apiClient.get('/construction/my-stages')
    return unwrap(res.data)
  },
}

export const useActivity = () =>
  useQuery({ queryKey: ['dashboard', 'activity'], queryFn: dashboardApi.activity })

export const useAnnouncements = () =>
  useQuery({ queryKey: ['dashboard', 'announcements'], queryFn: dashboardApi.announcements })

export const useForecast = () =>
  useQuery({ queryKey: ['dashboard', 'forecast'], queryFn: dashboardApi.forecast })

export const useUpcoming = () =>
  useQuery({ queryKey: ['dashboard', 'upcoming'], queryFn: dashboardApi.upcoming })

export const useMyApartmentStages = () =>
  useQuery({ queryKey: ['construction', 'my-stages'], queryFn: dashboardApi.myStages })
