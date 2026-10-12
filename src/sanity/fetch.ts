import { client } from '@/sanity/client'

/**
 * The one way the site reads from Sanity.
 *
 * Identical requests are shared for the lifetime of the page: the site settings, for example, are
 * needed by the header, hero, footer and contact dialog, and are now fetched once instead of five
 * times. A failed request is not cached, so the next caller retries.
 */
const cache = new Map<string, Promise<unknown>>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetchSanity<T = any>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const key = query + JSON.stringify(params)
  let hit = cache.get(key) as Promise<T> | undefined
  if (!hit) {
    hit = client.fetch<T>(query, params)
    cache.set(key, hit)
    hit.catch(() => cache.delete(key))
  }
  return hit
}
