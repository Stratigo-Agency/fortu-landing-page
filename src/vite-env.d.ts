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
  /** Fortu CRM address for the tracked WhatsApp link; defaults to the production CRM on a production build and the
   *  staging CRM otherwise (see vite.config.ts and DEPLOYMENT.MD) */
  readonly VITE_CRM_URL?: string
}

/** Set in vite.config.ts: true only for a production build that is not the staging branch. */
declare const __FORTU_PRODUCTION_BUILD__: boolean

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

