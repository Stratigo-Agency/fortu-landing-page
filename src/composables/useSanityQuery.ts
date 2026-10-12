import { onMounted, ref, type Ref } from 'vue'
import { fetchSanity } from '@/sanity/fetch'

interface Options<T> {
  params?: Record<string, unknown>
  /** Value before the data arrives (and when the request fails): `[]` for lists, null otherwise */
  initial?: T
  /** Shown in the console if the request fails */
  label?: string
}

/**
 * Loads a Sanity query when the component mounts.
 * `data` keeps `initial` on failure, so a section simply renders nothing instead of breaking the page.
 */
export function useSanityQuery<T>(
  query: string,
  options: Options<T> & { initial: T },
): { data: Ref<T>; loading: Ref<boolean>; error: Ref<unknown> }
export function useSanityQuery<T>(
  query: string,
  options?: Options<T>,
): { data: Ref<T | null>; loading: Ref<boolean>; error: Ref<unknown> }
export function useSanityQuery<T>(query: string, options: Options<T> = {}) {
  const data = ref(options.initial ?? null) as Ref<T | null>
  const loading = ref(true)
  const error = ref<unknown>(null)

  onMounted(async () => {
    try {
      data.value = await fetchSanity<T>(query, options.params)
    } catch (e) {
      error.value = e
      console.error(`Failed to fetch ${options.label ?? 'content'}:`, e)
    } finally {
      loading.value = false
    }
  })

  return { data, loading, error }
}
