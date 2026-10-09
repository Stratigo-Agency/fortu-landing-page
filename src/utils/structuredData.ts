import { SITE_URL, SITE_NAME } from '@/config/seo'
import type { SiteSettings, Product, BlogPost, FAQ, Office, CaseStudy } from '@/sanity/queries'
import { getOffices } from '@/utils/offices'

const ORG_ID = `${SITE_URL}/#organization`

const compact = <T extends Record<string, unknown>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as T

export const abs = (path: string) => `${SITE_URL}${path}`

/** Organization + WebSite + LocalBusiness, built only from Site Settings data. */
export function organizationGraph(s: SiteSettings | null) {
  if (!s) return null
  const sameAs = Object.values(s.socialMedia || {})
    .filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u))
    .map((u) => u.split('?')[0]) // drop tracking parameters
  const phone = s.phone?.trim()
  const logo = s.logo?.asset?.url
  const organization = compact({
    '@type': 'Organization',
    '@id': ORG_ID,
    name: s.companyName || SITE_NAME,
    url: SITE_URL + '/',
    logo,
    email: s.email,
    telephone: phone,
    sameAs: sameAs.length ? sameAs : undefined,
    contactPoint: phone || s.email
      ? [compact({ '@type': 'ContactPoint', contactType: 'sales', telephone: phone, email: s.email, areaServed: 'ID', availableLanguage: ['id', 'en'] })]
      : undefined,
  })
  const website = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL + '/',
    name: SITE_NAME,
    inLanguage: 'id-ID',
    publisher: { '@id': ORG_ID },
  }
  const graph: Record<string, unknown>[] = [organization, website]
  getOffices(s).forEach((office, i) => {
    graph.push(localBusiness(office, i, s, { sameAs, logo, phone }))
  })
  return { '@context': 'https://schema.org', '@graph': graph }
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function localBusiness(
  office: Office,
  index: number,
  s: SiteSettings,
  shared: { sameAs: string[]; logo?: string; phone?: string },
) {
  const slug = (office.city || `office-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const hours = (office.openingHours || [])
    .filter((h) => h.days?.length && h.opens && h.closes)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days!.filter((d) => DAYS.includes(d)),
      opens: h.opens,
      closes: h.closes,
    }))
  const hasGeo = typeof office.latitude === 'number' && typeof office.longitude === 'number'
  return compact({
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#localbusiness-${slug}`,
    name: office.name || s.companyName || SITE_NAME,
    url: SITE_URL + '/',
    image: shared.logo,
    telephone: office.phone || shared.phone,
    email: s.email,
    address: office.address
      ? compact({
          '@type': 'PostalAddress',
          streetAddress: office.address.replace(/\s+/g, ' ').trim(),
          addressLocality: office.city || undefined,
          addressCountry: 'ID',
        })
      : undefined,
    geo: hasGeo
      ? { '@type': 'GeoCoordinates', latitude: office.latitude, longitude: office.longitude }
      : undefined,
    hasMap: office.mapsUrl && /^https?:\/\//i.test(office.mapsUrl) ? office.mapsUrl : undefined,
    openingHoursSpecification: hours.length ? hours : undefined,
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    parentOrganization: { '@id': ORG_ID },
    sameAs: shared.sameAs.length ? shared.sameAs : undefined,
  })
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  }
}

/** Price is only emitted when it is actually published in Sanity. */
export function productSchema(p: Product | null, imageUrls: string[]) {
  if (!p) return null
  const offers =
    typeof p.price === 'number' && p.price > 0
      ? {
          '@type': 'Offer',
          url: abs(`/products/${p.slug.current}`),
          price: p.price,
          priceCurrency: p.currency || 'IDR',
          availability:
            p.inStock === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          seller: { '@id': ORG_ID },
        }
      : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description?.replace(/\s+/g, ' ').trim() || undefined,
    image: imageUrls.length ? imageUrls : undefined,
    sku: p.sku || undefined,
    brand: { '@type': 'Brand', name: SITE_NAME },
    url: abs(`/products/${p.slug.current}`),
    offers,
  }
}

/** Questions and answers exactly as shown on the page. */
export function faqSchema(f: FAQ | null) {
  const items = (f?.items || []).filter((i) => i.question && i.answer)
  if (!items.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
}

export function blogPostingSchema(p: BlogPost | null, imageUrl?: string) {
  if (!p) return null
  const url = abs(`/blog/${p.slug.current}`)
  const coverage = p.isMediaCoverage === true
  const sourceUrl = coverage && p.sourceUrl && /^https?:\/\//i.test(p.sourceUrl) ? p.sourceUrl : undefined
  return compact({
    '@context': 'https://schema.org',
    '@type': coverage ? 'NewsArticle' : 'BlogPosting',
    headline: p.title,
    description: p.seoDescription || p.excerpt || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    // media coverage: original publication date and publisher of the source article
    datePublished: (coverage && p.sourcePublishedAt) || p.publishedAt,
    dateModified: p.updatedAt || p.publishedAt,
    author:
      coverage && p.sourceAuthor
        ? { '@type': 'Person', name: p.sourceAuthor }
        : p.author
          ? { '@type': 'Person', name: p.author }
          : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    sourceOrganization:
      coverage && p.sourceName ? { '@type': 'Organization', name: p.sourceName } : undefined,
    isBasedOn: sourceUrl,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'id-ID',
  })
}

/** Case study as an Article about the client project (only facts present in Sanity). */
export function caseStudySchema(c: CaseStudy | null, imageUrl?: string) {
  if (!c) return null
  const url = abs(`/studi-kasus/${c.slug.current}`)
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `Studi kasus ${c.clientName}${c.projectType ? ': ' + c.projectType : ''}`,
    description: c.seoDescription || c.summary || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    about: { '@type': 'Organization', name: c.clientName },
    dateModified: c.updatedAt,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'id-ID',
  })
}
