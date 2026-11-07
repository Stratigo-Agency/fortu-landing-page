/**
 * Remembers which campaign brought a visitor to the site, so the "Hubungi Sales" link can pass it on
 * (the CRM then shows the lead under the right ad or campaign).
 *
 * Only the four campaign tags are kept: utm_source, utm_medium, utm_campaign, utm_content. They name a
 * campaign, not a person. No click ids (fbclid, gclid) are stored. The values live in sessionStorage, so they
 * disappear when the tab closes, and the first campaign of a visit wins.
 */
const KEY = 'fortu_campaign'
const TAGS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

export type CampaignTags = Partial<Record<(typeof TAGS)[number], string>>

const clean = (value: string | null): string | undefined => {
  const v = value?.trim().slice(0, 100)
  return v ? v : undefined
}

/** Reads the campaign tags from an address bar query ("?utm_source=facebook&..."). */
export function readCampaignTags(search: string): CampaignTags {
  const params = new URLSearchParams(search)
  const tags: CampaignTags = {}
  for (const key of TAGS) {
    const value = clean(params.get(key))
    if (value) tags[key] = value
  }
  return tags
}

/** Call once on page load: saves the tags of the first tagged visit in this tab. */
export function rememberCampaign(search: string = window.location.search): void {
  try {
    if (sessionStorage.getItem(KEY)) return
    const tags = readCampaignTags(search)
    if (Object.keys(tags).length > 0) sessionStorage.setItem(KEY, JSON.stringify(tags))
  } catch {
    // storage blocked (private mode): the link simply carries no campaign
  }
}

/** The saved tags, or an empty object. */
export function savedCampaign(): CampaignTags {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? readCampaignTags('?' + new URLSearchParams(JSON.parse(raw)).toString()) : {}
  } catch {
    return {}
  }
}
