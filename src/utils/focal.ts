import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface Focal {
  hotspot?: { x?: number; y?: number }
}

/**
 * CSS `object-position` that keeps the editor's hotspot in frame when an
 * `object-cover` image is cropped to a different shape (phone, tablet, desktop).
 * Falls back to the centre when no hotspot is set.
 */
export function focalPosition(img?: Focal | null): string {
  const h = img?.hotspot
  if (h?.x == null || h?.y == null) return '50% 50%'
  const pct = (n: number) => `${Math.round(Math.min(1, Math.max(0, n)) * 1000) / 10}%`
  return `${pct(h.x)} ${pct(h.y)}`
}

export const focalStyle = (img?: Focal | null) => ({ objectPosition: focalPosition(img) })

/**
 * `src` + `srcset` for a Sanity image at several widths. The whole image object
 * is passed through (not just `.asset`) so the editor's crop is honoured.
 */
export function responsiveImage(
  img: SanityImageSource | undefined | null,
  widths: number[] = [480, 768, 1080, 1440, 1920],
  quality: number = IMAGE_CONFIG.quality,
): { src: string; srcset: string } | null {
  if (!img) return null
  try {
    const build = (w: number) => {
      const b = urlFor(img).width(w).quality(quality)
      return IMAGE_CONFIG.autoFormat ? b.auto('format').url() : b.url()
    }
    const mid = widths[Math.min(2, widths.length - 1)]
    return { src: build(mid), srcset: widths.map((w) => `${build(w)} ${w}w`).join(', ') }
  } catch {
    return null
  }
}
