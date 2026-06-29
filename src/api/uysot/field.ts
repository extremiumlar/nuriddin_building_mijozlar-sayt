import { useQuery } from '@tanstack/react-query'
import { uysotClient, unwrapUysot, uysotConfigured } from './client'
import type { UysotField } from './types'

export const uysotFieldApi = {
  crmFields: async (): Promise<UysotField[]> => {
    const res = await uysotClient.get('/v1/open-api/crm-field')
    return unwrapUysot(res.data)
  },
  contractFields: async (): Promise<UysotField[]> => {
    // Note: postman uses /contrac-field (typo preserved in upstream API)
    const res = await uysotClient.get('/v1/open-api/contrac-field')
    return unwrapUysot(res.data)
  },
}

export const useUysotCrmFields = () =>
  useQuery({
    queryKey: ['uysot', 'crm-fields'],
    queryFn: uysotFieldApi.crmFields,
    enabled: uysotConfigured,
    staleTime: 5 * 60_000,
  })

export const useUysotContractFields = () =>
  useQuery({
    queryKey: ['uysot', 'contract-fields'],
    queryFn: uysotFieldApi.contractFields,
    enabled: uysotConfigured,
    staleTime: 5 * 60_000,
  })
