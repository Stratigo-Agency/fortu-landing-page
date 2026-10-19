import { ref, type Ref } from 'vue'
import { fetchSanity } from '@/sanity/fetch'
import { ogImageUrl } from '@/utils/image'
import { PAGE_SEO_QUERY, type PageSeo } from '@/sanity/queries'
import { useSeo, type SeoOptions } from '@/composables/useSeo'

const cache = new Map<string, Promise<PageSeo | null>>()

const load = (page: string) => {
  if (!cache.has(page)) {
    cache.set(
      page,
      fetchSanity<PageSeo | null>(PAGE_SEO_QUERY, { page }).catch((e) => {
        console.warn('Failed to fetch page SEO:', e)
        return null
      }),
    )
  }
  return cache.get(page)!
}

const shareUrl = (img?: PageSeo['shareImage']) => (img?.asset ? ogImageUrl(img) ?? undefined : undefined)

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
