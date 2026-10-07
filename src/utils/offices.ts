import type { Office, SiteSettings } from '@/sanity/queries'

/**
 * Offices from Site Settings. Falls back to the legacy single `address` field so pages
 * keep working until the offices list is filled in.
 */
export function getOffices(settings: SiteSettings | null | undefined): Office[] {
  if (!settings) return []
  const list = (settings.offices || []).filter((o) => o?.city)
  if (list.length) return list
  return settings.address ? [{ city: '', address: settings.address, phone: settings.phone }] : []
}

/** Only real http(s) links are shown; empty or malformed values never render a broken link. */
export const safeUrl = (url?: string) => (url && /^https?:\/\//i.test(url) ? url : undefined)

/** First line of text to show for an office when no full address is known. */
export const officeLabel = (o: Office) => [o.name, o.city].filter(Boolean).join(', ')
