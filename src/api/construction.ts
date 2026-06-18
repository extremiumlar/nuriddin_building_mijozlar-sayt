import { useQuery } from '@tanstack/react-query'
import { apiClient, unwrap } from './client'
import type {
  Block,
  ConstructionMaterial,
  ConstructionReport,
  DailyResources,
  QualityCertificate,
} from '@/types'

export const constructionApi = {
  getBlocks: async (): Promise<Block[]> => {
    const res = await apiClient.get('/construction/blocks')
    return unwrap(res.data)
  },
  getBlock: async (id: string): Promise<Block | null> => {
    const res = await apiClient.get(`/construction/blocks/${id}`)
    return unwrap(res.data)
  },
  getReports: async (blockId?: string): Promise<ConstructionReport[]> => {
    const res = await apiClient.get('/construction/reports', { params: blockId ? { blockId } : undefined })
    return unwrap(res.data)
  },
  getMaterials: async (): Promise<ConstructionMaterial[]> => {
    const res = await apiClient.get('/construction/materials')
    return unwrap(res.data)
  },
  getCertificates: async (): Promise<QualityCertificate[]> => {
    const res = await apiClient.get('/construction/certificates')
    return unwrap(res.data)
  },
  getDailyResources: async (): Promise<DailyResources> => {
    const res = await apiClient.get('/construction/resources/today')
    return unwrap(res.data)
  },
}

export const useBlocks = () =>
  useQuery({ queryKey: ['construction', 'blocks'], queryFn: constructionApi.getBlocks })

export const useReports = (blockId?: string) =>
  useQuery({
    queryKey: ['construction', 'reports', blockId ?? 'all'],
    queryFn: () => constructionApi.getReports(blockId),
  })

export const useMaterials = () =>
  useQuery({ queryKey: ['construction', 'materials'], queryFn: constructionApi.getMaterials })

export const useCertificates = () =>
  useQuery({ queryKey: ['construction', 'certificates'], queryFn: constructionApi.getCertificates })

export const useDailyResources = () =>
  useQuery({ queryKey: ['construction', 'resources-today'], queryFn: constructionApi.getDailyResources })
