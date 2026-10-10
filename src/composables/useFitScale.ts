import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

/**
 * Scale factor that fits a diagram drawn at a fixed design width into the width of its
 * container (never above `max`). Lets absolutely-positioned diagrams keep their exact
 * geometry (elbows, branch lengths) at every screen size.
 *
 * A container that is currently hidden (display: none) measures 0 and is ignored; the
 * observer fires again as soon as it becomes visible.
 */
export function useFitScale(container: Ref<HTMLElement | null>, designWidth: number, max = 1) {
  const scale = ref(1)
  let observer: ResizeObserver | null = null

  const update = () => {
    const width = container.value?.clientWidth
    if (width) scale.value = Math.min(max, width / designWidth)
  }

  onMounted(() => {
    update()
    if (container.value) {
      observer = new ResizeObserver(update)
      observer.observe(container.value)
    }
  })
  onBeforeUnmount(() => observer?.disconnect())

  return scale
}
