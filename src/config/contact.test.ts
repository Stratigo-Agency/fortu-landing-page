import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CRM_URL,
  PRODUCTION_CRM_URL,
  SALES_TEAMS,
  STAGING_CRM_URL,
  buildSalesWhatsAppUrl,
  isCrmWhatsAppLink,
  officeWhatsAppLine,
  resolveCrmUrl,
} from './contact'
import { rememberCampaign } from '@/utils/attribution'
import { officePhone } from '@/utils/offices'
import { memoryStorage } from '@/test/memoryStorage'

const jakarta = SALES_TEAMS[0]
const params = (href: string) => Object.fromEntries(new URL(href).searchParams)

beforeEach(() => {
  vi.stubGlobal('sessionStorage', memoryStorage())
})

describe('resolveCrmUrl', () => {
  it('uses VITE_CRM_URL when set, without a trailing slash', () => {
    expect(resolveCrmUrl('https://crm.example.test/', true)).toBe('https://crm.example.test')
    expect(resolveCrmUrl('https://crm.example.test', false)).toBe('https://crm.example.test')
  })

  it('defaults to the production CRM only for a production build', () => {
    expect(resolveCrmUrl(undefined, true)).toBe(PRODUCTION_CRM_URL)
    expect(resolveCrmUrl('', false)).toBe(STAGING_CRM_URL)
    expect(resolveCrmUrl('  ', false)).toBe(STAGING_CRM_URL)
  })

  it('tests are not a production build, so they use the staging CRM', () => {
    expect(CRM_URL).toBe(STAGING_CRM_URL)
  })
})

describe('buildSalesWhatsAppUrl', () => {
  it('links to the CRM /go/wa with the whole team and website utm tags', () => {
    const href = buildSalesWhatsAppUrl(jakarta, { location: 'hubungi_jakarta' })
    expect(href.startsWith(`${CRM_URL}/go/wa?`)).toBe(true)
    expect(isCrmWhatsAppLink(href)).toBe(true)
    expect(params(href)).toEqual({
      line: 'Jakarta-1,Jakarta-2,Jakarta-3,Jakarta-4',
      text: 'Halo Fortu, saya mau konsultasi kebutuhan layar.',
      utm_source: 'fortu.co.id',
      utm_medium: 'website',
      utm_campaign: 'kontak',
      utm_content: 'hubungi_jakarta',
    })
  })

  it('names the product in the message and uses its slug as campaign', () => {
    const p = params(
      buildSalesWhatsAppUrl(jakarta, { location: 'product_hero', productName: 'IFP 75"', productSlug: 'ifp-75' }),
    )
    expect(p.text).toBe('Halo Fortu, saya mau tanya tentang IFP 75".')
    expect(p.utm_campaign).toBe('ifp-75')
  })

  it('a custom text wins', () => {
    expect(params(buildSalesWhatsAppUrl(jakarta, { location: 'x', text: 'Halo' })).text).toBe('Halo')
  })

  it('passes on the campaign that brought the visitor, and keeps the button as content when the ad has none', () => {
    rememberCampaign('?utm_source=facebook&utm_medium=paid&utm_campaign=ifp-q4')
    expect(params(buildSalesWhatsAppUrl(jakarta, { location: 'product_hero', productSlug: 'ifp-75' }))).toMatchObject({
      utm_source: 'facebook',
      utm_medium: 'paid',
      utm_campaign: 'ifp-q4',
      utm_content: 'product_hero',
    })
  })

  it('passes fbclid and gclid on as their own params', () => {
    rememberCampaign('?utm_source=facebook&fbclid=IwAR123&gclid=Cj0KCQ')
    const p = params(buildSalesWhatsAppUrl(jakarta, { location: 'x' }))
    expect(p.fbclid).toBe('IwAR123')
    expect(p.gclid).toBe('Cj0KCQ')
  })

  it('a visit with only a click id still says website as source', () => {
    rememberCampaign('?fbclid=IwAR123')
    const p = params(buildSalesWhatsAppUrl(jakarta, { location: 'x' }))
    expect(p).toMatchObject({ utm_source: 'fortu.co.id', utm_medium: 'website', utm_campaign: 'kontak', fbclid: 'IwAR123' })
    expect(p.gclid).toBeUndefined()
  })
})

describe('office WhatsApp numbers', () => {
  it('maps an office city to its CRM line, case-insensitively', () => {
    expect(officeWhatsAppLine(' Jakarta ')).toBe('Kantor-Jakarta')
    expect(officeWhatsAppLine('BALI')).toBe('Kantor-Bali')
    expect(officeWhatsAppLine('Surabaya')).toBeUndefined()
  })

  it('a WhatsApp office number opens the CRM tracked link for its line', () => {
    const phone = officePhone({ city: 'Jakarta', phone: '0800-0000-0000', phoneType: 'whatsapp' })
    expect(phone?.kind).toBe('whatsapp')
    expect(phone?.display).toBe('0800-0000-0000')
    expect(isCrmWhatsAppLink(phone!.href)).toBe(true)
    expect(params(phone!.href)).toMatchObject({ line: 'Kantor-Jakarta', utm_content: 'kontak_kantor_jakarta' })
  })

  it('an office without a CRM line falls back to wa.me', () => {
    expect(officePhone({ city: 'Surabaya', phone: '0800-0000-0000', phoneType: 'whatsapp' })?.href).toBe(
      'https://wa.me/6280000000000',
    )
  })

  it('a regular office number is a phone call', () => {
    expect(officePhone({ city: 'Medan', phone: '0800 0000 0000' })).toEqual({
      kind: 'phone',
      display: '0800 0000 0000',
      href: 'tel:080000000000',
    })
  })
})
