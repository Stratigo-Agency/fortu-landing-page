<template>
  <!-- Page Hero -->
  <section 
    v-if="pageHero && !loading" 
    class="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-fortu-dark"
  >
    <!-- Background Video -->
    <video
      v-if="heroVideoUrl"
      :src="heroVideoUrl"
      autoplay
      loop
      muted
      playsinline
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover"
    ></video>
    
    <!-- Background Image (fallback) -->
    <img
      v-else-if="heroImage"
      :src="heroImage.src"
      :srcset="heroImage.srcset"
      sizes="100vw"
      :alt="pageHero.backgroundImage?.alt || pageHero.title"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="1080"
      class="absolute inset-0 w-full h-full object-cover"
      :style="focalStyle(pageHero.backgroundImage)"
    />
    
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-fortu-dark"
      :style="{ opacity: (pageHero.overlayOpacity ?? 60) / 100 }"
    ></div>
    
    <!-- Content: always centred on phones (symmetry), aligned as set in Sanity from tablet up -->
    <div 
      class="relative z-10 px-4 md:px-16 w-full"
      :class="{
        'text-center md:text-left': align === 'left',
        'text-center': align === 'center' || !align,
        'text-center md:text-right': align === 'right'
      }"
    >
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ pageHero.title }}
      </h1>
      <p v-if="pageHero.subtitle" class="text-lg md:text-xl text-fortu-light max-w-2xl mx-auto hero-subtitle" :class="{ 'md:mx-0': align === 'left', 'md:ml-auto md:mr-0': align === 'right' }">
        {{ pageHero.subtitle }}
      </p>
    </div>
  </section>

  <!-- Fallback Hero (if no Sanity data) -->
  <section 
    v-else-if="!loading" 
    class="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-fortu-dark"
  >
    <div class="relative z-10 text-center px-4">
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ fallbackTitle }}
      </h1>
      <p v-if="fallbackSubtitle" class="text-lg md:text-xl text-fortu-light hero-subtitle">
        {{ fallbackSubtitle }}
      </p>
    </div>
  </section>

  <!-- Same size and colour as the hero, so the photo lands on a dark block instead of a blank flash -->
  <section v-else-if="loading" class="h-[70vh] min-h-[400px] bg-fortu-dark" aria-busy="true">
    <span class="sr-only">Memuat konten…</span>
  </section>
</template>

<style scoped>
.hero-title {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.hero-subtitle {
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
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
</style>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onUnmounted } from 'vue'
import { fetchSanity } from '@/sanity/fetch'
import { PAGE_HERO_QUERY, type PageHero } from '@/sanity/queries'
import { focalStyle, responsiveImage } from '@/utils/image'

const props = defineProps<{
  pageName: 'products' | 'about' | 'contact' | 'services' | 'privacy' | 'blog' | 'case-studies'
  fallbackTitle?: string
  fallbackSubtitle?: string
  /** Overrides the alignment set in Sanity (e.g. the Blog title sits above a centred grid) */
  alignment?: 'left' | 'center' | 'right'
}>()

const align = computed(() => props.alignment ?? pageHero.value?.alignment)

const pageHero = ref<PageHero | null>(null)
const loading = ref(true)

const heroVideoUrl = computed(() => {
  if (pageHero.value?.backgroundVideo?.asset?.url) {
    return pageHero.value.backgroundVideo.asset.url
  }
  return null
})

const heroImage = computed(() =>
  pageHero.value?.backgroundImage?.asset
    ? responsiveImage(pageHero.value.backgroundImage, [640, 1024, 1536, 2048])
    : null,
)
// Still images are preloaded by the router (utils/heroPrefetch); only a video is preloaded here
let preloadLink: HTMLLinkElement | null = null

watchEffect(() => {
  const videoUrl = heroVideoUrl.value

  if (preloadLink && preloadLink.parentNode) {
    preloadLink.parentNode.removeChild(preloadLink)
    preloadLink = null
  }

  if (videoUrl) {
    preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'video'
    preloadLink.href = videoUrl
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
    pageHero.value = await fetchSanity(PAGE_HERO_QUERY, { pageName: props.pageName })
  } catch (e) {
    console.error('Failed to fetch page hero:', e)
  } finally {
    loading.value = false
  }
})
</script>


