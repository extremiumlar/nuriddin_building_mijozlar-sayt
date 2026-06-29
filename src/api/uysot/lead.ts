import { useMutation, useQuery } from '@tanstack/react-query'
import { uysotClient, unwrapUysot, uysotConfigured } from './client'
import type { UysotLead, UysotLeadFilter, UysotPaging } from './types'

/**
 * NOTE — currently the /lead/* endpoints respond 403 "Huquq yo'q!" for our
 * token (no scope). Kept for parity with the Postman spec; will start working
 * the moment Uysot enables the `lead.read` scope on the token.
 */
export const uysotLeadApi = {
  filter: async (body: UysotLeadFilter): Promise<UysotPaging<UysotLead>> => {
    const res = await uysotClient.post('/v1/open-api/lead/filter', body)
    return unwrapUysot<UysotPaging<UysotLead>>(res.data)
  },
  getById: async (id: number): Promise<UysotLead> => {
    const res = await uysotClient.get(`/v1/open-api/lead/${id}`)
    return unwrapUysot<UysotLead>(res.data)
  },
}

export const useUysotLead = (id: number | undefined) =>
  useQuery({
    queryKey: ['uysot', 'lead', id],
    queryFn: () => uysotLeadApi.getById(id!),
    enabled: uysotConfigured && typeof id === 'number',
  })

export const useUysotLeadSearch = () =>
  useMutation({
    mutationFn: (search: string) =>
      uysotLeadApi.filter({ page: 1, size: 10, search }),
  })
