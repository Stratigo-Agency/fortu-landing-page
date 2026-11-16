import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useAnalytics } from '@/composables/useAnalytics'
import { isCrmWhatsAppLink } from '@/config/contact'

/**
 * One delegated click listener that records every lead action in GA4:
 *   go_to_whatsapp (wa.me or the CRM's tracked /go/wa link), click_phone (tel:), click_email (mailto:)
 * Each of those also sends GA4's recommended `generate_lead` event (method whatsapp / phone / email, lead_source =
 * button location, and the CRM line for WhatsApp), so one Key event in GA4 counts every lead.
 * A WhatsApp click also sends the Meta Pixel 'Contact' event, so Meta ads can be measured on real chats.
 * Each event carries where the button is (button_location), the page, and the product
 * name on product pages. Mark a section with data-track-source="..." to name its location;
 * otherwise the route name is used. Events only fire after cookie consent (useAnalytics).
 */
type Lead = { event: string; method: 'whatsapp' | 'phone' | 'email'; extra: Record<string, string> }

export function useContactTracking() {
  const route = useRoute()
  const { trackEvent, trackPixel } = useAnalytics()

  const classify = (href: string): Lead | null => {
    if (isCrmWhatsAppLink(href)) {
      const line = new URL(href).searchParams.get('line') || 'unknown'
      return {
        event: 'go_to_whatsapp',
        method: 'whatsapp',
        extra: { whatsapp_number: `team:${line}`, whatsapp_line: line, link_type: 'crm_tracked' },
      }
    }
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\b/i.test(href)) {
      const digits = href.match(/wa\.me\/(\d+)/i)?.[1] || new URL(href).searchParams.get('phone') || 'unknown'
      return { event: 'go_to_whatsapp', method: 'whatsapp', extra: { whatsapp_number: digits } }
    }
    if (/^tel:/i.test(href)) {
      return { event: 'click_phone', method: 'phone', extra: { phone_number: href.slice(4).trim() } }
    }
    if (/^mailto:/i.test(href)) {
      return { event: 'click_email', method: 'email', extra: { email_address: href.slice(7).split('?')[0] } }
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
    // GA4 recommended lead event (mark it as a Key event in GA4)
    trackEvent('generate_lead', {
      method: hit.method,
      lead_source: source,
      page_path: route.path,
      ...(hit.extra.whatsapp_line ? { whatsapp_line: hit.extra.whatsapp_line } : {}),
      ...(params.product_name ? { product_name: params.product_name } : {}),
    })
    if (hit.event === 'go_to_whatsapp') trackPixel('Contact', { content_name: params.product_name || source })
  }

  onMounted(() => document.addEventListener('click', onClick, true))
  onBeforeUnmount(() => document.removeEventListener('click', onClick, true))
}
