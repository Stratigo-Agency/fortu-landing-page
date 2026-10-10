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

      <!-- One row of numbered steps on desktop; below that a swipeable rail with arrows and a counter.
           scroll-px matches the rail padding, so a snapped card keeps its margin on phones. -->
      <ol
        ref="carouselRef"
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 md:scroll-px-10 scrollbar-hide pb-2 -mx-6 px-6 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 lg:pb-0 lg:scroll-px-0 lg:overflow-visible lg:grid lg:gap-5 list-none"
        :class="gridCols"
      >
        <li
          v-for="(service, index) in steps"
          :key="service._key || index"
          class="service-card relative flex flex-col flex-shrink-0 w-[260px] md:w-[300px] lg:w-auto snap-start overflow-hidden rounded-2xl min-h-[440px] lg:min-h-[460px] bg-fortu-dark text-fortu-off-white"
        >
          <!-- Photo background (legacy cards), with readable overlay -->
          <img
            v-if="!illustrationUrl(service) && getBackgroundImage(service)"
            :src="getBackgroundImage(service) as string"
            alt=""
            width="600"
            height="800"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover"
            :style="focalStyle(service.backgroundImage)"
          />
          <div
            v-if="!illustrationUrl(service) && getBackgroundImage(service) && service.darkOverlay !== false"
            class="absolute inset-0 bg-gradient-to-t from-fortu-dark/90 via-fortu-dark/50 to-fortu-dark/20"
          ></div>

          <!-- Step number -->
          <span class="absolute top-5 left-5 text-sm font-medium tracking-[0.2em] text-fortu-light z-10">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <!-- Brand illustration: a zone of the same height on every card, so each title
               (and each description) starts on the same line across the row -->
          <div v-if="illustrationUrl(service)" class="relative flex-shrink-0 h-[200px] lg:h-[190px] mt-9">
            <img
              :src="illustrationUrl(service) as string"
              alt=""
              width="400"
              height="400"
              loading="lazy"
              decoding="async"
              class="absolute left-1/2 top-0 -translate-x-1/2 h-full w-auto max-w-none opacity-95"
            />
          </div>

          <!-- Content (photo cards keep their text at the bottom) -->
          <div class="relative z-10 flex flex-col px-6 pb-6" :class="illustrationUrl(service) ? 'pt-2' : 'mt-auto pt-6'">
            <h3 class="text-2xl md:text-[26px] font-medium tracking-tight leading-tight min-h-[2.5em]">{{ service.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-fortu-light">{{ service.description }}</p>
          </div>
        </li>
      </ol>

      <!-- Same slider controls as every other slider (below desktop) -->
      <SliderControls
        v-if="steps.length > 1"
        class="lg:hidden mt-6 md:mt-8"
        :index="currentSlide"
        :count="steps.length"
        :can-prev="!isAtStart"
        :can-next="!isAtEnd"
        prev-label="Langkah sebelumnya"
        next-label="Langkah berikutnya"
        @prev="prev"
        @next="next"
      />
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
import { focalStyle } from '@/utils/focal'
import { useScrollSlider } from '@/composables/useScrollSlider'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'
import SliderControls from '@/reusables/SliderControls.vue'

const serviceSection = ref<ServiceSection | null>(null)
const loading = ref(true)
const carouselRef = ref<HTMLElement | null>(null)
const { index: currentSlide, isAtStart, isAtEnd, prev, next } = useScrollSlider(carouselRef)

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
    const builder = urlFor(service.backgroundImage).width(600).height(800).fit('crop').quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return null
  }
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
</style>
