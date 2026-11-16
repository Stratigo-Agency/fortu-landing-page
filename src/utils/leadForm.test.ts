import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SALES_TEAMS, STAGING_CRM_URL, buildSalesWhatsAppUrl } from '@/config/contact'
import { rememberCampaign } from '@/utils/attribution'
import { memoryStorage } from '@/test/memoryStorage'
import {
  LEAD_ENDPOINT,
  type LeadFormValues,
  forgetContact,
  isIndonesianMobile,
  leadRequest,
  personalizeText,
  rememberContact,
  savedContact,
  submitLead,
  validateLeadForm,
} from './leadForm'

const form = (v: Partial<LeadFormValues> = {}): LeadFormValues => ({
  name: 'Budi Santoso',
  phone: '0812-3456-7890',
  company: 'SMA Negeri 1',
  interest: 'IFP',
  website: '',
  ...v,
})

beforeEach(() => {
  vi.stubGlobal('sessionStorage', memoryStorage())
  vi.stubGlobal('localStorage', memoryStorage())
})

describe('validateLeadForm', () => {
  it('needs a name and an Indonesian mobile number', () => {
    expect(validateLeadForm(form())).toEqual({})
    expect(validateLeadForm(form({ name: ' ' })).name).toBeTruthy()
    expect(validateLeadForm(form({ phone: '' })).phone).toBe('Isi nomor WhatsApp Anda.')
    expect(validateLeadForm(form({ phone: '12345' })).phone).toContain('belum benar')
  })

  it('accepts the usual ways people write a number, like the CRM does', () => {
    for (const p of ['0812-3456-7890', '+62 812 3456 7890', '6281234567890', '812 3456 7890', '+62 (0)812-3456-7890']) {
      expect(isIndonesianMobile(p)).toBe(true)
    }
    expect(isIndonesianMobile('021')).toBe(false)
    expect(isIndonesianMobile('+1 415 555 0100')).toBe(false)
  })
})

describe('personalizeText', () => {
  it('puts the name and company into the greeting so the sales knows who writes', () => {
    expect(personalizeText('Halo Fortu, saya mau tanya tentang IFP 65.', 'Budi', 'SMA 1')).toBe(
      'Halo Fortu, saya Budi dari SMA 1. Mau tanya tentang IFP 65.',
    )
    expect(personalizeText('Halo Fortu, saya mau konsultasi kebutuhan layar.', 'Budi', '')).toBe(
      'Halo Fortu, saya Budi. Mau konsultasi kebutuhan layar.',
    )
    expect(personalizeText('Halo Fortu, saya mau tanya ke kantor Bali.', 'Ani', ' ')).toBe(
      'Halo Fortu, saya Ani. Mau tanya ke kantor Bali.',
    )
  })

  it('introduces the visitor before any other text, and stays within the CRM limit', () => {
    expect(personalizeText('Mau tanya partnership.', 'Budi', '')).toBe('Halo Fortu, saya Budi. Mau tanya partnership.')
    expect(personalizeText('x'.repeat(400), 'Budi', '').length).toBe(300)
  })
})

describe('leadRequest', () => {
  it('carries the clicked link (line, campaign, ad click ids) and the answers', () => {
    rememberCampaign('?utm_source=facebook&utm_medium=paid&utm_campaign=ifp-sekolah&fbclid=IwAR_x&gclid=G_y')
    const href = buildSalesWhatsAppUrl(SALES_TEAMS[0], { location: 'product_hero', productName: 'IFP 65' })
    const body = leadRequest(href, form({ company: '  ' }), 'id-1', 'https://fortu.co.id/products/ifp-65')
    expect(body).toEqual({
      submission_id: 'id-1',
      name: 'Budi Santoso',
      phone: '0812-3456-7890',
      company: undefined,
      product_interest: 'IFP',
      line: 'Jakarta-1,Jakarta-2,Jakarta-3,Jakarta-4',
      text: 'Halo Fortu, saya Budi Santoso. Mau tanya tentang IFP 65.',
      page_url: 'https://fortu.co.id/products/ifp-65',
      utm: { source: 'facebook', medium: 'paid', campaign: 'ifp-sekolah', content: 'product_hero' },
      fbclid: 'IwAR_x',
      gclid: 'G_y',
      website: undefined,
    })
  })
})

describe('submitLead', () => {
  const href = `${STAGING_CRM_URL}/go/wa?line=Jakarta-1`
  const body = leadRequest(href, form(), 'id-1', 'https://fortu.co.id/')
  const reply = (status: number, json: unknown) =>
    vi.fn(async () => new Response(JSON.stringify(json), { status, headers: { 'content-type': 'application/json' } }))

  it('posts to the CRM and returns the WhatsApp chat it gives', async () => {
    const fetchImpl = reply(200, { url: 'https://wa.me/6281300000000?text=Halo%20%23W7K2' })
    expect(await submitLead(href, body, fetchImpl)).toEqual({ ok: true, url: 'https://wa.me/6281300000000?text=Halo%20%23W7K2' })
    expect(LEAD_ENDPOINT).toBe(`${STAGING_CRM_URL}/go/wa/lead`)
    expect(fetchImpl).toHaveBeenCalledWith(LEAD_ENDPOINT, expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }))
  })

  it('a number the CRM refuses comes back as an error to fix', async () => {
    expect(await submitLead(href, body, reply(400, { error: 'bad_request', fields: ['phone'] }))).toEqual({
      ok: false,
      phoneRejected: true,
      fallbackUrl: href,
    })
  })

  it('never blocks the chat: CRM down, offline or an odd answer fall back to the tracked link', async () => {
    for (const fetchImpl of [
      reply(503, { error: 'unavailable' }),
      reply(200, { url: 'https://evil.example/' }),
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    ]) {
      expect(await submitLead(href, body, fetchImpl as typeof fetch)).toEqual({ ok: false, phoneRejected: false, fallbackUrl: href })
    }
  })
})

describe('saved contact', () => {
  it('remembers the answers in this browser, and forgets them on request', () => {
    expect(savedContact()).toEqual({})
    rememberContact(form({ name: ' Budi ', website: 'bot' }))
    expect(savedContact()).toEqual({ name: 'Budi', phone: '0812-3456-7890', company: 'SMA Negeri 1', interest: 'IFP' })
    forgetContact()
    expect(savedContact()).toEqual({})
  })

  it('ignores a damaged saved value', () => {
    localStorage.setItem('fortu_lead_contact', '{not json')
    expect(savedContact()).toEqual({})
    localStorage.setItem('fortu_lead_contact', JSON.stringify({ name: 1, interest: 'TV' }))
    expect(savedContact()).toEqual({ name: '', phone: '', company: '', interest: '' })
  })
})
