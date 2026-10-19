/** Default destination for the "Hubungi Kami" choices. Both live on the Fortu Linktree until
 *  Sanity (Site Settings > contact destinations) points them somewhere more specific. */
export const DEFAULT_CONTACT_URL = 'https://linktr.ee/digitalfortu1'

export type ContactChoice = 'sales' | 'partnership'

/**
 * Builds the outbound link: removes any inherited tracking (Instagram utm_*, fbclid ...) and
 * adds our own so Linktree/GA can tell website visits apart.
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
    url.searchParams.set('utm_source', 'fortu.co.id')
    url.searchParams.set('utm_medium', 'website')
    url.searchParams.set('utm_content', choice)
    if (campaign) url.searchParams.set('utm_campaign', campaign)
    return url.toString()
  } catch {
    return buildContactUrl(DEFAULT_CONTACT_URL, choice, campaign)
  }
}
