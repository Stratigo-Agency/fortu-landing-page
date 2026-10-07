import type { NavProduct } from '@/sanity/queries'

/** Used until Sanity answers (or if it fails): the featured products in the header. */
export const FALLBACK_NAV_PRODUCTS: NavProduct[] = [
  { _id: 'smart-mobile-signage', name: 'Smart Mobile Signage', slug: 'smart-mobile-signage', status: 'active' },
  { _id: 'interactive-flat-panel', name: 'Interactive Flat Panel', slug: 'interactive-flat-panel', status: 'active' },
  { _id: 'digital-signage-standing', name: 'Digital Signage Standing', slug: 'digital-signage-standing', status: 'active' },
  { _id: 'videotron', name: 'Videotron', slug: 'videotron', status: 'coming_soon' },
]

export const NAV_LINKS = [
  { label: 'Tentang', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Kontak', to: '/contact' },
]
