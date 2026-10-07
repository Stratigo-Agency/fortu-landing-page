import { SITE_URL, SITE_NAME } from '@/config/seo'
import type { SiteSettings, Product, BlogPost, FAQ } from '@/sanity/queries'

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
  if (s.address) {
    graph.push(
      compact({
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name: s.companyName || SITE_NAME,
        url: SITE_URL + '/',
        image: logo,
        telephone: phone,
        email: s.email,
        address: { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'ID' },
        areaServed: { '@type': 'Country', name: 'Indonesia' },
        parentOrganization: { '@id': ORG_ID },
        sameAs: sameAs.length ? sameAs : undefined,
      }),
    )
  }
  return { '@context': 'https://schema.org', '@graph': graph }
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
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.seoDescription || p.excerpt || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt || p.publishedAt,
    author: p.author ? { '@type': 'Person', name: p.author } : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    inLanguage: 'id-ID',
  }
}
