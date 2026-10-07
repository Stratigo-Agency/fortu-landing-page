import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import type { BlogPostListItem } from '@/sanity/queries'

export const formatDate = (date?: string) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export const categoryLabel = (value: string) => {
  const map: Record<string, string> = {
    news: 'Berita',
    tutorial: 'Tutorial',
    product: 'Produk',
    tips: 'Tips',
    other: 'Lainnya',
  }
  return map[value] || value
}

/** Original publication date for media coverage, our own date otherwise. */
export const displayDate = (post: BlogPostListItem) =>
  (post.isMediaCoverage && post.sourcePublishedAt) || post.publishedAt

/** "Liputan Media · CNBC Indonesia" for coverage, the category name otherwise. */
export const postLabel = (post: BlogPostListItem) => {
  if (post.isMediaCoverage) {
    return post.sourceName ? `Liputan Media · ${post.sourceName}` : 'Liputan Media'
  }
  return post.category ? categoryLabel(post.category) : ''
}

export const postCoverUrl = (post: BlogPostListItem, width = 800) => {
  if (!post.coverImage?.asset) return null
  try {
    const builder = urlFor(post.coverImage).width(width).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return null
  }
}
