/** Resolves with the element once it exists (sections of the home page load lazily), or null after `timeout` ms. */
export function whenElement(selector: string, timeout = 4000): Promise<Element | null> {
  return new Promise((resolve) => {
    const started = performance.now()
    const look = () => {
      let el: Element | null = null
      try {
        el = document.querySelector(selector)
      } catch {
        return resolve(null)
      }
      if (el) return resolve(el)
      if (performance.now() - started > timeout) return resolve(null)
      setTimeout(look, 80)
    }
    look()
  })
}
