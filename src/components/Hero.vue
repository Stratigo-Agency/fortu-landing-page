<script setup lang="ts">
import { focalStyle } from '@/utils/focal'
import { ref, onMounted, computed, watchEffect, onUnmounted } from 'vue'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/client'
import { HERO_QUERY, SITE_SETTINGS_QUERY, type Hero, type Office } from '@/sanity/queries'
import { getOffices, safeUrl } from '@/utils/offices'
import { IMAGE_CONFIG } from '@/config/image'
import Button from '@/reusables/Button.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const hero = ref<Hero | null>(null)
const offices = ref<Office[]>([])

// Office locations under the description: Medan, Jakarta, Bali (then any others), from Sanity
const LOCATION_ORDER = ['medan', 'jakarta', 'bali']
const locations = computed(() =>
  offices.value
    .filter((o) => o.city)
    .sort((a, b) => {
      const ia = LOCATION_ORDER.indexOf(a.city.toLowerCase())
      const ib = LOCATION_ORDER.indexOf(b.city.toLowerCase())
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    }),
)
const loading = ref(true)

const heroVideoUrl = computed(() => {
  if (hero.value?.backgroundVideo?.asset?.url) {
    return hero.value.backgroundVideo.asset.url
  }
  return null
})

const heroMobileVideoUrl = computed(() => hero.value?.backgroundVideoMobile?.asset?.url ?? null)

// Poster shown while the video loads (and instead of it when the visitor prefers less motion or data)
const heroPosterUrl = computed(() => {
  const poster = hero.value?.backgroundPoster ?? hero.value?.backgroundImage
  if (!poster?.asset) return null
  try {
    const b = urlFor(poster).width(1920).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? b.auto('format').url() : b.url()
  } catch {
    return null
  }
})

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const saveData =
  typeof navigator !== 'undefined' &&
  !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
const playVideo = computed(() => !!heroVideoUrl.value && !reduceMotion && !saveData)

const heroImageUrl = computed(() => {
  if (hero.value?.backgroundImage?.asset) {
    try {
      // Always use urlFor to apply crop/hotspot settings
      // Pass the full image object (not just asset) to preserve hotspot and crop
      const builder = urlFor(hero.value.backgroundImage).width(1920).quality(IMAGE_CONFIG.quality)
      return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
    } catch {
      return null
    }
  }
  return null
})

const heroAlignment = computed(() => {
  return hero.value?.alignment || 'left'
})

// Add preload link for LCP optimization
let preloadLink: HTMLLinkElement | null = null

watchEffect(() => {
  // Preload the still (poster or image): it is the LCP element and is small.
  // The video itself is never preloaded, so it cannot compete with the page for bandwidth.
  const imageUrl = heroPosterUrl.value || heroImageUrl.value

  if (preloadLink && preloadLink.parentNode) {
    preloadLink.parentNode.removeChild(preloadLink)
    preloadLink = null
  }

  if (imageUrl) {
    preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.href = imageUrl
    preloadLink.setAttribute('fetchpriority', 'high')
    document.head.appendChild(preloadLink)
  }
})

onUnmounted(() => {
  if (preloadLink && preloadLink.parentNode) {
    preloadLink.parentNode.removeChild(preloadLink)
  }
})

onMounted(async () => {
  try {
    const [heroData, settings] = await Promise.all([
      client.fetch(HERO_QUERY),
      client.fetch(SITE_SETTINGS_QUERY).catch(() => null),
    ])
    hero.value = heroData
    offices.value = [...getOffices(settings)]
  } catch (e) {
    console.error('Failed to fetch hero content:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section 
    v-if="hero && !loading" 
    class="hero-section relative min-h-dvh flex flex-col bg-[var(--card)] overflow-hidden pt-24 md:pt-0"
  >
    <!-- Background Video -->
    <video
      v-if="playVideo"
      :poster="heroPosterUrl || undefined"
      autoplay
      loop
      muted
      playsinline
      preload="auto"
      aria-hidden="true"
      class="absolute inset-0 w-full h-full object-cover z-0"
      :style="focalStyle(hero?.backgroundPoster ?? hero?.backgroundImage)"
    >
      <source v-if="heroMobileVideoUrl" :src="heroMobileVideoUrl" media="(max-width: 767px)" type="video/mp4" />
      <source :src="heroVideoUrl!" type="video/mp4" />
    </video>

    <!-- Still image: no video set, or the visitor prefers less motion / data -->
    <img
      v-else-if="heroPosterUrl || heroImageUrl"
      :src="heroPosterUrl || heroImageUrl!"
      :alt="hero.backgroundPoster?.alt || hero.backgroundImage?.alt || hero.title"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="1080"
      class="absolute inset-0 w-full h-full object-cover z-0"
        :style="focalStyle(hero?.backgroundImage)"
      />
    
    <div class="absolute inset-0 bg-black/50 z-[1]"></div>
    
    <!-- Hero Content -->
    <div 
      class="relative z-[2] flex-1 flex items-center px-4 md:px-16 py-4"
      :class="{
        'text-left': heroAlignment === 'left',
        'text-center': heroAlignment === 'center',
        'text-right': heroAlignment === 'right'
      }"
    >
      <div class="w-full">
        <h1 class="text-5xl md:text-8xl font-medium mb-4 tracking-tight leading-tight hero-title">{{ hero.title }}</h1>
        <h2 v-if="hero.subtitle" class="text-xl md:text-3xl font-medium mb-4 text-fortu-light leading-snug hero-subtitle">{{ hero.subtitle }}</h2>
        <p v-if="hero.description" class="text-lg md:text-xl leading-relaxed mb-6 max-w-3xl text-[rgba(250,250,250,0.9)] hero-description"
           :class="{ 'mx-auto': heroAlignment === 'center', 'ml-auto': heroAlignment === 'right' }">{{ hero.description }}</p>

        <!-- Office locations: link to Google Maps when a link exists, plain text otherwise -->
        <ul
          v-if="locations.length"
          class="hero-locations flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm md:text-base text-fortu-off-white/85"
          :class="{
            'justify-center': heroAlignment === 'center',
            'justify-end': heroAlignment === 'right'
          }"
          aria-label="Lokasi kantor Fortu Digital"
        >
          <li v-for="(office, i) in locations" :key="office._key || i" class="flex items-center gap-1.5">
            <svg class="w-4 h-4 flex-shrink-0 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <a
              v-if="safeUrl(office.mapsUrl)"
              :href="safeUrl(office.mapsUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
            >{{ office.city }}<span class="sr-only"> (buka di Google Maps)</span></a>
            <span v-else>{{ office.city }}</span>
          </li>
        </ul>
        <div 
          v-if="hero.ctaButtons && hero.ctaButtons.length > 0" 
          class="flex gap-4 flex-wrap flex-col md:flex-row hero-buttons"
          :class="{
            'md:justify-center': heroAlignment === 'center',
            'md:justify-end': heroAlignment === 'right',
            'md:justify-start': heroAlignment === 'left'
          }"
        >
          <Button
            v-for="(button, index) in hero.ctaButtons"
            :key="index"
            :to="button.link?.startsWith('/') ? button.link : undefined"
            :href="button.link?.startsWith('/') ? undefined : button.link"
            :variant="button.variant"
            size="md"
            class="w-full md:w-auto"
          >
            {{ button.label }}
          </Button>
        </div>
      </div>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-dvh" :cards="0" class="pt-24" />
</template>

<style scoped>
.hero-title {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.hero-subtitle {
  animation: fadeInUp 0.8s ease-out 0.15s forwards;
  opacity: 0;
}

.hero-description {
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.hero-buttons {
  animation: fadeInUp 0.8s ease-out 0.45s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Short landscape screens (signage panels, phones on their side): scale the
   copy to the viewport so the hero fills exactly one screen instead of
   spilling past it and sliding under the fixed navbar. */
@media (orientation: landscape) and (max-height: 720px) {
  .hero-section {
    padding-top: 4.5rem;
  }

  .hero-title {
    font-size: clamp(1.75rem, 8vh, 4rem);
    line-height: 1.05;
    margin-bottom: 0.5rem;
  }

  .hero-subtitle {
    font-size: clamp(0.95rem, 3.4vh, 1.5rem);
    margin-bottom: 0.5rem;
  }

  .hero-description {
    font-size: clamp(0.85rem, 2.8vh, 1.125rem);
    line-height: 1.45;
    margin-bottom: 1rem;
  }

  .hero-locations {
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
  }

  .hero-buttons {
    gap: 0.75rem;
  }
}
</style>


