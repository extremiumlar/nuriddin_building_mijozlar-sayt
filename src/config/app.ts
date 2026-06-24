export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.company.uz/v1',
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'wss://api.company.uz/v1',
  // When true, API calls are intercepted and answered with local mock data.
  // Set VITE_USE_MOCK=false to hit a real backend.
  useMock: (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false',
  companyName: 'NURIDDIN BUILDINGS',
  companyShort: 'Nuriddin',
  projectName: 'Nurli Diyor Residence',
  slogan: "Uy emas, orzu quramiz!",
  tagline: "Qadriyatli qo'shnilar — hammaga sotilmaydi",
  supportPhone: '+998 77 275 86 77',
  salesOfficeUrl: 'https://t.me/Nurli_diyor_Residence/890',
  amenitiesIntro: '−1 qavatda aholi uchun 10 ta maxsus qulaylik',
} as const
