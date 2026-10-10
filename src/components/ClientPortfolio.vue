<template>
  <section v-if="shown.length" class="client-portfolio bg-fortu-off-white py-16 md:py-24" aria-labelledby="client-portfolio-title">
    <div class="mx-auto px-4 md:px-16">
      <div class="text-center mb-10 md:mb-14">
        <p class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-fortu-medium mb-3">Portofolio</p>
        <h2 id="client-portfolio-title" class="text-4xl md:text-5xl lg:text-6xl font-light text-fortu-dark tracking-tight">
          Kreativitas tanpa Batas
        </h2>
        <p class="mt-4 text-fortu-medium text-base md:text-lg max-w-2xl mx-auto">
          Sebagian klien dan proyek Fortu Digital. Pilih klien untuk membaca studi kasusnya.
        </p>
      </div>
    </div>

    <!-- Story cards: slide by themselves, and stop whenever the visitor reaches for them -->
    <div
      ref="regionRef"
      role="region"
      aria-roledescription="carousel"
      aria-label="Studi kasus klien"
      @focusin="onFocusIn"
      @focusout="focused = false"
      @touchstart.passive="onTouch"
    >
      <div
        ref="railRef"
        class="rail flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 md:scroll-px-16 px-4 md:px-16 pb-2"
        :aria-live="running ? 'off' : 'polite'"
      >
        <div
          v-for="(s, i) in shown"
          :key="s._id"
          role="group"
          aria-roledescription="slide"
          :aria-label="`${i + 1} dari ${shown.length}`"
          class="snap-start flex-shrink-0 w-[78vw] sm:w-[340px] lg:w-[400px] xl:w-[420px]"
        >
          <CaseStudyCard :study="s" />
        </div>
      </div>

      <div v-if="canScroll" class="mt-8 px-4 md:px-16">
        <SliderControls
          :index="current"
          :count="shown.length"
          :can-prev="!isAtStart"
          :can-next="!isAtEnd"
          prev-label="Studi kasus sebelumnya"
          next-label="Studi kasus berikutnya"
          @prev="prev"
          @next="next"
        />
      </div>
    </div>

    <div v-if="hasPublished" class="text-center mt-10 px-4">
      <RouterLink to="/studi-kasus" class="inline-flex items-center gap-2 text-fortu-dark text-lg font-medium group">
        Lihat semua studi kasus
        <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { client } from '@/sanity/client'
import { CASE_STUDIES_QUERY, type CaseStudyListItem } from '@/sanity/queries'
import { useScrollSlider } from '@/composables/useScrollSlider'
import CaseStudyCard from '@/components/CaseStudyCard.vue'
import SliderControls from '@/reusables/SliderControls.vue'

// At most this many cards are shown; which ones is chosen in Sanity ("Tampilkan di slider beranda")
const MAX_CARDS = 8
// Time on each card (the same pace as the customer-stories slider on sanalabs.com)
const AUTOPLAY_MS = 5000

const studies = ref<CaseStudyListItem[]>([])
const shown = computed(() => {
  const picked = studies.value.filter((s) => s.featured)
  return (picked.length ? picked : studies.value).slice(0, MAX_CARDS)
})
const hasPublished = computed(() => studies.value.some((s) => s.status === 'published'))

const regionRef = ref<HTMLElement | null>(null)
const railRef = ref<HTMLElement | null>(null)
const { index: current, canScroll, isAtStart, isAtEnd, prev, next, scrollToIndex } = useScrollSlider(railRef)

// --- Autoplay -------------------------------------------------------------------------------
// Starts by itself and keeps going (like the slider on sanalabs.com), except for visitors who asked for
// reduced motion. It only runs while the slider is on screen, and waits while a keyboard user is on it
// or a finger has just touched it.
const reduceMotion = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const autoplayAllowed = computed(() => !reduceMotion && canScroll.value)
const focused = ref(false)
const touching = ref(false)
const inView = ref(false)
const running = computed(
  () => autoplayAllowed.value && !focused.value && !touching.value && inView.value,
)

let timer: ReturnType<typeof setTimeout> | null = null
let touchTimer: ReturnType<typeof setTimeout> | null = null
let observer: IntersectionObserver | null = null

const stop = () => {
  if (timer) clearTimeout(timer)
  timer = null
}
const schedule = () => {
  stop()
  if (running.value) timer = setTimeout(tick, AUTOPLAY_MS)
}
const tick = () => {
  if (!document.hidden) {
    if (isAtEnd.value) scrollToIndex(0)
    else next()
  }
  schedule()
}

// Keyboard focus only: a mouse click on an arrow also focuses it, and must not stop the slider for good
const onFocusIn = (e: FocusEvent) => {
  focused.value = !!(e.target as HTMLElement | null)?.matches?.(':focus-visible')
}

// After a touch, wait a while before sliding again so a card being read is not pulled away
const onTouch = () => {
  touching.value = true
  if (touchTimer) clearTimeout(touchTimer)
  touchTimer = setTimeout(() => (touching.value = false), 6000)
}

watch(running, schedule)
// A new card (whoever moved the slider) restarts the countdown
watch(current, schedule)

onMounted(async () => {
  if ('IntersectionObserver' in window && regionRef.value) {
    observer = new IntersectionObserver(([entry]) => (inView.value = entry.isIntersecting), { threshold: 0.25 })
    observer.observe(regionRef.value)
  }
  try {
    studies.value = (await client.fetch(CASE_STUDIES_QUERY)) as CaseStudyListItem[]
  } catch (e) {
    console.error('Failed to fetch case studies:', e)
  }
})

onBeforeUnmount(() => {
  stop()
  if (touchTimer) clearTimeout(touchTimer)
  observer?.disconnect()
})
</script>

<style scoped>
/* The slider controls replace the scrollbar */
.rail {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.rail::-webkit-scrollbar {
  display: none;
}
</style>
