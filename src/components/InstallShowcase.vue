<template>
  <section class="install-showcase bg-white py-16 md:py-24" aria-labelledby="install-showcase-title">
    <div class="mx-auto px-4 md:px-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <!-- Intro cell -->
        <div class="lg:pr-6 lg:sticky lg:top-28 self-start">
          <p v-if="data.eyebrow" class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-fortu-medium mb-3">
            {{ data.eyebrow }}
          </p>
          <h2 id="install-showcase-title" class="text-3xl md:text-5xl font-medium text-fortu-dark tracking-tight">
            {{ data.heading }}
          </h2>
          <p v-if="data.description" class="mt-4 text-fortu-medium text-base md:text-lg leading-relaxed">
            {{ data.description }}
          </p>
        </div>

        <!-- Steps: swipeable row on phones, grid from md -->
        <ol
          class="lg:col-span-2 flex md:grid md:grid-cols-2 gap-5 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 list-none"
        >
          <li
            v-for="(step, i) in steps"
            :key="step._key"
            class="snap-start flex-shrink-0 w-[78%] sm:w-[46%] md:w-auto"
          >
            <figure>
              <div class="relative overflow-hidden rounded-2xl bg-fortu-off-white aspect-[4/5]">
                <img
                  v-if="stepImage(step)"
                  :src="stepImage(step) as string"
                  :alt="step.image?.alt || step.title"
                  width="800"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  class="w-full h-full object-cover"
                  :style="focalStyle(step.image)"
                />
                <span
                  class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-fortu-dark text-fortu-off-white text-xs font-medium tracking-wider"
                >
                  {{ pad(i + 1) }}
                </span>
              </div>
              <figcaption class="mt-4">
                <p class="text-lg font-medium text-fortu-dark tracking-tight">{{ step.title }}</p>
                <p v-if="step.caption" class="mt-1 text-sm text-fortu-medium leading-relaxed">{{ step.caption }}</p>
              </figcaption>
            </figure>
          </li>
        </ol>
      </div>

      <!-- Demo video -->
      <figure v-if="data.demoVideo?.videoUrl" class="mt-12 md:mt-16">
        <div class="relative overflow-hidden rounded-2xl bg-fortu-dark aspect-video">
          <video
            ref="videoEl"
            :src="data.demoVideo.videoUrl"
            :poster="posterUrl || undefined"
            :aria-label="data.demoVideo.poster?.alt || data.demoVideo.title || 'Video demo perangkat Fortu'"
            class="w-full h-full object-cover"
            muted
            loop
            playsinline
            preload="none"
            :controls="reduceMotion"
          ></video>
          <button
            v-if="!reduceMotion"
            type="button"
            class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-fortu-dark text-fortu-off-white flex items-center justify-center hover:bg-fortu-medium transition-colors"
            :aria-label="playing ? 'Jeda video' : 'Putar video'"
            @click="togglePlay"
          >
            <svg v-if="playing" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        <figcaption class="mt-4 md:flex md:items-baseline md:gap-4">
          <p class="text-lg font-medium text-fortu-dark tracking-tight">
            {{ pad(steps.length + 1) }} · {{ data.demoVideo.title || 'Demo' }}
          </p>
          <p v-if="data.demoVideo.caption" class="mt-1 md:mt-0 text-sm text-fortu-medium">{{ data.demoVideo.caption }}</p>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import { focalStyle } from '@/utils/focal'
import type { InstallShowcase, InstallStep } from '@/sanity/queries'

const props = defineProps<{ data: InstallShowcase }>()

const steps = computed<InstallStep[]>(() => (props.data.steps || []).filter((s) => s.image?.asset))
const pad = (n: number) => String(n).padStart(2, '0')

const stepImage = (step: InstallStep) => {
  try {
    const b = urlFor(step.image).width(800).height(1000).fit('crop').quality(IMAGE_CONFIG.quality + 15)
    return IMAGE_CONFIG.autoFormat ? b.auto('format').url() : b.url()
  } catch {
    return null
  }
}

const posterUrl = computed(() => {
  const p = props.data.demoVideo?.poster
  if (!p?.asset) return null
  try {
    return urlFor(p).width(1280).height(720).fit('crop').quality(80).auto('format').url()
  } catch {
    return null
  }
})

// Autoplay only while visible and only if the visitor has not asked for reduced motion
const videoEl = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const reduceMotion = ref(false)
let observer: IntersectionObserver | null = null

const togglePlay = () => {
  const v = videoEl.value
  if (!v) return
  if (v.paused) v.play().catch(() => {})
  else v.pause()
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const v = videoEl.value
  if (!v) return
  v.addEventListener('play', () => (playing.value = true))
  v.addEventListener('pause', () => (playing.value = false))
  if (reduceMotion.value || !('IntersectionObserver' in window)) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        v.preload = 'auto'
        v.play().catch(() => {})
      } else {
        v.pause()
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(v)
})

onBeforeUnmount(() => observer?.disconnect())
</script>
