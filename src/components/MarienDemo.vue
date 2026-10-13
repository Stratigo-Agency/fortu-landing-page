<template>
  <section class="relative pb-16 overflow-hidden bg-fortu-dark md:pb-28" aria-labelledby="marien-demo-title">
    <div class="px-6 mx-auto md:px-10 xl:px-16 max-w-6xl">
      <!-- Full-width video. From tablet up the text and button sit over a dark fade at the bottom; on phones they sit below the whole picture -->
      <div class="relative overflow-hidden rounded-[28px] border border-fortu-light/20">
        <video ref="video" v-bind="videoAttrs" class="block w-full aspect-video" />
        <div class="px-6 pt-6 pb-6 bg-fortu-dark md:absolute md:inset-x-0 md:bottom-0 md:px-12 md:pt-32 md:pb-10 md:flex md:items-end md:justify-between md:gap-10 md:bg-transparent md:bg-gradient-to-t md:from-fortu-dark md:via-fortu-dark/85 md:to-transparent">
          <div class="mb-6 md:mb-0 md:max-w-xl">
            <h2 id="marien-demo-title" class="mb-3 text-3xl font-light tracking-tight md:text-5xl text-fortu-off-white">Demo Marien CMS</h2>
            <p class="text-base leading-relaxed md:text-lg text-fortu-light/90">{{ copy }}</p>
          </div>
          <Button :href="DEMO_URL" target="_blank" rel="noopener noreferrer" variant="inverted" size="lg" class="w-full md:w-auto shrink-0">
            {{ cta }}
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M9 7h8v8" />
            </svg>
            <span class="sr-only">(buka di marien.co.id, tab baru)</span>
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Button from '@/reusables/Button.vue'

const DEMO_URL = 'https://marien.co.id/demo'
const copy = 'Lihat bagaimana layar dihubungkan, konten disusun, dan tayangan dijadwalkan dari satu platform.'
const cta = 'Lihat Demo Lengkap'

// Silent loop that plays only while on screen. With reduced motion or Data Saver it stays a still
// image with controls, so nothing downloads until the visitor presses play.
const video = ref<HTMLVideoElement | null>(null)
const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
const still = reduceMotion || saveData

const videoAttrs = {
  src: '/media/marien-demo-loop.mp4',
  poster: '/media/marien-demo-loop-poster.webp',
  'aria-label': 'Video demo Marien CMS: mengunggah konten dan menjadwalkan tayangan ke layar',
  muted: true,
  loop: true,
  playsinline: true,
  preload: 'none',
  controls: still,
}

let io: IntersectionObserver | null = null
onMounted(() => {
  const v = video.value
  if (!v || still) return
  io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    },
    { threshold: 0.3 },
  )
  io.observe(v)
})
onBeforeUnmount(() => io?.disconnect())
</script>
