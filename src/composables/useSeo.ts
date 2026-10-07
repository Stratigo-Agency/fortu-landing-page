import { watchEffect, onBeforeUnmount, toValue, type MaybeRefOrGetter } from 'vue'
import { useRoute } from 'vue-router'
import { SITE_URL, SITE_NAME, SITE_LOCALE, SITE_DESCRIPTION, DEFAULT_SHARE_IMAGE } from '@/config/seo'

export interface SeoOptions {
  /** Page title, without the brand suffix is fine; keep the full string under ~60 characters. */
  title: string
  /** 120-155 characters. */
  description?: string
  /** Clean path for the canonical URL. Defaults to the current route path. */
  path?: string
  /** Absolute URL of a 1200x630 share image. */
  image?: string
  /** og:type, "website" by default; use "article" for blog posts. */
  type?: 'website' | 'article'
  /** Keep this page out of search results. */
  noindex?: boolean
}

const upsert = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
  return el
}

const setMeta = (key: 'name' | 'property', name: string, content: string) =>
  upsert(
    `meta[${key}="${name}"]`,
    () => {
      const el = document.createElement('meta')
      el.setAttribute(key, name)
      return el
    },
    'content',
    content,
  )

const removeMeta = (key: 'name' | 'property', name: string) =>
  document.head.querySelector(`meta[${key}="${name}"]`)?.remove()

const cleanPath = (path: string) => {
  const p = path.split(/[?#]/)[0] || '/'
  return p.length > 1 ? p.replace(/\/+$/, '') : '/'
}

/**
 * Per-page title, description, canonical, Open Graph / Twitter preview and robots.
 * Pass a getter so it reacts to data that loads later (e.g. a product from Sanity).
 */
export function useSeo(options: MaybeRefOrGetter<SeoOptions>) {
  const route = useRoute()

  watchEffect(() => {
    const o = toValue(options)
    const description = o.description || SITE_DESCRIPTION
    const url = SITE_URL + cleanPath(o.path ?? route.path)
    const image = o.image || DEFAULT_SHARE_IMAGE

    document.documentElement.lang = 'id'
    document.title = o.title

    setMeta('name', 'description', description)
    upsert(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        return el
      },
      'href',
      url,
    )

    if (o.noindex) setMeta('name', 'robots', 'noindex, nofollow')
    else if (!document.head.querySelector('meta[name="robots"][data-build]')) removeMeta('name', 'robots')

    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', SITE_LOCALE)
    setMeta('property', 'og:type', o.type || 'website')
    setMeta('property', 'og:title', o.title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', o.title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)
  })

  onBeforeUnmount(() => {
    // Next page sets its own values; just make sure noindex never leaks to it.
    if (!document.head.querySelector('meta[name="robots"][data-build]')) removeMeta('name', 'robots')
  })
}
