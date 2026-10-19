import { watchEffect, onBeforeUnmount, toValue, type MaybeRefOrGetter } from 'vue'

type JsonLd = Record<string, unknown> | Record<string, unknown>[] | null | undefined

/**
 * Injects <script type="application/ld+json"> into <head>. `key` identifies the block,
 * so it is replaced (not duplicated) when data changes and removed when the page unmounts.
 * Return null/undefined from the getter to emit nothing (e.g. while data is loading).
 */
export function useJsonLd(key: string, data: MaybeRefOrGetter<JsonLd>) {
  const selector = `script[type="application/ld+json"][data-jsonld="${key}"]`

  const remove = () => document.head.querySelector(selector)?.remove()

  watchEffect(() => {
    const value = toValue(data)
    if (!value || (Array.isArray(value) && value.length === 0)) {
      remove()
      return
    }
    let el = document.head.querySelector<HTMLScriptElement>(selector)
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.dataset.jsonld = key
      document.head.appendChild(el)
    }
    // Escape "<" so content can never close the script tag.
    el.textContent = JSON.stringify(value).replace(/</g, '\\u003c')
  })

  onBeforeUnmount(remove)
}
