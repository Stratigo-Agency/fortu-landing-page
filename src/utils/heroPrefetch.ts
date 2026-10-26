/**
 * Starts the hero request and the still-image preload as soon as the route is known, before the
 * page chunk has loaded and the component has mounted. The component later reads the same shared
 * `fetchSanity` promise, so the LCP image is already in flight (or cached) when it first renders.
 */
import { fetchSanity } from '@/sanity/fetch'
import { HERO_QUERY, PAGE_HERO_QUERY } from '@/sanity/queries'
import { buildImageUrl, responsiveImage } from '@/utils/image'

// Keep in sync with the `pageName` each page passes to PageHero
const PAGE_NAME_BY_PATH: Record<string, string> = {
  '/products': 'products',
  '/about': 'about',
  '/contact': 'contact',
  '/privacy': 'privacy',
  '/blog': 'blog',
  '/studi-kasus': 'case-studies',
}

const preloaded = new Set<string>()

function preloadImage(href: string, srcset?: string) {
  if (preloaded.has(href)) return
  preloaded.add(href)
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = href
  if (srcset) {
    link.setAttribute('imagesrcset', srcset)
    link.setAttribute('imagesizes', '100vw')
  }
  link.setAttribute('fetchpriority', 'high')
  document.head.appendChild(link)
}

export function prefetchHero(path: string) {
  const normalized = path.length > 1 ? path.replace(/\/$/, '') : path

  if (normalized === '/') {
    fetchSanity(HERO_QUERY)
      .then((hero) => {
        // Same rendition Hero.vue uses for the poster / still
        const still = buildImageUrl(hero?.backgroundPoster ?? hero?.backgroundImage, { width: 1920 })
        if (still) preloadImage(still)
      })
      .catch(() => {})
    return
  }

  const pageName = PAGE_NAME_BY_PATH[normalized]
  if (!pageName) return
  fetchSanity(PAGE_HERO_QUERY, { pageName })
    .then((hero) => {
      // Same widths PageHero.vue puts in the <img srcset>
      const image = hero?.backgroundVideo?.asset?.url
        ? null
        : responsiveImage(hero?.backgroundImage, [640, 1024, 1536, 2048])
      if (image) preloadImage(image.src, image.srcset)
    })
    .catch(() => {})
}
