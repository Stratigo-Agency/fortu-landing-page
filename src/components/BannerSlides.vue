<template>
  <section v-if="productSlides && productSlides.length > 0 && !loading" class="product-slides-section relative min-h-screen bg-fortu-off-white overflow-hidden">
    <!-- Slides -->
    <div class="relative h-full min-h-screen">
      <TransitionGroup name="slide">
        <div
          v-for="(product, index) in productSlides"
          :key="product._id"
          v-show="currentIndex === index"
          class="absolute inset-0"
        >
          <!-- Mobile Layout: Stacked content + image -->
          <div class="flex flex-col min-h-screen md:hidden pb-20 text-center">
            <!-- Mobile Content Section -->
            <div class="bg-fortu-off-white px-6 pt-20 pb-6 flex-shrink-0">
              <!-- Mobile Product Tabs -->
              <div class="flex mb-4">
                <div class="flex rounded-md mx-auto overflow-hidden bg-fortu-dark border-8 border-fortu-dark">
                  <button
                    v-for="(prod, idx) in productSlides"
                    :key="`mobile-tab-${prod._id}`"
                    @click="goToSlide(idx)"
                    :aria-label="`View ${prod.name} product slide`"
                    :aria-pressed="currentIndex === idx ? 'true' : 'false'"
                    class="px-2 py-2.5 text-xs font-medium transition-all duration-300"
                    :class="currentIndex === idx 
                      ? 'bg-fortu-off-white text-fortu-dark' 
                      : 'bg-fortu-dark text-fortu-off-white hover:bg-fortu-off-white/20'"
                  >
                    {{ prod.name }}<span v-if="prod.comingSoon" class="ml-1 text-[9px] uppercase tracking-wider opacity-60">Segera</span>
                  </button>
                </div>
              </div>

              <!-- Tagline -->
              <h2 class="text-3xl font-medium text-fortu-dark mb-3 tracking-tight">
                {{ product.tagline || product.name }}
              </h2>
              
              <!-- Feature Tags -->
              <div v-if="product.features && product.features.length > 0" class="flex flex-wrap gap-2 mb-4 flex justify-center">
                <div v-for="(feature, fIndex) in product.features" :key="feature._key || fIndex">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-fortu-dark text-xs">
                    <FeatureIcon v-if="feature.icon" :icon="feature.icon" class="w-3.5 h-3.5" />
                    <span v-else>+</span>
                    {{ feature.text }}
                  </span>
                </div>
              </div>

              <!-- Mobile CTA Button -->
              <span
                v-if="product.comingSoon"
                class="inline-flex items-center px-4 py-2 rounded-full border border-fortu-dark/30 text-fortu-dark text-sm"
              >Segera hadir</span>
              <Button
                v-else-if="getProductLink(product)"
                :to="getProductLink(product)!"
                variant="primary"
                size="sm"
                class="gap-2"
              >
                Pelajari Lebih Lanjut
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </Button>
            </div>

            <!-- Mobile Image Section -->
            <div class="flex-1 relative flex flex-col justify-between">
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                :alt="product.name"
                :fetchpriority="currentIndex === 0 ? 'high' : 'auto'"
                :loading="currentIndex === 0 ? 'eager' : 'lazy'"
                decoding="async"
                width="1920"
                height="1080"
                class="w-full h-full object-cover px-4"
              />
              <div
                v-else-if="product.comingSoon"
                class="w-full h-full min-h-[260px] flex items-center justify-center bg-gradient-to-b from-[#1b2433] to-[#0e1218] p-6"
              >
                <img
                  src="/products/videotron.svg"
                  :alt="`${product.name}, segera hadir`"
                  width="800"
                  height="600"
                  class="w-full max-w-[420px] h-auto"
                />
              </div>
              <!-- Mobile Navigation Arrows -->
              <div class="absolute bottom-8 left-6 flex gap-2">
                <button
                  @click="prevSlide"
                  class="w-10 h-10 text-fortu-dark rounded-full bg-fortu-off-white/90 backdrop-blur-sm flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  @click="nextSlide"
                  class="w-10 h-10 text-fortu-dark rounded-full bg-fortu-off-white/90 backdrop-blur-sm flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop Layout: Two Columns -->
          <div class="hidden md:grid md:grid-cols-2 h-full min-h-screen">
            <!-- Left Column: Content -->
            <div class="flex flex-col justify-between p-16 pt-32">
              <!-- Top Section -->
              <div class="max-w-xl">
                <!-- Product Tabs -->
                <div class="flex mb-8">
                  <div class="flex rounded-md overflow-hidden bg-fortu-dark border-8 border-fortu-dark">
                    <button
                      v-for="(prod, idx) in productSlides"
                      :key="`desktop-tab-${prod._id}`"
                      @click="goToSlide(idx)"
                      :aria-label="`View ${prod.name} product slide`"
                      :aria-pressed="currentIndex === idx ? 'true' : 'false'"
                      class="px-6 py-2.5 text-sm font-medium transition-all duration-300"
                      :class="currentIndex === idx 
                        ? 'bg-fortu-off-white text-fortu-dark' 
                        : 'bg-fortu-dark text-fortu-off-white hover:bg-fortu-off-white/20'"
                    >
                      {{ prod.name }}<span v-if="prod.comingSoon" class="ml-1.5 text-[10px] uppercase tracking-wider opacity-60">Segera</span>
                    </button>
                  </div>
                </div>

                <!-- Tagline -->
                <h2 class="text-5xl lg:text-6xl font-medium text-fortu-dark mb-6 tracking-tight">
                  {{ product.tagline || product.name }}
                </h2>
                
                <!-- Feature Tags -->
                <div v-if="product.features && product.features.length > 0" class="flex flex-wrap gap-2 mb-8">
                  <span 
                    v-for="(feature, fIndex) in product.features" 
                    :key="`desktop-${feature._key || fIndex}`"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium bg-white rounded-full text-fortu-dark text-sm"
                  >
                    <FeatureIcon v-if="feature.icon" :icon="feature.icon" class="w-4 h-4" />
                    <span v-else>+</span>
                    {{ feature.text }}
                  </span>
                </div>

                <!-- Desktop CTA Button -->
                <span
                  v-if="product.comingSoon"
                  class="inline-flex items-center px-5 py-2.5 rounded-full border border-fortu-dark/30 text-fortu-dark"
                >Segera hadir</span>
                <Button
                  v-else-if="getProductLink(product)"
                  :to="getProductLink(product)!"
                  variant="primary"
                  size="md"
                  class="gap-2"
                >
                  Pelajari Lebih Lanjut
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </Button>
              </div>

              <!-- Bottom Section - Navigation & Indicators -->
              <div class="flex items-end justify-between">
                <!-- Arrow Navigation -->
                <div class="flex gap-2">
                  <button
                    @click="prevSlide"
                    class="w-12 h-12 text-fortu-dark rounded-full border border-fortu-light/30 flex items-center justify-center hover:bg-fortu-dark hover:text-fortu-off-white hover:border-fortu-dark transition-all duration-300"
                    aria-label="Previous slide"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <button
                    @click="nextSlide"
                    class="w-12 h-12 text-fortu-dark rounded-full border border-fortu-light/30 flex items-center justify-center hover:bg-fortu-dark hover:text-fortu-off-white hover:border-fortu-dark transition-all duration-300"
                    aria-label="Next slide"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                <!-- Progress Bar / Slide Counter -->
                <div class="flex items-center gap-4 text-fortu-dark">
                  <span class="text-sm font-medium">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
                  <div class="w-32 h-0.5 bg-fortu-light/30 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-fortu-dark transition-all duration-300"
                      :style="{ width: `${((currentIndex + 1) / productSlides.length) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-fortu-medium">{{ String(productSlides.length).padStart(2, '0') }}</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Image -->
            <div class="relative h-full min-h-screen">
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                :alt="product.name"
                :fetchpriority="currentIndex === 0 ? 'high' : 'auto'"
                :loading="currentIndex === 0 ? 'eager' : 'lazy'"
                decoding="async"
                width="1920"
                height="1080"
                class="w-full h-full object-cover"
              />
              <div
                v-else-if="product.comingSoon"
                class="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1b2433] to-[#0e1218] p-10"
              >
                <img
                  src="/products/videotron.svg"
                  :alt="`${product.name}, segera hadir`"
                  width="800"
                  height="600"
                  class="w-full max-w-[640px] h-auto"
                />
              </div>
              <div v-else class="w-full h-full bg-fortu-light/20"></div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Auto-progress indicator -->
    <div class="absolute bottom-0 left-0 right-0 h-1 bg-fortu-light/20 z-10">
      <div 
        :key="`progress-${currentIndex}`"
        class="h-full bg-fortu-dark/40 transition-all"
        :class="isAutoPlaying ? 'progress-bar' : ''"
        :style="{ animationDuration: `${autoPlayInterval}ms` }"
      ></div>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-screen" :cards="1" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/client'
import { PRODUCT_SLIDES_QUERY, type ProductSlide } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import FeatureIcon from '@/components/FeatureIcon.vue'
import Button from '@/reusables/Button.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const getProductLink = (product: ProductSlide): string | null => {
  // First priority: linked product's slug
  if (product.product?.slug?.current) {
    return `/products/${product.product.slug.current}`
  }
  return null
}

const productSlides = ref<ProductSlide[]>([])
const loading = ref(true)
const currentIndex = ref(0)
const isAutoPlaying = ref(true)
const autoPlayInterval = 6000 // 6 seconds

let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const getProductImage = (product: ProductSlide): string | undefined => {
  if (!product.slideImage?.asset) return undefined
  try {
    const builder = urlFor(product.slideImage.asset).width(1920).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return undefined
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % productSlides.value.length
  resetAutoPlay()
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + productSlides.value.length) % productSlides.value.length
  resetAutoPlay()
}

const goToSlide = (index: number) => {
  currentIndex.value = index
  resetAutoPlay()
}

const startAutoPlay = () => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  autoPlayTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % productSlides.value.length
  }, autoPlayInterval)
  isAutoPlaying.value = true
}

const resetAutoPlay = () => {
  isAutoPlaying.value = false
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  // Restart after a brief pause
  setTimeout(() => {
    startAutoPlay()
  }, 100)
}

// Add preload link for first slide image (potential LCP)
let preloadLink: HTMLLinkElement | null = null

watchEffect(() => {
  // Preload the first slide image for LCP optimization
  if (productSlides.value.length > 0 && currentIndex.value === 0) {
    const firstImageUrl = getProductImage(productSlides.value[0])
    if (firstImageUrl) {
      // Remove existing preload link if any
      if (preloadLink && preloadLink.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink)
      }
      
      // Create new preload link for first image
      preloadLink = document.createElement('link')
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      preloadLink.href = firstImageUrl
      preloadLink.setAttribute('fetchpriority', 'high')
      document.head.appendChild(preloadLink)
    }
  }
})

onMounted(async () => {
  try {
    productSlides.value = await client.fetch(PRODUCT_SLIDES_QUERY)
    if (productSlides.value.length > 0) {
      startAutoPlay()
    }
  } catch (e) {
    console.error('Failed to fetch product slides:', e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  if (preloadLink && preloadLink.parentNode) {
    preloadLink.parentNode.removeChild(preloadLink)
  }
})
</script>

<style scoped>
/* Fade transitions */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.8s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

/* Auto-progress bar animation */
.progress-bar {
  animation: progress linear forwards;
  width: 0;
}

@keyframes progress {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}
</style>

