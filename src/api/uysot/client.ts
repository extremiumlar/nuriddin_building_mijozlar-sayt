import axios, { AxiosError, type AxiosInstance } from 'axios'

const BASE_URL = import.meta.env.VITE_UYSOT_API_URL || ''
const TOKEN = import.meta.env.VITE_UYSOT_TOKEN || ''
const JWT = import.meta.env.VITE_UYSOT_JWT || ''

if (!BASE_URL && !import.meta.env.SSR) {
  if (import.meta.env.DEV) {
    console.warn('[Uysot] VITE_UYSOT_API_URL not set — Uysot API calls will fail. Set it in .env')
  }
}

export const uysotClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/**
 * Inject Uysot auth header(s) on every request.
 *
 * Uysot exposes the same Open API behind several auth schemes depending on
 * the endpoint and the token kind, so we send everything we have at once.
 * The server picks the header it recognises and ignores the rest.
 *
 *   • X-Open-Api-Token — the documented Open API key (uysot_…)
 *   • X-Auth           — used by /address/* in the Postman collection
 *   • Authorization    — Bearer JWT (fallback for service-account tokens)
 */
uysotClient.interceptors.request.use((config) => {
  if (TOKEN) {
    config.headers.set('X-Open-Api-Token', TOKEN)
    config.headers.set('X-Auth', TOKEN)
  }
  if (JWT) {
    config.headers.set('Authorization', `Bearer ${JWT}`)
  }
  return config
})

uysotClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status
    const config = error.config as (typeof error.config & { _uysotRetry?: number }) | undefined

    // Rate-limit handling — docs say 60 req/min. Retry once after a small delay.
    if (status === 429 && config && !config._uysotRetry) {
      config._uysotRetry = 1
      await new Promise((r) => setTimeout(r, 1200))
      return uysotClient(config)
    }

    if (status === 401 || status === 403) {
      console.error('[Uysot] Authorization failed — token scope likely insufficient', error.response?.data)
    } else if (status === 0 || !status) {
      console.error('[Uysot] Network error — base URL probably wrong:', BASE_URL)
    }
    return Promise.reject(error)
  },
)

/** Unwraps `{ data: T }` envelope when present, otherwise returns the raw payload. */
export function unwrapUysot<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in (payload as object)) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export const uysotConfigured = Boolean(BASE_URL && (TOKEN || JWT))
