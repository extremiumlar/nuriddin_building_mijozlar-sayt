/**
 * Public landing API — calls the Django REST backend (`backend/`).
 *
 * Endpoints live under `/api/v1/public/`. Everything is read-only and
 * unauthenticated. CORS is opened for the Vite dev server.
 */

import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:8000'

export const publicClient = axios.create({
  baseURL: `${BASE_URL}/api/v1/public`,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

// ── Response types (1:1 with Django serializers) ────────────────────────

export interface PublicProjectRender {
  id: number
  url: string
  caption: string
  order: number
}

export interface PublicProject {
  id: number
  name: string
  slug: string
  tagline: string
  description: string
  address: string
  location_label: string
  block_count: number
  floor_count: number
  apartment_count: number
  construction_progress: number
  estimated_delivery: string | null
  estimated_delivery_label: string
  is_featured: boolean
  is_active: boolean
  renders: PublicProjectRender[]
}

export interface PublicConstructionBlock {
  id: number
  project: number
  name: string
  total_floors: number
  completed_floors: number
  percentage: number
  delivery_date: string | null
  status: 'planned' | 'active' | 'completed'
  order: number
}

export interface PublicLotteryWinner {
  id: number
  lottery_name: string
  winner_name: string
  ticket_number: string
  prize: string
  city: string
  drawn_at: string
  verification_hash: string
}

export interface PublicAmenity {
  id: number
  kind: string
  label: string
  description: string
  icon_name: string
  image_url: string
  color: string
  hours_from: number
  hours_to: number
  capacity: number
  is_free: boolean
  price_per_hour: number
  order: number
}

export interface PublicNewsItem {
  id: number
  title: string
  body: string
  tone: 'info' | 'event' | 'celebration' | 'warning'
  kicker: string
  published_at: string
  is_pinned: boolean
}

export interface PublicStat {
  id: number
  key: string
  label: string
  description: string
  value: number
  prefix: string
  suffix: string
  icon_name: string
  order: number
}

export interface PublicMonthlyMedia {
  id: number
  title: string
  month: string
  media_type: 'video' | 'photo'
  media_url: string
  thumbnail_url: string
  description: string
  order: number
}

export interface PublicLandingBundle {
  project: PublicProject | null
  blocks: PublicConstructionBlock[]
  lottery_winners: PublicLotteryWinner[]
  amenities: PublicAmenity[]
  news: PublicNewsItem[]
  stats: PublicStat[]
}

interface DrfList<T> {
  count?: number
  next?: string | null
  previous?: string | null
  results: T[]
}

const unwrapList = <T>(payload: T[] | DrfList<T>): T[] =>
  Array.isArray(payload) ? payload : payload.results ?? []

// ── API calls ───────────────────────────────────────────────────────────

export const publicApi = {
  landingBundle: async (): Promise<PublicLandingBundle> => {
    const res = await publicClient.get('/landing/')
    return res.data
  },
  project: async (slug = 'nurli-diyor-residence'): Promise<PublicProject> => {
    const res = await publicClient.get(`/projects/${slug}/`)
    return res.data
  },
  constructionBlocks: async (): Promise<PublicConstructionBlock[]> => {
    const res = await publicClient.get('/construction/')
    return unwrapList(res.data)
  },
  lotteryWinners: async (): Promise<PublicLotteryWinner[]> => {
    const res = await publicClient.get('/lottery-winners/')
    return unwrapList(res.data)
  },
  amenities: async (): Promise<PublicAmenity[]> => {
    const res = await publicClient.get('/amenities/')
    return unwrapList(res.data)
  },
  news: async (): Promise<PublicNewsItem[]> => {
    const res = await publicClient.get('/news/')
    return unwrapList(res.data)
  },
  stats: async (): Promise<PublicStat[]> => {
    const res = await publicClient.get('/stats/')
    return unwrapList(res.data)
  },
  monthlyMedia: async (): Promise<PublicMonthlyMedia[]> => {
    const res = await publicClient.get('/monthly-media/')
    return unwrapList(res.data)
  },
}

// ── React Query hooks ───────────────────────────────────────────────────

const STALE = 5 * 60_000

export const usePublicLanding = () =>
  useQuery({
    queryKey: ['public', 'landing'],
    queryFn: publicApi.landingBundle,
    staleTime: STALE,
  })

export const usePublicProject = (slug?: string) =>
  useQuery({
    queryKey: ['public', 'project', slug ?? 'nurli-diyor-residence'],
    queryFn: () => publicApi.project(slug),
    staleTime: STALE,
  })

export const usePublicBlocks = () =>
  useQuery({
    queryKey: ['public', 'construction'],
    queryFn: publicApi.constructionBlocks,
    staleTime: STALE,
  })

export const usePublicWinners = () =>
  useQuery({
    queryKey: ['public', 'lottery-winners'],
    queryFn: publicApi.lotteryWinners,
    staleTime: STALE,
  })

export const usePublicAmenities = () =>
  useQuery({
    queryKey: ['public', 'amenities'],
    queryFn: publicApi.amenities,
    staleTime: STALE,
  })

export const usePublicNews = () =>
  useQuery({
    queryKey: ['public', 'news'],
    queryFn: publicApi.news,
    staleTime: STALE,
  })

export const usePublicStats = () =>
  useQuery({
    queryKey: ['public', 'stats'],
    queryFn: publicApi.stats,
    staleTime: STALE,
  })

export const usePublicMonthlyMedia = () =>
  useQuery({
    queryKey: ['public', 'monthly-media'],
    queryFn: publicApi.monthlyMedia,
    staleTime: STALE,
  })
