import type { Office, OfficeHours, SiteSettings } from '@/sanity/queries'

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

/** An office is listed in the footer / contact cards only when it has something to show. */
export const isListable = (o: Office) => !!(o.address || o.mapsUrl || o.name)

/**
 * Only Google Maps embed URLs are ever put in an iframe, and always as the standard road map.
 * "Share > Embed a map" copies whatever view was on screen, and a satellite view (!5e1) is
 * hard to read for most visitors, so the map type in the URL is reset to the default (!5e0).
 */
export const safeEmbedUrl = (url?: string) =>
  url && /^https:\/\/www\.google\.com\/maps\/embed\?/i.test(url) ? url.replace(/!5e\d/, '!5e0') : undefined

export type OfficePhoneKind = 'whatsapp' | 'phone'

/** 0896-8407-3110 or +62 896... -> 6289684073110 (digits only, as wa.me expects). */
const toInternationalDigits = (phone: string, country = '62') => {
  const digits = phone.replace(/\D/g, '')
  if (phone.trim().startsWith('+')) return digits
  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('0')) return country + digits.slice(1)
  return digits.startsWith(country) ? digits : country + digits
}

/**
 * How an office number is shown and opened. Whether it is a WhatsApp number comes from
 * Sanity (`phoneType`); it cannot be guessed from the digits, so anything not marked
 * 'whatsapp' is a regular phone call.
 */
export function officePhone(o: Office): { kind: OfficePhoneKind; display: string; href: string } | null {
  const display = o.phone?.trim()
  if (!display) return null
  if (o.phoneType === 'whatsapp') {
    return { kind: 'whatsapp', display, href: `https://wa.me/${toInternationalDigits(display)}` }
  }
  return { kind: 'phone', display, href: `tel:${display.replace(/[^+\d]/g, '')}` }
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_ID: Record<string, string> = {
  Monday: 'Senin',
  Tuesday: 'Selasa',
  Wednesday: 'Rabu',
  Thursday: 'Kamis',
  Friday: 'Jumat',
  Saturday: 'Sabtu',
  Sunday: 'Minggu',
}
const time = (t?: string) => (t || '').replace(':', '.')

/** "Senin–Sabtu 08.00–21.00" lines, plus "Minggu tutup" for days that are not listed. */
export function formatHours(hours?: OfficeHours[]): string[] {
  const rows = (hours || []).filter((h) => h.days?.length && h.opens && h.closes)
  if (!rows.length) return []
  const lines: string[] = []
  const open = new Set<string>()
  for (const row of rows) {
    const idx = row
      .days!.filter((d) => DAY_ORDER.includes(d))
      .map((d) => DAY_ORDER.indexOf(d))
      .sort((a, b) => a - b)
    idx.forEach((i) => open.add(DAY_ORDER[i]))
    // split into runs of consecutive days
    let start = 0
    for (let i = 1; i <= idx.length; i++) {
      if (i === idx.length || idx[i] !== idx[i - 1] + 1) {
        const a = DAY_ID[DAY_ORDER[idx[start]]]
        const b = DAY_ID[DAY_ORDER[idx[i - 1]]]
        lines.push(`${a === b ? a : `${a}–${b}`} ${time(row.opens)}–${time(row.closes)}`)
        start = i
      }
    }
  }
  const closed = DAY_ORDER.filter((d) => !open.has(d)).map((d) => DAY_ID[d])
  if (closed.length) lines.push(`${closed.join(', ')} tutup`)
  return lines
}
