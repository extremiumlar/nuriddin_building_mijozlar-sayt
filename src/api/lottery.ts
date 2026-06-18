import { useQuery } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
import type { Lottery, LotteryTicket, LotteryWinner } from '@/types'

export const lotteryApi = {
  upcoming: async (): Promise<Lottery[]> => {
    const res = await apiClient.get('/lottery/upcoming')
    return unwrap(res.data)
  },
  myTickets: async (): Promise<LotteryTicket[]> => {
    const res = await apiClient.get('/lottery/my-tickets')
    return unwrap(res.data)
  },
  winners: async (): Promise<LotteryWinner[]> => {
    const res = await apiClient.get('/lottery/winners')
    return unwrap(res.data)
  },
}

export const useUpcomingLotteries = () =>
  useQuery({ queryKey: ['lottery', 'upcoming'], queryFn: lotteryApi.upcoming })

export const useMyTickets = () =>
  useQuery({ queryKey: ['lottery', 'my-tickets'], queryFn: lotteryApi.myTickets })

export const useLotteryWinners = () =>
  useQuery({ queryKey: ['lottery', 'winners'], queryFn: lotteryApi.winners })
