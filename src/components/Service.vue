<template>
  <section v-if="serviceSection && !loading" class="service-section py-16 md:py-24 bg-fortu-off-white" aria-labelledby="service-title">
    <div class="px-6 md:px-10 xl:px-16">
      <!-- Section Header -->
      <div class="text-center mb-12 md:mb-16">
        <h2 id="service-title" class="text-4xl md:text-4xl lg:text-6xl font-light text-fortu-dark mb-4 tracking-tight">
          {{ serviceSection.heading }}
        </h2>
        <p v-if="serviceSection.subheading" class="text-fortu-medium text-md md:text-lg max-w-2xl mx-auto">
          {{ serviceSection.subheading }}
        </p>
      </div>

      <!-- One row of numbered steps on desktop; swipeable on phones and tablets -->
      <ol
        ref="carouselRef"
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 lg:pb-0 lg:overflow-visible lg:grid lg:gap-5 list-none"
        :class="gridCols"
        @scroll="handleScroll"
      >
        <li
          v-for="(service, index) in steps"
          :key="service._key || index"
          class="service-card relative flex-shrink-0 w-[260px] md:w-[300px] lg:w-auto snap-start overflow-hidden rounded-2xl h-[460px] lg:h-[520px] text-fortu-off-white"
          :class="cardBackground(service)"
        >
          <!-- Photo background (legacy cards), with readable overlay -->
          <div
            v-if="!illustrationUrl(service) && getBackgroundImage(service)"
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${getBackgroundImage(service)})` }"
          ></div>
          <div
            v-if="!illustrationUrl(service) && getBackgroundImage(service) && service.darkOverlay !== false"
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"
          ></div>

          <!-- Brand illustration -->
          <img
            v-if="illustrationUrl(service)"
            :src="illustrationUrl(service) as string"
            alt=""
            width="400"
            height="400"
            loading="lazy"
            decoding="async"
            class="absolute left-1/2 top-10 -translate-x-1/2 w-[78%] max-w-[260px] opacity-95"
          />

          <!-- Step number -->
          <span class="absolute top-5 left-5 text-sm font-medium tracking-[0.2em] text-fortu-light">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <!-- Content -->
          <div class="relative h-full flex flex-col justify-end p-6 z-10">
            <h3 class="text-2xl md:text-[26px] font-medium tracking-tight mb-2">{{ service.title }}</h3>
            <p class="text-sm leading-relaxed text-fortu-light">{{ service.description }}</p>
          </div>
        </li>
      </ol>

      <!-- Scroll indicators (below desktop) -->
      <div class="flex justify-center gap-2 mt-4 lg:hidden">
        <button
          v-for="(_, index) in steps"
          :key="index"
          type="button"
          :aria-label="`Ke langkah ${index + 1} dari ${steps.length}`"
          :aria-current="currentSlide === index ? 'true' : 'false'"
          class="h-2 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-fortu-dark w-6' : 'bg-fortu-medium/40 w-2'"
          @click="scrollToSlide(index)"
        ></button>
      </div>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-[70vh]" :cards="3" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/client'
import { SERVICE_SECTION_QUERY, type ServiceSection, type ServiceItem } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const serviceSection = ref<ServiceSection | null>(null)
const loading = ref(true)
const currentSlide = ref(0)
const carouselRef = ref<HTMLElement | null>(null)

const steps = computed<ServiceItem[]>(() => serviceSection.value?.services || [])

// 5 steps fit one row; any other count adapts
const gridCols = computed(() => {
  const n = steps.value.length
  return n >= 6 ? 'lg:grid-cols-3' : n === 5 ? 'lg:grid-cols-5' : n === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
})

const ILLUSTRATIONS = ['konsultasi', 'delivery', 'instalasi', 'maintenance', 'aftersales']
const illustrationUrl = (service: ServiceItem) =>
  service.illustration && ILLUSTRATIONS.includes(service.illustration)
    ? `/services/${service.illustration}.svg`
    : null

const getBackgroundImage = (service: ServiceItem): string | null => {
  if (!service.backgroundImage?.asset) return null
  try {
    const builder = urlFor(service.backgroundImage.asset).width(600).height(800).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return null
  }
}

// Brand navy tones for illustrated cards (final colour codes pending from design)
const cardBackground = (service: ServiceItem) =>
  illustrationUrl(service) || !getBackgroundImage(service)
    ? 'bg-gradient-to-b from-[#1b2433] to-[#0e1218]'
    : 'bg-fortu-dark'

const handleScroll = () => {
  const el = carouselRef.value
  if (!el) return
  const first = el.firstElementChild as HTMLElement | null
  const step = first ? first.offsetWidth + 16 : 276
  currentSlide.value = Math.round(el.scrollLeft / step)
}

const scrollToSlide = (index: number) => {
  const el = carouselRef.value
  if (!el) return
  const first = el.firstElementChild as HTMLElement | null
  const step = first ? first.offsetWidth + 16 : 276
  el.scrollTo({ left: index * step, behavior: 'smooth' })
}

onMounted(async () => {
  try {
    serviceSection.value = await client.fetch(SERVICE_SECTION_QUERY)
  } catch (e) {
    console.error('Failed to fetch service section:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.service-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transition: box-shadow 0.4s ease, transform 0.4s ease;
}

@media (hover: hover) {
  .service-card:hover {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
    transform: translateY(-4px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-card,
  .service-card:hover {
    transition: none;
    transform: none;
  }
}
</style>
