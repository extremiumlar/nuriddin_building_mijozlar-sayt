/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_BASE_URL: string
  readonly VITE_USE_MOCK?: string
  readonly VITE_UYSOT_API_URL?: string
  readonly VITE_UYSOT_TOKEN?: string
  readonly VITE_UYSOT_JWT?: string
  readonly VITE_PUBLIC_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
