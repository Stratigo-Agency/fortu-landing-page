import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import type { SanityImage } from '@/sanity/queries'

export const logoSrc = (key?: string) =>
  key && /^[a-z0-9-]+$/.test(key) ? `/clients/${key}.webp` : null

export const imageUrl = (img: SanityImage | undefined, w: number, h?: number) => {
  if (!img?.asset) return null
  try {
    let b = urlFor(img).width(w).quality(IMAGE_CONFIG.quality + 10)
    if (h) b = b.height(h).fit('crop')
    return IMAGE_CONFIG.autoFormat ? b.auto('format').url() : b.url()
  } catch {
    return null
  }
}
