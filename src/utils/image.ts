/**
 * Single place that turns a Sanity image into a URL: crop/hotspot are honoured, the quality
 * and automatic WebP/AVIF delivery come from `config/image.ts`, and every call is safe
 * (returns null instead of throwing when an image is missing or malformed).
 */
import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export interface ImageOptions {
  width?: number
  height?: number
  /** `crop` uses the editor's hotspot when both width and height are given */
  fit?: 'crop' | 'max' | 'clip' | 'fill' | 'min' | 'scale'
  /** Absolute quality; defaults to `IMAGE_CONFIG.quality` */
  quality?: number
}

type Source = SanityImageSource | undefined | null

/** URL for one rendition of a Sanity image, or null when there is no usable image. */
export function buildImageUrl(img: Source, opts: ImageOptions = {}): string | null {
  if (!img) return null
  try {
    let b = urlFor(img).quality(opts.quality ?? IMAGE_CONFIG.quality)
    if (opts.width) b = b.width(opts.width)
    if (opts.height) b = b.height(opts.height)
    if (opts.fit) b = b.fit(opts.fit)
    return IMAGE_CONFIG.autoFormat ? b.auto('format').url() : b.url()
  } catch {
    return null
  }
}

/** `src` + `srcset` at several widths (the whole image object is passed so the crop is honoured). */
export function responsiveImage(
  img: Source,
  widths: number[] = [480, 768, 1080, 1440, 1920],
  quality?: number,
): { src: string; srcset: string } | null {
  if (!img) return null
  const urls = widths.map((width) => buildImageUrl(img, { width, quality }))
  if (urls.some((u) => !u)) return null
  const mid = Math.min(2, widths.length - 1)
  return {
    src: urls[mid] as string,
    srcset: widths.map((w, i) => `${urls[i]} ${w}w`).join(', '),
  }
}

interface Focal {
  hotspot?: { x?: number; y?: number }
}

/**
 * CSS `object-position` that keeps the editor's hotspot in frame when an `object-cover` image is
 * cropped differently on phone, tablet and desktop. Centre when no hotspot is set.
 */
export function focalPosition(img?: Focal | null): string {
  const h = img?.hotspot
  if (h?.x == null || h?.y == null) return '50% 50%'
  const pct = (n: number) => `${Math.round(Math.min(1, Math.max(0, n)) * 1000) / 10}%`
  return `${pct(h.x)} ${pct(h.y)}`
}

export const focalStyle = (img?: Focal | null) => ({ objectPosition: focalPosition(img) })

/** 1200x630 crop for Open Graph / Twitter cards (plain JPEG: not every crawler reads WebP/AVIF). */
export function ogImageUrl(img: Source): string | null {
  if (!img) return null
  try {
    return urlFor(img).width(1200).height(630).fit('crop').quality(80).url()
  } catch {
    return null
  }
}
