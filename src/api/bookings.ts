import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
import type { Booking, BookingSlot, FacilityType } from '@/types'

export const bookingsApi = {
  slots: async (facility: FacilityType, date: string): Promise<BookingSlot[]> => {
    const res = await apiClient.get('/bookings/slots', { params: { facility, date } })
    return unwrap(res.data)
  },
  myBookings: async (): Promise<Booking[]> => {
    const res = await apiClient.get('/bookings/my')
    return unwrap(res.data)
  },
  create: async (payload: { facility: FacilityType; date: string; startTime: string }): Promise<Booking> => {
    const res = await apiClient.post('/bookings', payload)
    return unwrap(res.data)
  },
  cancel: async (id: string): Promise<void> => {
    await apiClient.delete(`/bookings/${id}`)
  },
}

export const useSlots = (facility: FacilityType, date: string) =>
  useQuery({
    queryKey: ['bookings', 'slots', facility, date],
    queryFn: () => bookingsApi.slots(facility, date),
  })

export const useMyBookings = () =>
  useQuery({ queryKey: ['bookings', 'my'], queryFn: bookingsApi.myBookings })

export const useCreateBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export const useCancelBooking = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: bookingsApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}
