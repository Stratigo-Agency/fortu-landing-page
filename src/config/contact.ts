import { savedCampaign } from '@/utils/attribution'

/** Default destination for the "Hubungi Kami" choices. Both live on the Fortu Linktree until
 *  Sanity (Site Settings > contact destinations) points them somewhere more specific. */
export const DEFAULT_CONTACT_URL = 'https://linktr.ee/digitalfortu1'

export type ContactChoice = 'sales' | 'partnership'

/**
 * Builds the outbound link: removes any inherited tracking (Instagram utm_*, fbclid ...) and
 * adds our own so Linktree/GA/CRM can tell website visits apart.
 * When the visitor arrived from a tagged campaign (a Meta ad with utm_*), that campaign is passed on in
 * utm_source / utm_medium / utm_campaign / utm_content instead, so the CRM credits the ad. The product the
 * button belongs to then goes into utm_term, because utm_campaign is taken by the ad.
 */
export function buildContactUrl(
  base: string | undefined,
  choice: ContactChoice,
  campaign?: string,
): string {
  try {
    const url = new URL(base || DEFAULT_CONTACT_URL)
    if (!/^https?:$/.test(url.protocol)) throw new Error('bad protocol')
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith('utm_') || key === 'fbclid' || key === 'igshid' || key === '_aem_' || key === 'mibextid') {
        url.searchParams.delete(key)
      }
    }
    const from = savedCampaign()
    if (from.utm_campaign || from.utm_source) {
      url.searchParams.set('utm_source', from.utm_source ?? 'fortu.co.id')
      url.searchParams.set('utm_medium', from.utm_medium ?? 'website')
      if (from.utm_campaign) url.searchParams.set('utm_campaign', from.utm_campaign)
      url.searchParams.set('utm_content', from.utm_content ?? choice)
      if (campaign) url.searchParams.set('utm_term', campaign)
    } else {
      url.searchParams.set('utm_source', 'fortu.co.id')
      url.searchParams.set('utm_medium', 'website')
      url.searchParams.set('utm_content', choice)
      if (campaign) url.searchParams.set('utm_campaign', campaign)
    }
    return url.toString()
  } catch {
    return buildContactUrl(DEFAULT_CONTACT_URL, choice, campaign)
  }
}
