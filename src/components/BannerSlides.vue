<template>
  <section
    v-if="productSlides.length > 0 && !loading"
    class="product-slides relative bg-fortu-off-white overflow-hidden"
    aria-roledescription="carousel"
    aria-label="Produk Fortu"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
    @touchstart.passive="pause"
  >
    <!-- Product tabs (shared by all slides) -->
    <div class="relative z-10 px-6 pt-24 pb-5 md:absolute md:top-0 md:left-0 md:w-1/2 md:px-10 lg:px-16 md:pt-36 md:pb-0" role="group" aria-label="Pilih produk">
      <div class="grid grid-cols-2 sm:inline-flex gap-1 p-1 rounded-3xl sm:rounded-full bg-fortu-dark">
        <button
          v-for="(prod, idx) in productSlides"
          :key="`tab-${prod._id}`"
          type="button"
          :aria-label="`Lihat ${prod.name}`"
          :aria-pressed="currentIndex === idx ? 'true' : 'false'"
          class="rounded-full px-3.5 py-2 text-sm font-medium sm:whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fortu-off-white"
          :class="currentIndex === idx
            ? 'bg-fortu-off-white text-fortu-dark'
            : 'text-fortu-off-white hover:bg-fortu-off-white/15'"
          @click="goToSlide(idx)"
        >
          {{ prod.name }}<span v-if="prod.comingSoon" class="ml-1.5 text-[10px] uppercase tracking-wider opacity-60">Segera</span>
        </button>
      </div>
    </div>

    <div class="slides-grid">
      <article
        v-for="(product, index) in productSlides"
        :key="product._id"
        class="slide md:grid md:grid-cols-2 md:min-h-[min(100svh,880px)]"
        :class="{ 'is-active': currentIndex === index }"
        :inert="currentIndex !== index"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} dari ${productSlides.length}: ${product.name}`"
      >
        <!-- Content -->
        <div class="px-6 pt-8 pb-8 md:px-10 lg:px-16 md:pt-60 md:pb-32 flex flex-col text-center md:text-left">
          <h2 class="text-4xl sm:text-5xl lg:text-6xl font-medium text-fortu-dark tracking-tight leading-[1.05] mb-5 md:mb-6 md:max-w-xl">
            {{ product.tagline || product.name }}
          </h2>

          <ul
            v-if="product.features && product.features.length > 0"
            class="flex flex-wrap justify-center md:justify-start gap-2 mb-7 md:mb-8 md:max-w-xl"
          >
            <li
              v-for="(feature, fIndex) in product.features"
              :key="feature._key || fIndex"
              class="rounded-full border border-fortu-dark/15 px-3.5 py-1.5 text-sm text-fortu-dark"
            >
              {{ feature.text }}
            </li>
          </ul>

          <div>
            <span
              v-if="product.comingSoon"
              class="inline-flex items-center rounded-full border border-fortu-dark/30 px-5 py-2.5 text-fortu-dark"
            >Segera hadir</span>
            <Button
              v-else-if="getProductLink(product)"
              :to="getProductLink(product)!"
              variant="primary"
              size="md"
              class="gap-2"
            >
              Pelajari Lebih Lanjut
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </Button>
          </div>
        </div>

        <!-- Image: first on phones, right-hand column from tablet up -->
        <div class="order-first md:order-none relative aspect-[4/5] max-h-[68svh] md:max-h-none md:aspect-auto md:h-full bg-fortu-dark/5">
          <img
            v-if="image(product, index)"
            :src="image(product, index)!.src"
            :srcset="image(product, index)!.srcset"
            sizes="(min-width: 768px) 50vw, 100vw"
            :alt="product.comingSoon ? `${product.name}, ilustrasi` : product.name"
            :fetchpriority="index === 0 ? 'high' : 'auto'"
            :loading="index === 0 ? 'eager' : 'lazy'"
            decoding="async"
            width="1080"
            height="1350"
            class="absolute inset-0 w-full h-full object-cover"
            :style="focalStyle(product.slideImage)"
          />
          <div
            v-else-if="product.comingSoon"
            class="absolute inset-0 flex items-center justify-center bg-fortu-dark p-8"
          >
            <img
              src="/products/videotron.svg"
              :alt="`${product.name}, segera hadir`"
              width="800"
              height="600"
              class="w-full max-w-[420px] h-auto"
            />
          </div>
        </div>
      </article>
    </div>

    <!-- Controls -->
    <div class="relative z-10 px-6 pb-10 md:absolute md:left-0 md:bottom-0 md:w-1/2 md:px-10 lg:px-16 md:pb-12 flex items-center justify-center md:justify-between gap-6">
      <div class="flex gap-2">
        <button
          type="button"
          class="control"
          aria-label="Produk sebelumnya"
          @click="prevSlide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button
          type="button"
          class="control"
          aria-label="Produk berikutnya"
          @click="nextSlide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-4 text-fortu-dark" aria-hidden="true">
        <span class="text-sm font-medium tabular-nums">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
        <div class="w-24 sm:w-32 h-0.5 bg-fortu-dark/15 rounded-full overflow-hidden">
          <div
            class="h-full bg-fortu-dark transition-all duration-300"
            :style="{ width: `${((currentIndex + 1) / productSlides.length) * 100}%` }"
          ></div>
        </div>
        <span class="text-sm text-fortu-medium tabular-nums">{{ String(productSlides.length).padStart(2, '0') }}</span>
      </div>
    </div>
  </section>
  <SectionSkeleton v-else-if="loading" min-height="min-h-screen" :cards="1" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { client } from '@/sanity/client'
import { PRODUCT_SLIDES_QUERY, type ProductSlide } from '@/sanity/queries'
import { focalStyle, responsiveImage } from '@/utils/focal'
import Button from '@/reusables/Button.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const productSlides = ref<ProductSlide[]>([])
const loading = ref(true)
const currentIndex = ref(0)
const autoPlayInterval = 6000

let timer: ReturnType<typeof setInterval> | null = null
let paused = false
const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const getProductLink = (product: ProductSlide): string | null =>
  product.product?.slug?.current ? `/products/${product.product.slug.current}` : null

const image = (product: ProductSlide, index: number) =>
  product.slideImage?.asset
    ? responsiveImage(product.slideImage, index === 0 ? [480, 768, 1080, 1440] : [480, 768, 1080])
    : null

const stop = () => {
  if (timer) clearInterval(timer)
  timer = null
}
const start = () => {
  stop()
  if (reduceMotion || paused || productSlides.value.length < 2) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % productSlides.value.length
  }, autoPlayInterval)
}
const pause = () => {
  paused = true
  stop()
}
const resume = () => {
  paused = false
  start()
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  start()
}
const nextSlide = () => goToSlide((currentIndex.value + 1) % productSlides.value.length)
const prevSlide = () =>
  goToSlide((currentIndex.value - 1 + productSlides.value.length) % productSlides.value.length)

// Preload the first slide image (likely LCP)
let preloadLink: HTMLLinkElement | null = null
watchEffect(() => {
  const first = productSlides.value[0]
  const img = first && image(first, 0)
  if (!img || preloadLink) return
  preloadLink = document.createElement('link')
  preloadLink.rel = 'preload'
  preloadLink.as = 'image'
  preloadLink.href = img.src
  preloadLink.setAttribute('imagesrcset', img.srcset)
  preloadLink.setAttribute('imagesizes', '(min-width: 768px) 50vw, 100vw')
  preloadLink.setAttribute('fetchpriority', 'high')
  document.head.appendChild(preloadLink)
})

onMounted(async () => {
  try {
    productSlides.value = await client.fetch(PRODUCT_SLIDES_QUERY)
    start()
  } catch (e) {
    console.error('Failed to fetch product slides:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  stop()
  preloadLink?.parentNode?.removeChild(preloadLink)
})
</script>

<style scoped>
/* All slides share one grid cell, so the section is as tall as the tallest slide. */
.slides-grid {
  display: grid;
}
.slide {
  grid-area: 1 / 1;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.6s ease, visibility 0s linear 0.6s;
}
@media (min-width: 768px) {
  .slide {
    display: grid;
  }
}
.slide.is-active {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.6s ease, visibility 0s;
}

.control {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid rgba(16, 17, 17, 0.2);
  color: #101111;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.control:hover {
  background-color: #101111;
  border-color: #101111;
  color: #f9f9f9;
}
.control:focus-visible {
  outline: 2px solid #101111;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .slide,
  .slide.is-active {
    transition: none;
  }
}
</style>
