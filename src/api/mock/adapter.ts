import { apiClient } from '@/api/client'
import { appConfig } from '@/config/app'
import {
  mockActiveDevices,
  mockActivity,
  mockAnnouncements,
  mockApartmentInfo,
  mockApartmentStages,
  mockBlocks,
  mockBookings,
  mockCertificates,
  mockDailyResources,
  mockDocuments,
  mockMaterials,
  mockFinancialSummary,
  mockForecast,
  mockLotteries,
  mockPaymentSummary,
  mockProfileNotifications,
  mockReferral,
  mockReports,
  mockSavedCards,
  mockSchedule,
  mockTickets,
  mockTickets_support,
  mockUpcoming,
  mockUser,
  mockWinners,
} from './seed'

interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  pattern: RegExp
  handler: (match: RegExpMatchArray, body?: unknown) => unknown | Promise<unknown>
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const routes: MockRoute[] = [
  {
    method: 'POST',
    pattern: /^\/auth\/otp\/request$/,
    handler: () => ({ requestId: 'req-' + Date.now(), expiresIn: 120 }),
  },
  {
    method: 'POST',
    pattern: /^\/auth\/otp\/verify$/,
    handler: (_m, body) => {
      const { code } = (body ?? {}) as { code?: string }
      if (code !== '1234') {
        const err: { response: { status: number; data: { message: string } } } = {
          response: { status: 400, data: { message: 'Kod noto\'g\'ri. Test kod: 1234' } },
        }
        throw err
      }
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      }
    },
  },
  { method: 'GET', pattern: /^\/auth\/me$/, handler: () => mockUser },
  { method: 'POST', pattern: /^\/auth\/logout$/, handler: () => ({}) },

  { method: 'GET', pattern: /^\/dashboard\/activity$/, handler: () => mockActivity },
  { method: 'GET', pattern: /^\/dashboard\/announcements$/, handler: () => mockAnnouncements },
  { method: 'GET', pattern: /^\/dashboard\/forecast$/, handler: () => mockForecast },
  { method: 'GET', pattern: /^\/dashboard\/upcoming$/, handler: () => mockUpcoming },
  { method: 'GET', pattern: /^\/construction\/my-stages$/, handler: () => mockApartmentStages },
  { method: 'GET', pattern: /^\/construction\/blocks$/, handler: () => mockBlocks },
  { method: 'GET', pattern: /^\/construction\/materials$/, handler: () => mockMaterials },
  { method: 'GET', pattern: /^\/construction\/certificates$/, handler: () => mockCertificates },
  { method: 'GET', pattern: /^\/construction\/resources\/today$/, handler: () => mockDailyResources },
  {
    method: 'GET',
    pattern: /^\/construction\/blocks\/([^/]+)$/,
    handler: (m) => mockBlocks.find((b) => b.id === m[1]) ?? null,
  },
  {
    method: 'GET',
    pattern: /^\/construction\/reports/,
    handler: () => mockReports,
  },

  { method: 'GET', pattern: /^\/payments\/summary$/, handler: () => mockPaymentSummary },
  { method: 'GET', pattern: /^\/payments\/schedule$/, handler: () => mockSchedule },
  { method: 'GET', pattern: /^\/payments\/my$/, handler: () => mockSchedule.filter((p) => p.status !== 'pending') },
  { method: 'GET', pattern: /^\/payments\/cards$/, handler: () => mockSavedCards },
  {
    method: 'GET',
    pattern: /^\/notifications\/settings$/,
    handler: () => ({
      sms: true,
      email: true,
      push: true,
      daysBefore: 3,
      phone: mockUser.phone,
      email_addr: mockUser.email ?? '',
    }),
  },
  { method: 'PUT', pattern: /^\/notifications\/settings$/, handler: (_m, body) => body },

  { method: 'GET', pattern: /^\/lottery\/upcoming$/, handler: () => mockLotteries },
  { method: 'GET', pattern: /^\/lottery\/my-tickets$/, handler: () => mockTickets },
  { method: 'GET', pattern: /^\/lottery\/winners$/, handler: () => mockWinners },

  {
    method: 'GET',
    pattern: /^\/bookings\/slots/,
    handler: (_m, _body) => {
      // facility param parsed from URL query in actual call; we generate generic slots here
      // The caller passes facility via params; we just produce a varied schedule
      return generateSlots()
    },
  },
  { method: 'GET', pattern: /^\/bookings\/my$/, handler: () => mockBookings },
  {
    method: 'POST',
    pattern: /^\/bookings$/,
    handler: (_m, body) => {
      const b = body as { facility: string; date: string; startTime: string }
      const newBooking = {
        id: 'bk-' + Date.now(),
        facility: b.facility,
        date: b.date,
        startTime: b.startTime,
        endTime: addHour(b.startTime),
        status: 'confirmed' as const,
      }
      mockBookings.push(newBooking as never)
      return newBooking
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/bookings\/([^/]+)$/,
    handler: (m) => {
      const idx = mockBookings.findIndex((b) => b.id === m[1])
      if (idx >= 0) mockBookings.splice(idx, 1)
      return {}
    },
  },

  { method: 'GET', pattern: /^\/profile$/, handler: () => mockUser },
  { method: 'PUT', pattern: /^\/profile$/, handler: (_m, body) => ({ ...mockUser, ...(body as object) }) },
  { method: 'GET', pattern: /^\/profile\/apartment$/, handler: () => mockApartmentInfo },
  { method: 'GET', pattern: /^\/profile\/financial$/, handler: () => mockFinancialSummary },
  { method: 'GET', pattern: /^\/profile\/devices$/, handler: () => mockActiveDevices },
  {
    method: 'DELETE',
    pattern: /^\/profile\/devices\/([^/]+)$/,
    handler: (m) => {
      const idx = mockActiveDevices.findIndex((d) => d.id === m[1])
      if (idx >= 0) mockActiveDevices.splice(idx, 1)
      return {}
    },
  },
  {
    method: 'POST',
    pattern: /^\/profile\/devices\/logout-all$/,
    handler: () => {
      mockActiveDevices.splice(0, mockActiveDevices.length, ...mockActiveDevices.filter((d) => d.current))
      return {}
    },
  },
  { method: 'GET', pattern: /^\/profile\/notifications$/, handler: () => mockProfileNotifications },
  { method: 'PUT', pattern: /^\/profile\/notifications$/, handler: (_m, body) => body },
  { method: 'GET', pattern: /^\/documents$/, handler: () => mockDocuments },
  { method: 'GET', pattern: /^\/referral\/my$/, handler: () => mockReferral },
  { method: 'GET', pattern: /^\/support\/tickets$/, handler: () => mockTickets_support },
  {
    method: 'POST',
    pattern: /^\/support\/tickets$/,
    handler: (_m, body) => {
      const b = body as Partial<{ subject: string; description: string; category: string }>
      const t = {
        id: 'st-' + Date.now(),
        category: (b.category ?? 'other') as never,
        subject: b.subject ?? '',
        description: b.description ?? '',
        status: 'open' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockTickets_support.unshift(t)
      return t
    },
  },
]

function addHour(time: string): string {
  const [h, m] = time.split(':').map(Number)
  return `${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function generateSlots(): Array<{ time: string; status: 'free' | 'taken' | 'mine' }> {
  const slots: Array<{ time: string; status: 'free' | 'taken' | 'mine' }> = []
  // Default 8-22; UI adjusts which slots are visible per facility hours
  for (let h = 7; h <= 23; h++) {
    const time = `${String(h).padStart(2, '0')}:00`
    let status: 'free' | 'taken' | 'mine' = 'free'
    // Random-ish but stable: peak hours busier
    if (h === 14) status = 'mine'
    else if ([10, 17, 19, 20].includes(h)) status = 'taken'
    slots.push({ time, status })
  }
  return slots
}

export function installMockAdapter() {
  apiClient.interceptors.request.use(async (config) => {
    if (!appConfig.useMock) return config
    const url = (config.url ?? '').replace(/^\/+/, '/')
    const method = (config.method ?? 'GET').toUpperCase() as MockRoute['method']
    for (const route of routes) {
      if (route.method !== method) continue
      const match = url.match(route.pattern)
      if (!match) continue
      await sleep(220 + Math.random() * 300)
      try {
        const body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : undefined
        const data = await route.handler(match, body)
        config.adapter = async () =>
          Promise.resolve({
            data: { success: true, data },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          })
        return config
      } catch (err) {
        const e = err as { response?: { status: number; data: unknown } }
        const status = e.response?.status ?? 500
        const data = e.response?.data ?? { message: 'Server xatosi' }
        config.adapter = async () =>
          Promise.reject({
            response: { data, status, statusText: 'Error', headers: {}, config },
            isAxiosError: true,
            message: (data as { message?: string })?.message ?? 'Xato',
            config,
          })
        return config
      }
    }
    return config
  })
}
