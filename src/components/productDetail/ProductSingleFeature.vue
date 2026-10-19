<template>
  <section 
    class="py-16 flex flex-col justify-center px-4 md:px-16 overflow-hidden"
    :class="isDark ? 'bg-fortu-dark' : 'bg-fortu-off-white'"
  >
    <!-- Text Content -->
    <div 
      class="max-w-4xl mb-12"
      :class="{
        'mx-auto text-center': feature.textAlignment === 'center' || !feature.textAlignment,
        'text-left': feature.textAlignment === 'left',
        'ml-auto text-right': feature.textAlignment === 'right'
      }"
    >
      <!-- Eyebrow -->
      <p 
        v-if="feature.eyebrow" 
        class="text-2xl md:text-4xl font-medium mb-2 tracking-tight"
        :class="isDark ? 'text-fortu-off-white' : 'text-fortu-dark'"
      >
        {{ feature.eyebrow }}
      </p>
      
      <!-- Heading -->
      <h2 
        class="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
        :class="isDark ? 'text-fortu-off-white' : 'text-fortu-dark'"
      >
        {{ feature.heading }}
      </h2>
      
      <!-- Description -->
      <p 
        v-if="feature.description" 
        class="text-base md:text-lg leading-relaxed max-w-2xl"
        :class="[
          isDark ? 'text-fortu-light' : 'text-fortu-medium',
          { 
            'mx-auto': feature.textAlignment === 'center' || !feature.textAlignment,
            'ml-auto': feature.textAlignment === 'right'
          }
        ]"
      >
        {{ feature.description }}
      </p>

      <!-- Highlight Items -->
      <div 
        v-if="feature.highlights && feature.highlights.length > 0"
        class="flex flex-wrap gap-4 md:gap-6 mt-8"
        :class="{
          'justify-center': feature.textAlignment === 'center' || !feature.textAlignment,
          'justify-start': feature.textAlignment === 'left',
          'justify-end': feature.textAlignment === 'right'
        }"
      >
        <div 
          v-for="highlight in feature.highlights"
          :key="highlight._key"
          class="flex items-center gap-2"
        >
          <!-- Icon -->
          <CompareIcon 
            v-if="highlight.icon"
            :icon="highlight.icon"
            size="l"
            class="flex-shrink-0"
            :class="isDark ? 'text-white' : 'text-fortu-medium'"
          />
          <!-- Text -->
          <span 
            class="text-sm md:text-xl font-medium"
            :class="isDark ? 'text-fortu-off-white' : 'text-fortu-dark'"
          >
            {{ highlight.text }}
          </span>
        </div>
      </div>
    </div>

    <!-- Media Content

         The media is deliberately NOT a flex item. A replaced element with
         `height: auto` sitting directly in a flex container is sized
         differently by each engine - WebKit stretches or collapses it, and
         `min-width: auto` keeps its intrinsic 1920px width, so the image
         either vanishes or overflows the section's `overflow-hidden`. A
         block element with an explicit max-width and auto margins sizes the
         same everywhere. -->
    <div 
      class="w-full"
      :class="{
        'max-w-5xl mx-auto': feature.textAlignment === 'center' || !feature.textAlignment
      }"
    >
      <!-- Video -->
      <video
        v-if="feature.mediaType === 'video' && videoUrl"
        :src="videoUrl"
        autoplay
        loop
        muted
        playsinline
        class="block w-full max-w-full h-auto max-h-[70vh] object-contain rounded-2xl"
        :class="mediaAlignment"
      ></video>
      
      <!-- Image -->
      <img
        v-else-if="imageUrl"
        :src="imageUrl"
        :alt="feature.heading"
        loading="lazy"
        decoding="async"
        width="1920"
        height="1080"
        class="block max-w-full h-auto max-h-[70vh] object-contain rounded-2xl"
        :class="mediaAlignment"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { buildImageUrl } from '@/utils/image'
import { computed } from 'vue'
import type { ProductFeature } from '@/sanity/queries'
import CompareIcon from '@/components/CompareIcon.vue'

const props = defineProps<{
  feature: ProductFeature
}>()

// Horizontal placement of the media, done with auto margins so the element
// stays a plain block (see the template comment).
const mediaAlignment = computed(() => {
  if (props.feature.textAlignment === 'left') return 'mr-auto'
  if (props.feature.textAlignment === 'right') return 'ml-auto'
  return 'mx-auto'
})

const isDark = computed(() => {
  return props.feature.backgroundColor === 'dark' || !props.feature.backgroundColor
})

const videoUrl = computed(() => {
  if (props.feature.video?.asset?.url) {
    return props.feature.video.asset.url
  }
  return null
})

const imageUrl = computed(() => {
  if (props.feature.image?.asset) {
    try {
      // Always use urlFor to apply crop/hotspot settings
      // Pass the full image object (not just asset) to preserve hotspot and crop
        return buildImageUrl(props.feature.image, { width: 1920 })
    } catch {
      return null
    }
  }
  return null
})
</script>

