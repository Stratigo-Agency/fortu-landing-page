import { ref, type Ref } from 'vue'
import { client, urlFor } from '@/sanity/client'
import { PAGE_SEO_QUERY, type PageSeo } from '@/sanity/queries'
import { useSeo, type SeoOptions } from '@/composables/useSeo'

const cache = new Map<string, Promise<PageSeo | null>>()

const load = (page: string) => {
  if (!cache.has(page)) {
    cache.set(
      page,
      client.fetch<PageSeo | null>(PAGE_SEO_QUERY, { page }).catch((e) => {
        console.warn('Failed to fetch page SEO:', e)
        return null
      }),
    )
  }
  return cache.get(page)!
}

const shareUrl = (img?: PageSeo['shareImage']) => {
  if (!img?.asset) return undefined
  try {
    return urlFor(img).width(1200).height(630).fit('crop').quality(80).url()
  } catch {
    return undefined
  }
}

/**
 * useSeo with Sanity overrides: the "SEO: Halaman" document for this page key
 * (title, description, share image, noindex) wins over the defaults written in code.
 */
export function usePageSeo(page: string, defaults: SeoOptions) {
  const override: Ref<PageSeo | null> = ref(null)
  load(page).then((doc) => (override.value = doc))

  useSeo(() => ({
    ...defaults,
    title: override.value?.seoTitle?.trim() || defaults.title,
    description: override.value?.seoDescription?.trim() || defaults.description,
    image: shareUrl(override.value?.shareImage) || defaults.image,
    noindex: override.value?.noIndex ?? defaults.noindex,
  }))
}
