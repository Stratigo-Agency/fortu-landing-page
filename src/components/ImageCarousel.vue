<template>
  <section v-if="images && images.length > 0" class="overflow-hidden">
    <div class="px-4 md:px-16">
      <!-- Section Header -->
      <h2 
        class="text-3xl md:text-4xl font-medium mb-12 tracking-tight"
        :class="mode === 'light' ? 'text-fortu-dark' : 'text-fortu-off-white'"
      >
        {{ heading || '' }}
      </h2>
    </div>

    <!-- Carousel Container -->
    <div class="relative">
      <!-- Images Wrapper -->
      <div 
        ref="carouselRef"
        class="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory px-4 md:px-16 pb-4 scrollbar-hide"
        @scroll="handleScroll"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="flex-shrink-0 w-[220px] md:w-[300px] lg:w-[380px] font-medium snap-center"
          :class="clickable ? 'cursor-pointer' : ''"
          @click="clickable && $emit('image-click', index)"
        >
          <div class="aspect-[3/3.2] rounded-2xl overflow-hidden bg-black">
            <SkeletonImage
              :src="image.url"
              :alt="image.alt || `${props.heading || 'Produk Fortu Digital'} - gambar ${index + 1}`"
              :width="480"
              :height="512"
              tone="dark"
              img-class="w-full h-full object-cover hover:opacity-80"
            />
          </div>
          <p 
            v-if="image.caption" 
            class="mt-3 text-3xl text-left"
            :class="mode === 'light' ? 'text-fortu-dark' : 'text-fortu-off-white'"
          >
            {{ image.caption }}
          </p>
          <!-- Learn More Button -->
          <div v-if="showButton && image.slug" class="mt-4">
            <Button 
              :variant="mode === 'light' ? 'primary' : 'outline'" 
              size="sm" 
              :to="`/products/${image.slug}`"
            >
              Lihat Detail Produk
            </Button>
          </div>
        </div>
      </div>

      <!-- Mobile Indicators -->
      <div class="flex md:hidden justify-center gap-2 mt-4 px-4 pb-16">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="scrollToImage(index)"
          :aria-label="`Go to image ${index + 1} of ${images.length}`"
          :aria-current="currentIndex === index ? 'true' : 'false'"
          class="w-2 h-2 rounded-full transition-all"
          :class="currentIndex === index 
            ? (mode === 'light' ? 'bg-fortu-off-white w-6' : 'bg-fortu-dark w-6')
            : (mode === 'light' ? 'bg-fortu-off-white/50' : 'bg-fortu-light/50')"
        ></button>
      </div>
    </div>

    <!-- Navigation Arrows (Centered Below) - Show only when content exceeds width -->
    <div 
      v-if="canScroll" 
      class="flex items-center justify-center gap-3 mt-6 pb-4"
    >
      <button
        @click="scrollCarousel('left')"
        :disabled="isAtStart"
        aria-label="Scroll carousel left"
        class="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
        :class="[
          mode === 'light' 
            ? 'border-fortu-dark/30 hover:bg-fortu-dark/10 text-fortu-dark' 
            : 'border-fortu-light/30 hover:bg-fortu-light/10 text-fortu-off-white',
          isAtStart ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
        ]"
      >
        <svg 
          class="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <button
        @click="scrollCarousel('right')"
        :disabled="isAtEnd"
        aria-label="Scroll carousel right"
        class="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
        :class="[
          mode === 'light' 
            ? 'border-fortu-dark/30 hover:bg-fortu-dark/10 text-fortu-dark' 
            : 'border-fortu-light/30 hover:bg-fortu-light/10 text-fortu-off-white',
          isAtEnd ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
        ]"
      >
        <svg 
          class="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <!-- Variant Selector -->
    <div v-if="variants && variants.length > 0 && variantType === 'color'" class="mt-8 text-center">
      <p 
        class="text-sm mb-3"
        :class="mode === 'light' ? 'text-fortu-off-white' : 'text-fortu-dark'"
      >
        {{ selectedVariantName }}
      </p>
      <div class="flex justify-center gap-3">
        <button
          v-for="variant in variants"
          :key="variant._key"
          @click="$emit('select-variant', variant)"
          :aria-label="`Select ${variant.name} variant`"
          :aria-pressed="selectedVariantKey === variant._key ? 'true' : 'false'"
          class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
          :class="selectedVariantKey === variant._key 
            ? (mode === 'light' ? 'border-fortu-off-white' : 'border-fortu-dark')
            : (mode === 'light' ? 'border-fortu-off-white/50' : 'border-fortu-medium/50')"
          :style="{ backgroundColor: variant.colorHex || '#666' }"
          :title="variant.name"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from '@/reusables/Button.vue'
import SkeletonImage from '@/reusables/SkeletonImage.vue'

interface CarouselImage {
  url: string
  alt?: string
  caption?: string
  slug?: string
}

interface ProductVariant {
  _key: string
  name: string
  colorHex?: string
}

const props = withDefaults(defineProps<{
  images: CarouselImage[]
  heading?: string
  variants?: ProductVariant[]
  variantType?: string
  selectedVariantKey?: string
  selectedVariantName?: string
  clickable?: boolean
  showButton?: boolean
  mode?: 'light' | 'dark'
}>(), {
  mode: 'dark'
})

defineEmits<{
  (e: 'select-variant', variant: ProductVariant): void
  (e: 'image-click', index: number): void
}>()

const carouselRef = ref<HTMLElement | null>(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)
const currentIndex = ref(0)
const canScroll = ref(false)

// Get item width based on breakpoint
const getItemWidth = () => {
  const width = window.innerWidth
  if (width >= 1024) {
    // lg: w-[380px] + gap-6 (24px)
    return 380 + 24
  } else if (width >= 768) {
    // md: w-[300px] + gap-6 (24px)
    return 300 + 24
  } else {
    // mobile: w-[220px] + gap-4 (16px)
    return 220 + 16
  }
}

const scrollCarousel = (direction: 'left' | 'right') => {
  if (!carouselRef.value) return
  
  const itemWidth = getItemWidth()
  const scrollAmount = itemWidth
  
  const newScrollLeft = direction === 'left' 
    ? carouselRef.value.scrollLeft - scrollAmount 
    : carouselRef.value.scrollLeft + scrollAmount
  
  carouselRef.value.scrollTo({
    left: newScrollLeft,
    behavior: 'smooth'
  })
}

const scrollToImage = (index: number) => {
  if (!carouselRef.value) return
  
  const itemWidth = getItemWidth()
  
  carouselRef.value.scrollTo({
    left: index * itemWidth,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  if (!carouselRef.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  isAtStart.value = scrollLeft <= 10
  isAtEnd.value = scrollLeft + clientWidth >= scrollWidth - 10
  
  // Check if content exceeds width (with small threshold to account for rounding)
  canScroll.value = scrollWidth > clientWidth + 5
  
  // Calculate current index based on actual item width
  const itemWidth = getItemWidth()
  currentIndex.value = Math.round(scrollLeft / itemWidth)
  
  // Clamp index to valid range
  if (currentIndex.value < 0) currentIndex.value = 0
  if (currentIndex.value >= props.images.length) currentIndex.value = props.images.length - 1
}

onMounted(() => {
  handleScroll()
  window.addEventListener('resize', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleScroll)
})
</script>

<style scoped>
/* Hide scrollbar but keep functionality - similar to Service.vue */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth snap scrolling */
.scrollbar-hide {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>

