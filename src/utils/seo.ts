import { SITE_NAME } from '@/config/seo'

/** Cut at a word boundary and add an ellipsis. */
export const trimTo = (text: string, max: number) =>
  text.length <= max ? text : text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'

/**
 * Page title that fits Google's ~60 characters: "Title | Brand" when it fits, the bare title when only
 * the brand has to go, and a trimmed title as the last resort.
 */
export const fitTitle = (title: string, max = 60, brand = SITE_NAME) => {
  const full = `${title} | ${brand}`
  if (full.length <= max) return full
  return trimTo(title, max)
}
