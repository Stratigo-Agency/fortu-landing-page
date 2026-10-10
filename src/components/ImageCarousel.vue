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
        class="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 md:scroll-px-16 px-4 md:px-16 pb-4 scrollbar-hide"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="flex-shrink-0 w-[220px] md:w-[300px] lg:w-[380px] font-medium snap-start"
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

    </div>

    <!-- Same slider controls as every other slider; only when the images do not all fit -->
    <div v-if="canScroll" class="px-4 md:px-16 mt-4 md:mt-6 pb-8 md:pb-4">
      <SliderControls
        :index="currentIndex"
        :count="images.length"
        :mode="mode"
        :can-prev="!isAtStart"
        :can-next="!isAtEnd"
        prev-label="Gambar sebelumnya"
        next-label="Gambar berikutnya"
        @prev="prev"
        @next="next"
      />
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
import { ref } from 'vue'
import Button from '@/reusables/Button.vue'
import SkeletonImage from '@/reusables/SkeletonImage.vue'
import SliderControls from '@/reusables/SliderControls.vue'
import { useScrollSlider } from '@/composables/useScrollSlider'

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
const { index: currentIndex, canScroll, isAtStart, isAtEnd, prev, next } = useScrollSlider(carouselRef)
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

