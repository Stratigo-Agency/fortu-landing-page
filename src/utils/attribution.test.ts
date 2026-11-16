import { beforeEach, describe, expect, it, vi } from 'vitest'
import { readCampaignTags, rememberCampaign, savedCampaign } from './attribution'
import { memoryStorage } from '@/test/memoryStorage'

beforeEach(() => {
  vi.stubGlobal('sessionStorage', memoryStorage())
})

describe('readCampaignTags', () => {
  it('keeps the four utm tags and the fbclid / gclid click ids', () => {
    expect(
      readCampaignTags(
        '?utm_source=facebook&utm_medium=paid&utm_campaign=ifp-q4&utm_content=video-1&utm_term=layar&fbclid=IwAR123&gclid=Cj0KCQ&foo=bar',
      ),
    ).toEqual({
      utm_source: 'facebook',
      utm_medium: 'paid',
      utm_campaign: 'ifp-q4',
      utm_content: 'video-1',
      fbclid: 'IwAR123',
      gclid: 'Cj0KCQ',
    })
  })

  it('drops empty values and trims', () => {
    expect(readCampaignTags('?utm_source=%20%20&utm_campaign=%20promo%20')).toEqual({ utm_campaign: 'promo' })
  })

  it('caps utm tags at 100 characters and click ids at 500', () => {
    const tags = readCampaignTags(`?utm_campaign=${'a'.repeat(300)}&gclid=${'g'.repeat(800)}`)
    expect(tags.utm_campaign).toHaveLength(100)
    expect(tags.gclid).toHaveLength(500)
  })
})

describe('rememberCampaign / savedCampaign', () => {
  it('returns nothing before a tagged visit', () => {
    rememberCampaign('?page=2')
    expect(savedCampaign()).toEqual({})
  })

  it('saves the first tagged visit of the tab, click ids included', () => {
    rememberCampaign('?utm_source=facebook&utm_campaign=ifp-q4&fbclid=IwAR123')
    expect(savedCampaign()).toEqual({ utm_source: 'facebook', utm_campaign: 'ifp-q4', fbclid: 'IwAR123' })
  })

  it('a later visit does not overwrite the first touch', () => {
    rememberCampaign('?utm_source=facebook&fbclid=first')
    rememberCampaign('?utm_source=google&gclid=second')
    expect(savedCampaign()).toEqual({ utm_source: 'facebook', fbclid: 'first' })
  })

  it('a visit with only a click id is remembered too', () => {
    rememberCampaign('?gclid=Cj0KCQ')
    expect(savedCampaign()).toEqual({ gclid: 'Cj0KCQ' })
  })

  it('ignores unknown keys planted in storage', () => {
    sessionStorage.setItem('fortu_campaign', JSON.stringify({ utm_source: 'x', email: 'a@b.c' }))
    expect(savedCampaign()).toEqual({ utm_source: 'x' })
  })

  it('works without storage (private mode)', () => {
    vi.stubGlobal('sessionStorage', {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    })
    expect(() => rememberCampaign('?utm_source=facebook')).not.toThrow()
    expect(savedCampaign()).toEqual({})
  })
})
