<script setup lang="ts">
import { ref, onMounted, computed, watchEffect, onUnmounted } from 'vue'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/client'
import { HERO_QUERY, type Hero } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import Button from '@/reusables/Button.vue'
import ClientCarousel from '@/components/ClientCarousel.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const hero = ref<Hero | null>(null)
const loading = ref(true)

const heroVideoUrl = computed(() => {
  if (hero.value?.backgroundVideo?.asset?.url) {
    return hero.value.backgroundVideo.asset.url
  }
  return null
})

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
  const videoUrl = heroVideoUrl.value
  const imageUrl = heroImageUrl.value
  
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
    hero.value = await client.fetch(HERO_QUERY)
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
      v-if="heroVideoUrl"
      :src="heroVideoUrl"
      autoplay
      loop
      muted
      playsinline
      fetchpriority="high"
      class="absolute inset-0 w-full h-full object-cover z-0"
    ></video>
    
    <!-- Background Image (fallback) -->
    <img
      v-else-if="heroImageUrl"
      :src="heroImageUrl"
      :alt="hero.title"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="1080"
      class="absolute inset-0 w-full h-full object-cover z-0"
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
        <p v-if="hero.description" class="text-lg md:text-xl leading-relaxed mb-8 text-[rgba(250,250,250,0.9)] hero-description">{{ hero.description }}</p>
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
            :href="button.link"
            :variant="button.variant"
            size="md"
            class="w-full md:w-auto"
          >
            {{ button.label }}
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Client Carousel at bottom -->
    <div class="hero-carousel relative z-[2] pb-8">
      <ClientCarousel />
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

  .hero-buttons {
    gap: 0.75rem;
  }

  /* the client strip is the biggest block down here - shrink it rather than
     let it push the hero past the screen */
  .hero-carousel {
    padding-bottom: 0.5rem;
  }

  .hero-carousel :deep(.client-carousel-section) {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  .hero-carousel :deep(.client-carousel-section) {
    --logo-scale: 0.62;
  }

  .hero-carousel :deep(.carousel-card) {
    height: 3rem;
  }

  .hero-carousel :deep(.carousel-strip) {
    padding: 0.5rem 0;
  }
}
</style>


