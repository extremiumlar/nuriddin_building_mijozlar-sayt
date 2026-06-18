export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.company.uz/v1',
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'wss://api.company.uz/v1',
  // When true, API calls are intercepted and answered with local mock data.
  // Set VITE_USE_MOCK=false to hit a real backend.
  useMock: (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false',
  companyName: 'Build Co.',
  supportPhone: '+998 71 200 00 00',
} as const
