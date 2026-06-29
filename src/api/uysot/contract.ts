import { useQuery } from '@tanstack/react-query'
import { uysotClient, unwrapUysot, uysotConfigured } from './client'
import type {
  UysotContract,
  UysotContractFilter,
  UysotContractListItem,
  UysotPaging,
} from './types'

export const uysotContractApi = {
  filter: async (body: UysotContractFilter): Promise<UysotPaging<UysotContractListItem>> => {
    const res = await uysotClient.post('/v1/open-api/contract/filter', body)
    return unwrapUysot<UysotPaging<UysotContractListItem>>(res.data)
  },
  getById: async (id: number): Promise<UysotContract> => {
    const res = await uysotClient.get(`/v1/open-api/contract/${id}`)
    return unwrapUysot<UysotContract>(res.data)
  },
  /** Telefon raqami bo'yicha shartnoma qidiradi. Topilmasa null qaytaradi. */
  findByPhone: async (phone: string): Promise<UysotContractListItem | null> => {
    const digits = phone.replace(/\D/g, '')
    const res = await uysotContractApi.filter({ page: 1, size: 5, search: digits })
    return res.data?.[0] ?? null
  },
}

export const useUysotContract = (id: number | undefined) =>
  useQuery({
    queryKey: ['uysot', 'contract', id],
    queryFn: () => uysotContractApi.getById(id!),
    enabled: uysotConfigured && typeof id === 'number',
  })

/** Find a contract by its number (e.g. "NUR-4") — used for login by contract. */
export const useUysotContractByNumber = (contractNumber: string | undefined) =>
  useQuery({
    queryKey: ['uysot', 'contract-by-number', contractNumber],
    queryFn: () =>
      uysotContractApi.filter({
        page: 1,
        size: 1,
        contractNumber: contractNumber!,
      }),
    enabled: uysotConfigured && Boolean(contractNumber),
  })
