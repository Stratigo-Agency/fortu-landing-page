import { buildImageUrl } from '@/utils/image'
import { IMAGE_CONFIG } from '@/config/image'
import type { SanityImage } from '@/sanity/queries'

export const logoSrc = (key?: string) =>
  key && /^[a-z0-9-]+$/.test(key) ? `/clients/${key}.webp` : null

export const imageUrl = (img: SanityImage | undefined, w: number, h?: number) =>
  buildImageUrl(img?.asset ? img : null, {
    width: w,
    height: h,
    fit: h ? 'crop' : undefined,
    quality: IMAGE_CONFIG.quality + 10,
  })
