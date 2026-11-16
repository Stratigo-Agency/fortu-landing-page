import { savedCampaign } from '@/utils/attribution'

export type ContactChoice = 'sales' | 'partnership'

/** Where "Partnership & Kolaborasi" goes: our own /hubungi page (no Linktree), so GA4 sees the visit and the
 *  chat that follows still runs through the CRM's tracked link. */
export const PARTNERSHIP_PATH = '/hubungi#partnership'

export const PRODUCTION_CRM_URL = 'https://fortu-crm-production.up.railway.app'
export const STAGING_CRM_URL = 'https://soothing-manifestation-staging.up.railway.app'

/** VITE_CRM_URL when set; otherwise the production CRM for a production build and the staging CRM for everything
 *  else (staging branch, local dev, tests), so test clicks never land in the production CRM. */
export function resolveCrmUrl(envUrl: string | undefined, productionBuild: boolean): string {
  return (envUrl?.trim() || (productionBuild ? PRODUCTION_CRM_URL : STAGING_CRM_URL)).replace(/\/+$/, '')
}

/** The Fortu CRM. Its /go/wa link records the click and opens WhatsApp with a short click code. */
export const CRM_URL = resolveCrmUrl(import.meta.env.VITE_CRM_URL, __FORTU_PRODUCTION_BUILD__)

export interface SalesTeam {
  id: string
  title: string
  city: string
  /** WhatsApp line labels as registered in the CRM. The CRM picks one fairly (fewest recent chats) and keeps a
   *  returning visitor on the same line, so one customer never ends up with two sales. */
  lines: string[]
}

export const SALES_TEAMS: SalesTeam[] = [
  { id: 'jakarta', title: 'Sales Jakarta', city: 'Jakarta', lines: ['Jakarta-1', 'Jakarta-2', 'Jakarta-3', 'Jakarta-4'] },
  { id: 'medan', title: 'Sales Medan', city: 'Medan', lines: ['Medan-5'] },
]

/**
 * Office WhatsApp numbers (Sanity: Site Settings → offices, phoneType "whatsapp") by city, with the CRM line label
 * that holds the same number (CRM: Pengaturan → WhatsApp lines). The office card then opens that exact number
 * through the CRM's tracked link. A label must exist in the CRM before it is used here: /go/wa answers 404 for an
 * unknown line. An office WhatsApp number whose city is not listed falls back to a plain wa.me link.
 */
export const OFFICE_WHATSAPP_LINES: Record<string, string> = {
  jakarta: 'Kantor-Jakarta',
  bali: 'Kantor-Bali',
}

export const officeWhatsAppLine = (city?: string): string | undefined =>
  city ? OFFICE_WHATSAPP_LINES[city.trim().toLowerCase()] : undefined

/** Marketplace stores (moved here from the Linktree). */
export const SHOP_LINKS = [
  { id: 'shopee_mga', title: 'Beli di MGA Shopee', href: 'https://id.shp.ee/pKTfC6Dy' },
  { id: 'shopee_akrilik', title: 'Beli di Akrilik Teknika Shopee', href: 'https://id.shp.ee/dGr6c7GL' },
]

/**
 * The "Chat Sales" link: goes through the CRM so the lead is traced to the page, the product and the ad.
 * A visitor who came from a tagged campaign keeps it; otherwise the link says fortu.co.id / website,
 * the product (or "kontak") as campaign and the button location as content.
 */
export function buildSalesWhatsAppUrl(
  team: Pick<SalesTeam, 'lines'>,
  opts: { location: string; productName?: string; productSlug?: string; text?: string },
): string {
  const url = new URL(`${CRM_URL}/go/wa`)
  url.searchParams.set('line', team.lines.join(','))
  url.searchParams.set(
    'text',
    opts.text ??
      (opts.productName
        ? `Halo Fortu, saya mau tanya tentang ${opts.productName}.`
        : 'Halo Fortu, saya mau konsultasi kebutuhan layar.'),
  )
  const from = savedCampaign()
  if (from.utm_campaign || from.utm_source) {
    url.searchParams.set('utm_source', from.utm_source ?? 'fortu.co.id')
    url.searchParams.set('utm_medium', from.utm_medium ?? 'website')
    if (from.utm_campaign) url.searchParams.set('utm_campaign', from.utm_campaign)
    url.searchParams.set('utm_content', from.utm_content ?? opts.location)
  } else {
    url.searchParams.set('utm_source', 'fortu.co.id')
    url.searchParams.set('utm_medium', 'website')
    url.searchParams.set('utm_campaign', opts.productSlug || 'kontak')
    url.searchParams.set('utm_content', opts.location)
  }
  // ad click ids (first touch of the visit), so the CRM can tie the chat to the exact ad click
  if (from.fbclid) url.searchParams.set('fbclid', from.fbclid)
  if (from.gclid) url.searchParams.set('gclid', from.gclid)
  return url.toString()
}

/** True for a link to the CRM's tracked WhatsApp redirect. */
export const isCrmWhatsAppLink = (href: string) => href.startsWith(`${CRM_URL}/go/wa`)
