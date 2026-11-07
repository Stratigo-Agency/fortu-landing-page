/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SANITY_PROJECT_ID: string
  readonly VITE_SANITY_DATASET: string
  readonly VITE_SANITY_API_VERSION: string
  /** Fortu CRM address for the tracked WhatsApp link; defaults to the Railway production URL */
  readonly VITE_CRM_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Google Analytics types
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

