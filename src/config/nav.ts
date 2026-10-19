/**
 * Header menu structure (agreed with the product team, 12 Oct 2026).
 * Category -> group (a product page) -> sizes (the page opens with that size selected).
 *
 * `slug` must match the product slug in Sanity. A group only becomes a link once that product exists
 * and is "active"; until then it shows as "Segera", so the menu never leads to a 404.
 */
export interface MenuSize {
  label: string
  /** Sent as ?ukuran= so the product page opens on that size */
  value?: string
  /** Not announced yet (TBD): shown as "Segera", never a link */
  soon?: boolean
}

export interface MenuGroup {
  label: string
  /** Page path under /products/ */
  slug: string
  /** Slug of the Sanity product behind this group, when it differs from `slug` (e.g. one Videotron product, two menu entries) */
  product?: string
  sizes?: MenuSize[]
}

export interface MenuCategory {
  id: string
  label: string
  groups: MenuGroup[]
}

const inch = (...n: number[]): MenuSize[] => n.map((v) => ({ label: `${v}"`, value: String(v) }))
const pitch = (...p: string[]): MenuSize[] => p.map((v) => (v === 'TBD' ? { label: 'TBD', soon: true } : { label: v, value: v }))

export const NAV_MENU: MenuCategory[] = [
  {
    id: 'digital-signage',
    label: 'Digital Signage',
    groups: [
      { label: 'Digital Signage Standing', slug: 'digital-signage-standing', sizes: inch(43, 55, 65) },
      { label: 'Digital Signage Wall-mount', slug: 'digital-signage-wall-mount', sizes: inch(32, 43, 55, 65, 75) },
      { label: 'Digital Signage Outdoor', slug: 'digital-signage-outdoor', sizes: inch(43, 55, 65) },
      { label: 'Smart Mobile Signage', slug: 'smart-mobile-signage' },
    ],
  },
  {
    id: 'interactive-flat-panel',
    label: 'Interactive Flat Panel',
    groups: [
      { label: 'Interactive Flat Panel Android', slug: 'interactive-flat-panel', sizes: inch(65, 75, 86, 98) },
      { label: 'Interactive Flat Panel Windows', slug: 'interactive-flat-panel-windows', sizes: inch(65, 75, 86, 98) },
    ],
  },
  {
    id: 'videotron',
    label: 'Videotron',
    groups: [
      { label: 'Videotron Indoor', slug: 'videotron-indoor', product: 'videotron', sizes: pitch('P1.8', 'P2.5', 'TBD') },
      { label: 'Videotron Outdoor', slug: 'videotron-outdoor', product: 'videotron', sizes: pitch('P4', 'P6', 'TBD') },
    ],
  },
]

/** Slugs treated as live until Sanity answers (or if it fails), so the menu is usable straight away. */
export const FALLBACK_LIVE_SLUGS = ['digital-signage-standing', 'interactive-flat-panel', 'smart-mobile-signage']

export interface NavLink {
  label: string
  to: string
  /** Scrolls to a section of the landing page instead of opening a page */
  hash?: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Portfolio', to: '/', hash: '#portfolio' },
  { label: 'Tentang', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Kontak', to: '/contact' },
]
