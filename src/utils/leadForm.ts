import { CRM_URL } from '@/config/contact'

/**
 * The short form shown before every WhatsApp chat with Fortu (MAR-232). The answers go to the CRM's
 * POST /go/wa/lead, which records the click, makes the lead (name, number, campaign, sales) and returns the chat
 * address. The link's own query (line, text, utm_*, fbclid, gclid) is reused as is, so the lead carries exactly what
 * the tracked /go/wa link would have.
 */

export type Interest = 'IFP' | 'DSS' | 'LED' | 'OTHER'

export const INTERESTS: { value: Interest; label: string }[] = [
  { value: 'IFP', label: 'Smartboard / IFP' },
  { value: 'DSS', label: 'Digital signage' },
  { value: 'LED', label: 'Videotron' },
  { value: 'OTHER', label: 'Lainnya' },
]

export interface LeadFormValues {
  name: string
  phone: string
  company: string
  interest: Interest | ''
  /** honeypot: hidden from people */
  website: string
}

export type LeadFormErrors = Partial<Record<'name' | 'phone', string>>

export const LEAD_ENDPOINT = `${CRM_URL}/go/wa/lead`

/** 0812-3456-7890, +62 812 3456 7890, 62812..., 812... are all fine; same rule as the CRM (+62 and 8-13 digits). */
export function isIndonesianMobile(phone: string): boolean {
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  else if (digits.startsWith('8')) digits = `62${digits}`
  if (digits.startsWith('620')) digits = `62${digits.slice(3)}`
  return /^62\d{8,13}$/.test(digits)
}

export function validateLeadForm(v: LeadFormValues): LeadFormErrors {
  const errors: LeadFormErrors = {}
  if (v.name.trim().length < 2) errors.name = 'Isi nama Anda.'
  if (!v.phone.trim()) errors.phone = 'Isi nomor WhatsApp Anda.'
  else if (!isIndonesianMobile(v.phone)) errors.phone = 'Nomor belum benar. Contoh: 0812-3456-7890.'
  return errors
}

/**
 * "Halo Fortu, saya mau tanya tentang X." → "Halo Fortu, saya Budi dari SMA 1. Mau tanya tentang X."
 * so the sales knows who is writing before reading the rest. Any other text gets the introduction in front.
 */
export function personalizeText(text: string, name: string, company: string): string {
  const who = [name.trim(), company.trim() && `dari ${company.trim()}`].filter(Boolean).join(' ')
  if (!who) return text
  const greeting = /^Halo Fortu,\s*saya\s+/i
  if (greeting.test(text)) {
    const rest = text.replace(greeting, '')
    return `Halo Fortu, saya ${who}. ${rest.charAt(0).toUpperCase()}${rest.slice(1)}`.slice(0, 300)
  }
  return `Halo Fortu, saya ${who}. ${text}`.slice(0, 300)
}

/** The JSON body for POST /go/wa/lead, from the tracked link the visitor clicked and their answers. */
export function leadRequest(href: string, v: LeadFormValues, submissionId: string, pageUrl: string) {
  const q = new URL(href).searchParams
  const get = (k: string) => q.get(k) || undefined
  return {
    submission_id: submissionId,
    name: v.name.trim(),
    phone: v.phone.trim(),
    company: v.company.trim() || undefined,
    product_interest: v.interest || undefined,
    line: q.get('line') || '',
    text: personalizeText(q.get('text') || 'Halo Fortu, saya mau konsultasi kebutuhan layar.', v.name, v.company),
    page_url: pageUrl.slice(0, 500),
    utm: { source: get('utm_source'), medium: get('utm_medium'), campaign: get('utm_campaign'), content: get('utm_content') },
    fbclid: get('fbclid'),
    gclid: get('gclid'),
    website: v.website || undefined,
  }
}

export type LeadResult = { ok: true; url: string } | { ok: false; phoneRejected: boolean; fallbackUrl: string }

/**
 * Sends the form. On any failure the visitor still gets a chat: the plain tracked link (the CRM records the click and
 * its code still ties the chat to the campaign). Only a phone number the CRM refuses comes back as an error to fix.
 */
export async function submitLead(
  href: string,
  body: ReturnType<typeof leadRequest>,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<LeadResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetchImpl(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const json = (await res.json().catch(() => ({}))) as { url?: string; fields?: string[] }
    if (res.ok && typeof json.url === 'string' && /^https:\/\/wa\.me\//.test(json.url)) return { ok: true, url: json.url }
    return { ok: false, phoneRejected: res.status === 400 && !!json.fields?.includes('phone'), fallbackUrl: href }
  } catch {
    return { ok: false, phoneRejected: false, fallbackUrl: href }
  } finally {
    clearTimeout(timer)
  }
}

// The answers are kept in this browser only (localStorage), so a returning visitor does not type them again.
const SAVED_KEY = 'fortu_lead_contact'

export function savedContact(): Partial<LeadFormValues> {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) return {}
    const v = JSON.parse(raw) as Partial<LeadFormValues>
    const str = (x: unknown) => (typeof x === 'string' ? x.slice(0, 200) : '')
    const interest = INTERESTS.some((i) => i.value === v.interest) ? (v.interest as Interest) : ''
    return { name: str(v.name), phone: str(v.phone), company: str(v.company), interest }
  } catch {
    return {}
  }
}

export function rememberContact(v: LeadFormValues): void {
  try {
    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify({ name: v.name.trim(), phone: v.phone.trim(), company: v.company.trim(), interest: v.interest }),
    )
  } catch {
    // storage blocked: the form is simply empty next time
  }
}

export function forgetContact(): void {
  try {
    localStorage.removeItem(SAVED_KEY)
  } catch {
    // nothing to forget
  }
}

export const newSubmissionId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
