<template>
  <section v-if="useCaseSection && !loading" class="use-case-section bg-fortu-off-white overflow-hidden">
    <div v-if="showHeader" class="px-4 md:px-16 my-16">
      <!-- Section header -->
      <div class="text-center mb-16 max-w-2xl mx-auto">
        <h2 v-if="showTitle" class="text-4xl md:text-5xl lg:text-6xl font-light text-fortu-dark mb-6 tracking-tight leading-tight">
          {{ useCaseSection.heading }}
        </h2>
        <p v-if="showDescription" class="text-fortu-medium text-lg leading-relaxed">
          {{ useCaseSection.description }}
        </p>
      </div>
    </div>

    <!-- Masonry Gallery - Static with staggered columns -->
    <div class="gallery-container px-2 pb-12 md:px-16">
      <div class="gallery-grid">
        <div 
          class="gallery-column" 
          v-for="(column, colIndex) in columns" 
          :key="`col-${colIndex}`"
          :style="{ paddingTop: getColumnOffset(colIndex) }"
        >
          <div 
            v-for="(item, index) in column" 
            :key="item._key || index"
            class="gallery-item mb-4"
          >
            <div 
              class="relative rounded-md overflow-hidden bg-fortu-light/20"
              :class="getItemSizeClass(item)"
            >
              <!-- Video -->
              <video
                v-if="item.mediaType === 'video' && getMediaUrl(item)"
                :src="getMediaUrl(item)"
                autoplay
                loop
                muted
                playsinline
                class="w-full h-full object-cover"
              ></video>
              
              <!-- Image -->
              <img
                v-else-if="getMediaUrl(item)"
                :src="getMediaUrl(item)"
                :alt="item.alt || item.caption || 'Contoh penerapan digital signage Fortu Digital'"
                loading="lazy"
                decoding="async"
                width="600"
                :height="item.size === 'tall' ? 800 : item.size === 'short' ? 400 : 600"
                class="w-full h-full object-cover"
        :style="focalStyle(item.image)"
      />
              
              <!-- Caption overlay -->
              <div v-if="item.caption" class="absolute inset-0 bg-gradient-to-t from-fortu-dark/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p class="text-fortu-off-white text-sm">{{ item.caption }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-[70vh]" :cards="3" />
</template>

<script setup lang="ts">
import { focalStyle } from '@/utils/focal'
import { ref, onMounted, computed } from 'vue'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/client'
import { USE_CASE_SECTION_QUERY, type UseCaseSection, type UseCaseItem } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const props = withDefaults(defineProps<{
  showTitle?: boolean
  showDescription?: boolean
}>(), {
  showTitle: true,
  showDescription: true
})

const showHeader = computed(() => props.showTitle || props.showDescription)

const useCaseSection = ref<UseCaseSection | null>(null)
const loading = ref(true)

// Vertical offsets for staggered effect (in pixels)
const columnOffsets = [0, 40, 80, 20, 60, 100, 30]

// Distribute items into columns for masonry layout
const columns = computed(() => {
  if (!useCaseSection.value?.items) return []
  
  const items = useCaseSection.value.items
  const numColumns = 7 // Number of columns in the gallery
  const cols: UseCaseItem[][] = Array.from({ length: numColumns }, () => [])
  
  items.forEach((item: UseCaseItem, index: number) => {
    cols[index % numColumns].push(item)
  })
  
  return cols
})

const getColumnOffset = (colIndex: number): string => {
  return `${columnOffsets[colIndex % columnOffsets.length]}px`
}

const getMediaUrl = (item: UseCaseItem): string | undefined => {
  if (item.mediaType === 'video') {
    return item.video?.asset?.url
  } else if (item.image?.asset) {
    try {
      // Always use urlFor to apply crop/hotspot settings
      // Pass the full image object (not just asset) to preserve hotspot and crop
      const builder = urlFor(item.image).width(600).quality(IMAGE_CONFIG.quality)
      return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
    } catch {
      return undefined
    }
  }
  return undefined
}

const getItemSizeClass = (item: UseCaseItem): string => {
  switch (item.size) {
    case 'tall':
      return 'h-80 md:h-96'
    case 'short':
      return 'h-48 md:h-56'
    default:
      return 'h-64 md:h-72'
  }
}

onMounted(async () => {
  try {
    useCaseSection.value = await client.fetch(USE_CASE_SECTION_QUERY)
  } catch (e) {
    console.error('Failed to fetch Use Case Section content:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.gallery-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
}

.gallery-grid {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: flex-start;
  min-width: max-content;
}

.gallery-column {
  display: flex;
  flex-direction: column;
  width: 220px;
  flex-shrink: 0;
}

@media (max-width: 1400px) {
  .gallery-column {
    width: 180px;
  }
}

@media (max-width: 1024px) {
  .gallery-column {
    width: 160px;
  }
}

@media (max-width: 768px) {
  .gallery-grid {
    justify-content: flex-start;
  }
  
  .gallery-column {
    width: 140px;
  }
}
</style>
