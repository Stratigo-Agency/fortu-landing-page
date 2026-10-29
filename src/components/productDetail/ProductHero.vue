<template>
  <!-- Product Hero with Background -->
  <section 
    v-if="hasBackground" 
    class="relative h-screen md:h-[80vh] min-h-[500px] flex items-end overflow-hidden"
  >
    <!-- Background Video -->
    <video
      v-if="videoUrl"
      :src="videoUrl"
      autoplay
      loop
      muted
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    ></video>
    
    <!-- Background Image -->
    <img
      v-else-if="imageUrl"
      :src="imageUrl"
      :srcset="imageSrcset"
      sizes="100vw"
      :alt="productName"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="1080"
      class="absolute inset-0 w-full h-full object-cover"
      :style="focalStyle(heroImage)"
    />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-fortu-dark/60"></div>
    
    <!-- Content -->
    <div class="relative z-10 w-full px-4 md:px-16 pb-12 md:pb-16 text-center md:text-left">
      <!-- Breadcrumb -->
      <nav class="text-sm text-fortu-light/80 mb-4 text-center md:text-left">
        <router-link to="/products" class="hover:text-fortu-off-white transition-colors">Produk</router-link>
        <span class="mx-2">/</span>
        <span class="text-fortu-off-white">{{ productName }}</span>
      </nav>

      <h1 class="text-3xl md:text-5xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ productName }}
      </h1>
      
      <p v-if="description" class="text-md md:text-xl text-fortu-light max-w-3xl mx-auto md:mx-0 hero-subtitle">
        {{ description }}
      </p>

      <!-- Price -->
      <div v-if="price" class="flex items-center justify-center md:justify-start gap-3 mt-6">
        <span class="text-2xl md:text-3xl font-medium text-fortu-off-white">
          {{ formattedPrice }}
        </span>
        <span v-if="compareAtPrice" class="text-lg text-fortu-light/70 line-through">
          {{ formattedCompareAtPrice }}
        </span>
        <span 
          v-if="compareAtPrice" 
          class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full"
        >
          Sale
        </span>
      </div>

    
      <!-- Product Variants: compact pills, stock shown only when sold out -->
      <div v-if="hasVariants && variants && variants.length > 0" class="mt-8">
        <h2 class="text-lg md:text-xl font-medium text-fortu-off-white mb-4">
          Pilih Varian
        </h2>

        <div class="flex flex-wrap justify-center md:justify-start gap-2">
          <button
            v-for="variant in variants"
            :key="variant._key"
            @click="handleVariantSelect(variant)"
            :aria-pressed="selectedVariantKey === variant._key"
            class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-4 text-base font-medium text-fortu-off-white transition-colors"
            :class="[
              selectedVariantKey === variant._key
                ? 'border-fortu-off-white bg-white/25'
                : 'border-white/30 bg-white/10 hover:bg-white/20',
              variant.inStock === false ? 'opacity-60' : '',
            ]"
          >
            <span
              v-if="variantType === 'color' && variant.colorHex"
              class="w-4 h-4 rounded-full border border-white/50"
              :style="{ backgroundColor: variant.colorHex }"
            ></span>
            {{ variant.name }}
            <span v-if="variant.price" class="text-sm font-normal text-fortu-light">{{ formatVariantPrice(variant.price) }}</span>
            <span v-if="variant.inStock === false" class="text-xs font-normal text-fortu-light">Habis</span>
          </button>
        </div>
      </div>

      <!-- Buy Button -->
      <div class="mt-8 flex justify-center md:justify-start" data-track-source="product_hero">
        <Button
          variant="secondary"
          size="lg"
          class="gap-2"
          @click="askAboutProduct"
        >
          Hubungi Kami tentang produk ini
        </Button>
      </div>
    </div>
  </section>

  <!-- Fallback: No background media -->
  <section 
    v-else 
    class="relative h-[40vh] min-h-[300px] flex items-end bg-fortu-dark overflow-hidden"
  >
    <!-- Subtle pattern background -->
    <div class="absolute inset-0 opacity-5">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="product-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#product-grid)"/>
      </svg>
    </div>

    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-t from-fortu-dark via-fortu-dark/80 to-fortu-dark/60"></div>
    
    <!-- Content -->
    <div class="relative z-10 w-full px-4 md:px-16 pb-12 md:pb-16 text-center md:text-left">
      <!-- Breadcrumb -->
      <nav class="text-sm text-fortu-light/80 mb-4 text-center md:text-left">
        <router-link to="/products" class="hover:text-fortu-off-white transition-colors">Produk</router-link>
        <span class="mx-2">/</span>
        <span class="text-fortu-off-white">{{ productName }}</span>
      </nav>

      <h1 class="text-4xl md:text-5xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ productName }}
      </h1>
      
      <p v-if="description" class="text-lg md:text-xl text-fortu-light max-w-3xl mx-auto md:mx-0 hero-subtitle">
        {{ description }}
      </p>

      <!-- Price -->
      <div v-if="price" class="flex items-center justify-center md:justify-start gap-3 mt-6">
        <span class="text-2xl md:text-3xl font-medium text-fortu-off-white">
          {{ formattedPrice }}
        </span>
        <span v-if="compareAtPrice" class="text-lg text-fortu-light/70 line-through">
          {{ formattedCompareAtPrice }}
        </span>
        <span 
          v-if="compareAtPrice" 
          class="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full"
        >
          Sale
        </span>
      </div>

      <!-- Product Variants: compact pills, stock shown only when sold out -->
      <div v-if="hasVariants && variants && variants.length > 0" class="mt-8">
        <h2 class="text-lg md:text-xl font-medium text-fortu-off-white mb-4">
          Pilih Varian
        </h2>

        <div class="flex flex-wrap justify-center md:justify-start gap-2">
          <button
            v-for="variant in variants"
            :key="variant._key"
            @click="handleVariantSelect(variant)"
            :aria-pressed="selectedVariantKey === variant._key"
            class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-4 text-base font-medium text-fortu-off-white transition-colors"
            :class="[
              selectedVariantKey === variant._key
                ? 'border-fortu-off-white bg-white/25'
                : 'border-white/30 bg-white/10 hover:bg-white/20',
              variant.inStock === false ? 'opacity-60' : '',
            ]"
          >
            <span
              v-if="variantType === 'color' && variant.colorHex"
              class="w-4 h-4 rounded-full border border-white/50"
              :style="{ backgroundColor: variant.colorHex }"
            ></span>
            {{ variant.name }}
            <span v-if="variant.price" class="text-sm font-normal text-fortu-light">{{ formatVariantPrice(variant.price) }}</span>
            <span v-if="variant.inStock === false" class="text-xs font-normal text-fortu-light">Habis</span>
          </button>
        </div>
      </div>

      <!-- Buy Button -->
      <div class="mt-8 flex justify-center md:justify-start" data-track-source="product_hero">
        <Button
          variant="secondary"
          size="lg"
          class="gap-2"
          @click="askAboutProduct"
        >
          Hubungi Kami tentang produk ini
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { buildImageUrl, focalStyle, responsiveImage } from '@/utils/image'
import { computed } from 'vue'
import { useContactChooser } from '@/composables/useContactChooser'
import Button from '@/reusables/Button.vue'

interface HeroAsset {
  asset?: {
    _ref?: string
    _type?: string
    url?: string
  }
  hotspot?: {
    x?: number
    y?: number
    height?: number
    width?: number
  }
  crop?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

interface ProductVariant {
  _key: string
  name: string
  price?: number
  compareAtPrice?: number
  colorHex?: string
  inStock?: boolean
}

const props = defineProps<{
  productName: string
  productSlug?: string
  description?: string
  heroImage?: HeroAsset
  heroVideo?: HeroAsset
  price?: number
  compareAtPrice?: number
  currency?: string
  hasVariants?: boolean
  variants?: ProductVariant[]
  variantType?: string
  selectedVariantKey?: string
}>()

const emit = defineEmits<{
  (e: 'select-variant', variant: ProductVariant): void
}>()

const videoUrl = computed(() => {
  if (props.heroVideo?.asset?.url) {
    return props.heroVideo.asset.url
  }
  return null
})

const imageUrl = computed(() => {
  if (props.heroImage?.asset) {
    try {
      // Always use urlFor to apply crop/hotspot settings
      // Pass the full image object (not just asset) to preserve hotspot and crop
      return buildImageUrl(props.heroImage, { width: 1920 })
    } catch {
      return null
    }
  }
  return null
})

// The hero is the largest image on the page (LCP): phones get a smaller file
const imageSrcset = computed(() =>
  props.heroImage?.asset ? responsiveImage(props.heroImage, [768, 1280, 1920, 2560])?.srcset : undefined,
)

const hasBackground = computed(() => {
  return videoUrl.value || imageUrl.value
})

const formatPrice = (price: number): string => {
  const symbol = props.currency === 'EUR' ? '€' : props.currency === 'IDR' ? 'Rp' : '$'
  return `${symbol}${price.toLocaleString()}`
}

const formattedPrice = computed(() => {
  return props.price ? formatPrice(props.price) : ''
})

const formattedCompareAtPrice = computed(() => {
  return props.compareAtPrice ? formatPrice(props.compareAtPrice) : ''
})

const formatVariantPrice = (price: number): string => {
  return formatPrice(price)
}

const handleVariantSelect = (variant: ProductVariant) => {
  emit('select-variant', variant)
}

const { openChooser } = useContactChooser()

// Product name travels to the destination as utm_campaign (a pre-filled message is not possible via Linktree)
const askAboutProduct = () =>
  openChooser('product_hero', {
    campaign: props.productSlug || undefined,
    productName: props.productName,
  })
</script>

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

