import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAnalytics } from '@/composables/useAnalytics'

/**
 * One delegated click listener that records every lead action in GA4:
 *   go_to_whatsapp (wa.me), click_phone (tel:), click_email (mailto:)
 * Each event carries where the button is (button_location), the page, and the product
 * name on product pages. Mark a section with data-track-source="..." to name its location;
 * otherwise the route name is used. Events only fire after cookie consent (useAnalytics).
 */
export function useContactTracking() {
  const route = useRoute()
  const { trackEvent } = useAnalytics()

  const classify = (href: string): { event: string; extra: Record<string, string> } | null => {
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\b/i.test(href)) {
      const digits = href.match(/wa\.me\/(\d+)/i)?.[1] || new URL(href).searchParams.get('phone') || 'unknown'
      return { event: 'go_to_whatsapp', extra: { whatsapp_number: digits } }
    }
    if (/^tel:/i.test(href)) return { event: 'click_phone', extra: { phone_number: href.slice(4).trim() } }
    if (/^mailto:/i.test(href)) {
      return { event: 'click_email', extra: { email_address: href.slice(7).split('?')[0] } }
    }
    return null
  }

  const onClick = (e: MouseEvent) => {
    const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!anchor) return
    const hit = classify(anchor.getAttribute('href') || '')
    if (!hit) return

    const source =
      (anchor.closest('[data-track-source]') as HTMLElement | null)?.dataset.trackSource ||
      `page_${String(route.name || 'unknown').toLowerCase()}`

    const params: Record<string, string> = {
      ...hit.extra,
      button_location: source,
      page_path: route.path,
    }
    if (route.name === 'ProductDetail') {
      const name = document.querySelector('h1')?.textContent?.trim()
      if (name) params.product_name = name
    }
    trackEvent(hit.event, params)
  }

  onMounted(() => document.addEventListener('click', onClick, true))
  onBeforeUnmount(() => document.removeEventListener('click', onClick, true))
}
