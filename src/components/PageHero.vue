<template>
  <!-- Page Hero -->
  <section 
    v-if="pageHero && !loading" 
    class="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden"
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
      v-else-if="heroImageUrl"
      :src="heroImageUrl"
      :alt="pageHero.title"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="1080"
      class="absolute inset-0 w-full h-full object-cover"
    />
    
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-fortu-dark"
      :style="{ opacity: (pageHero.overlayOpacity ?? 60) / 100 }"
    ></div>
    
    <!-- Content -->
    <div 
      class="relative z-10 px-4 md:px-16 w-full"
      :class="{
        'text-left': pageHero.alignment === 'left',
        'text-center': pageHero.alignment === 'center' || !pageHero.alignment,
        'text-right': pageHero.alignment === 'right'
      }"
    >
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ pageHero.title }}
      </h1>
      <p v-if="pageHero.subtitle" class="text-lg md:text-xl text-fortu-light max-w-2xl hero-subtitle" :class="{ 'mx-auto': pageHero.alignment === 'center' }">
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

  <SectionSkeleton v-else-if="loading" min-height="h-[70vh] min-h-[400px]" :cards="0" />
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
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/client'
import { PAGE_HERO_QUERY, type PageHero } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const props = defineProps<{
  pageName: 'products' | 'about' | 'contact' | 'services' | 'privacy' | 'blog' | 'case-studies'
  fallbackTitle?: string
  fallbackSubtitle?: string
}>()

const pageHero = ref<PageHero | null>(null)
const loading = ref(true)

const heroVideoUrl = computed(() => {
  if (pageHero.value?.backgroundVideo?.asset?.url) {
    return pageHero.value.backgroundVideo.asset.url
  }
  return null
})

const heroImageUrl = computed(() => {
  if (pageHero.value?.backgroundImage?.asset) {
    try {
      const builder = urlFor(pageHero.value.backgroundImage.asset).width(1920).quality(IMAGE_CONFIG.quality)
      return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
    } catch {
      return null
    }
  }
  return null
})

// Add preload link for LCP optimization
let preloadLink: HTMLLinkElement | null = null

watchEffect(() => {
  const imageUrl = heroImageUrl.value
  const videoUrl = heroVideoUrl.value
  
  // Remove existing preload link if any
  if (preloadLink && preloadLink.parentNode) {
    preloadLink.parentNode.removeChild(preloadLink)
    preloadLink = null
  }
  
  // Preload video if available (takes priority)
  if (videoUrl) {
    preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'video'
    preloadLink.href = videoUrl
    preloadLink.setAttribute('fetchpriority', 'high')
    document.head.appendChild(preloadLink)
  } 
  // Otherwise preload image
  else if (imageUrl) {
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
    pageHero.value = await client.fetch(PAGE_HERO_QUERY, { pageName: props.pageName })
  } catch (e) {
    console.error('Failed to fetch page hero:', e)
  } finally {
    loading.value = false
  }
})
</script>


