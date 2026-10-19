import { ref, watch, onBeforeUnmount, type Ref } from 'vue'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * State and controls for a horizontally scrolling (scroll-snap) rail, so every slider on the
 * site can show the same arrows, "02 / 05" counter and progress line (SliderControls.vue).
 *
 * Card positions are measured from the DOM, so it works with any card width, gap or breakpoint.
 * The rail's `scroll-padding-left` (e.g. Tailwind `scroll-px-6`) is honoured: set it equal to the
 * rail's padding so a snapped card keeps its margin instead of touching the screen edge.
 */
export function useScrollSlider(rail: Ref<HTMLElement | null>) {
  const index = ref(0)
  const count = ref(0)
  const canScroll = ref(false)
  const isAtStart = ref(true)
  const isAtEnd = ref(true)

  let frame = 0
  let current: HTMLElement | null = null
  let resizeObserver: ResizeObserver | null = null
  let mutationObserver: MutationObserver | null = null

  const cards = (el: HTMLElement) => Array.from(el.children) as HTMLElement[]
  const inset = (el: HTMLElement) => parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0

  const measure = () => {
    frame = 0
    const el = rail.value
    if (!el) return
    const list = cards(el)
    count.value = list.length

    const max = el.scrollWidth - el.clientWidth
    canScroll.value = max > 4
    isAtStart.value = el.scrollLeft <= 4
    isAtEnd.value = el.scrollLeft >= max - 4
    if (!list.length) return

    // At the very end the last card can never reach the start edge, so call it the current one
    if (canScroll.value && isAtEnd.value) {
      index.value = list.length - 1
      return
    }
    const origin = el.getBoundingClientRect().left + inset(el)
    let best = 0
    let bestDistance = Infinity
    list.forEach((card, i) => {
      const distance = Math.abs(card.getBoundingClientRect().left - origin)
      if (distance < bestDistance) {
        bestDistance = distance
        best = i
      }
    })
    index.value = best
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure)
  }

  const scrollToIndex = (i: number) => {
    const el = rail.value
    if (!el) return
    const list = cards(el)
    const target = list[Math.max(0, Math.min(list.length - 1, i))]
    if (!target) return
    const left = target.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - inset(el)
    el.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // Where each card starts, as a scrollLeft value
  const offsets = (el: HTMLElement) => {
    const base = el.getBoundingClientRect().left - el.scrollLeft + inset(el)
    return cards(el).map((card) => card.getBoundingClientRect().left - base)
  }

  // Step from where the rail actually is, not from the counter. At the far end the counter says
  // "last card", and the first visible card starts a few px before the rail's end position: stepping
  // from the counter (or to "the nearest start on the left") would barely move or do nothing.
  const prev = () => {
    const el = rail.value
    if (!el) return
    const list = offsets(el)
    const max = el.scrollWidth - el.clientWidth
    let i = list.length - 1
    while (i > 0 && list[i] > el.scrollLeft + 4) i--
    // Already on a card's start (or at the very end): go to the card before it
    const settled = Math.abs(list[i] - el.scrollLeft) <= 4 || el.scrollLeft >= max - 4
    const target = list[Math.max(0, settled ? i - 1 : i)] ?? 0
    el.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
  const next = () => {
    const el = rail.value
    if (!el) return
    const after = offsets(el).filter((o) => o > el.scrollLeft + 4)
    const max = el.scrollWidth - el.clientWidth
    el.scrollTo({ left: after.length ? Math.min(Math.min(...after), max) : max, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const detach = () => {
    if (!current) return
    current.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    resizeObserver = mutationObserver = current = null
  }

  const attach = (el: HTMLElement) => {
    current = el
    el.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(el)
    // Cards can arrive later (content loaded from Sanity)
    mutationObserver = new MutationObserver(schedule)
    mutationObserver.observe(el, { childList: true })
    measure()
  }

  // The rail may render later than the component (behind a v-if), so follow the ref
  watch(
    rail,
    (el) => {
      detach()
      if (el) attach(el)
    },
    { immediate: true, flush: 'post' },
  )

  onBeforeUnmount(() => {
    detach()
    cancelAnimationFrame(frame)
  })

  return { index, count, canScroll, isAtStart, isAtEnd, scrollToIndex, prev, next }
}
