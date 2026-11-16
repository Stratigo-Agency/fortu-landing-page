import { onBeforeUnmount, onMounted, reactive, readonly } from 'vue'
import { useRoute } from 'vue-router'
import { isCrmWhatsAppLink } from '@/config/contact'
import { useAnalytics } from '@/composables/useAnalytics'

interface LeadFormState {
  open: boolean
  /** the tracked CRM link that was clicked (/go/wa?line=…) */
  href: string
  /** where the button lives (button_location in GA4) */
  source: string
  productName?: string
}

const state = reactive<LeadFormState>({ open: false, href: '', source: 'unknown' })

/** Opens and closes the short form shown before a WhatsApp chat (MAR-232). */
export function useLeadForm() {
  const openLeadForm = (href: string, source: string, productName?: string) => {
    state.href = href
    state.source = source
    state.productName = productName
    state.open = true
  }
  const closeLeadForm = () => {
    state.open = false
  }
  return { state: readonly(state), openLeadForm, closeLeadForm }
}

/**
 * Call once (App.vue): every click on a tracked CRM WhatsApp link, wherever it is on the site (Hubungi Sales, /hubungi,
 * office cards, and any link added later), opens the form instead of going straight to WhatsApp.
 * Ctrl/Cmd/Shift/middle clicks keep the plain tracked link, so nothing is ever blocked.
 */
export function useLeadGate() {
  const route = useRoute()
  const { openLeadForm } = useLeadForm()
  const { trackEvent } = useAnalytics()

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    const href = anchor?.getAttribute('href') || ''
    if (!anchor || !isCrmWhatsAppLink(href)) return
    e.preventDefault()

    const source =
      (anchor.closest('[data-track-source]') as HTMLElement | null)?.dataset.trackSource ||
      new URL(href).searchParams.get('utm_content') ||
      `page_${String(route.name || 'unknown').toLowerCase()}`
    const productName =
      route.name === 'ProductDetail' ? document.querySelector('h1')?.textContent?.trim() || undefined : undefined

    trackEvent('lead_form_open', {
      button_location: source,
      page_path: route.path,
      whatsapp_line: new URL(href).searchParams.get('line') || 'unknown',
      ...(productName ? { product_name: productName } : {}),
    })
    openLeadForm(href, source, productName)
  }

  onMounted(() => document.addEventListener('click', onClick, true))
  onBeforeUnmount(() => document.removeEventListener('click', onClick, true))
}
