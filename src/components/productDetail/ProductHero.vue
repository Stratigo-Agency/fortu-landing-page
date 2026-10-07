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
      :alt="productName"
      fetchpriority="high"
      decoding="async"
      width="1920"
      height="1080"
      class="absolute inset-0 w-full h-full object-cover"
    />
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-fortu-dark/60"></div>
    
    <!-- Content -->
    <div class="relative z-10 w-full px-4 md:px-16 pb-12 md:pb-16">
      <!-- Breadcrumb -->
      <nav class="text-sm text-fortu-light/80 mb-4">
        <router-link to="/products" class="hover:text-fortu-off-white transition-colors">Products</router-link>
        <span class="mx-2">/</span>
        <span class="text-fortu-off-white">{{ productName }}</span>
      </nav>

      <h1 class="text-3xl md:text-5xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ productName }}
      </h1>
      
      <p v-if="description" class="text-md md:text-xl text-fortu-light max-w-3xl hero-subtitle">
        {{ description }}
      </p>

      <!-- Price -->
      <div v-if="price" class="flex items-center gap-3 mt-6">
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

    
      <!-- Product Variants -->
      <div v-if="hasVariants && variants && variants.length > 0" class="mt-8">
        <h2 class="text-lg md:text-xl font-medium text-fortu-off-white mb-4">
          Pilih Varian
        </h2>
        
        <div class="flex flex-wrap gap-3">
          <button
            v-for="variant in variants"
            :key="variant._key"
            @click="handleVariantSelect(variant)"
            class="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all hover:bg-white/20"
            :class="selectedVariantKey === variant._key 
              ? 'border-fortu-off-white bg-white/20' 
              : 'border-white/30 hover:border-white/50'"
          >
            <!-- Variant Name -->
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm md:text-base font-medium text-fortu-off-white">
                {{ variant.name }}
              </span>
              <div 
                v-if="selectedVariantKey === variant._key"
                class="w-4 h-4 rounded-full bg-fortu-off-white flex items-center justify-center"
              >
                <svg class="w-2.5 h-2.5 text-fortu-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Variant Color (if color variant) -->
            <div v-if="variantType === 'color' && variant.colorHex" class="mb-2">
              <div 
                class="w-6 h-6 rounded-full border-2 mx-auto"
                :class="selectedVariantKey === variant._key 
                  ? 'border-fortu-off-white' 
                  : 'border-white/50'"
                :style="{ backgroundColor: variant.colorHex }"
              ></div>
            </div>

            <!-- Variant Price -->
            <div class="flex items-center justify-center gap-2">
              <span v-if="variant.price" class="text-sm md:text-base font-medium text-fortu-off-white">
                {{ formatVariantPrice(variant.price) }}
              </span>
              <span 
                v-if="variant.compareAtPrice && variant.compareAtPrice > (variant.price || 0)" 
                class="text-xs text-fortu-light/70 line-through"
              >
                {{ formatVariantPrice(variant.compareAtPrice) }}
              </span>
            </div>

            <!-- Stock Status -->
            <div v-if="variant.inStock !== undefined" class="mt-2">
              <span 
                class="text-xs py-0.5 rounded-full block text-left"
              >
                {{ variant.inStock ? 'Tersedia' : 'Habis' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Buy Button -->
      <div v-if="whatsappLink" class="mt-8" data-track-source="product_hero">
        <Button
          :href="whatsappLink"
          variant="green"
          size="lg"
          target="_blank"
          class="gap-2"
        >
          Beli via WhatsApp
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
    <div class="relative z-10 w-full px-4 md:px-16 pb-12 md:pb-16">
      <!-- Breadcrumb -->
      <nav class="text-sm text-fortu-light/80 mb-4">
        <router-link to="/products" class="hover:text-fortu-off-white transition-colors">Products</router-link>
        <span class="mx-2">/</span>
        <span class="text-fortu-off-white">{{ productName }}</span>
      </nav>

      <h1 class="text-4xl md:text-5xl lg:text-7xl font-medium text-fortu-off-white mb-4 tracking-tight hero-title">
        {{ productName }}
      </h1>
      
      <p v-if="description" class="text-lg md:text-xl text-fortu-light max-w-3xl hero-subtitle">
        {{ description }}
      </p>

      <!-- Price -->
      <div v-if="price" class="flex items-center gap-3 mt-6">
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

      <!-- Product Variants -->
      <div v-if="hasVariants && variants && variants.length > 0" class="mt-8">
        <h2 class="text-lg md:text-xl font-medium text-fortu-off-white mb-4">
          Pilih Varian
        </h2>
        
        <div class="flex flex-wrap gap-3">
          <button
            v-for="variant in variants"
            :key="variant._key"
            @click="handleVariantSelect(variant)"
            class="px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg border-2 transition-all hover:bg-white/20"
            :class="selectedVariantKey === variant._key 
              ? 'border-fortu-off-white bg-white/20' 
              : 'border-white/30 hover:border-white/50'"
          >
            <!-- Variant Name -->
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm md:text-base font-medium text-fortu-off-white">
                {{ variant.name }}
              </span>
              <div 
                v-if="selectedVariantKey === variant._key"
                class="w-4 h-4 rounded-full bg-fortu-off-white flex items-center justify-center"
              >
                <svg class="w-2.5 h-2.5 text-fortu-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>

            <!-- Variant Color (if color variant) -->
            <div v-if="variantType === 'color' && variant.colorHex" class="mb-2">
              <div 
                class="w-6 h-6 rounded-full border-2 mx-auto"
                :class="selectedVariantKey === variant._key 
                  ? 'border-fortu-off-white' 
                  : 'border-white/50'"
                :style="{ backgroundColor: variant.colorHex }"
              ></div>
            </div>

            <!-- Variant Price -->
            <div class="flex items-center justify-center gap-2">
              <span v-if="variant.price" class="text-sm md:text-base font-medium text-fortu-off-white">
                {{ formatVariantPrice(variant.price) }}
              </span>
              <span 
                v-if="variant.compareAtPrice && variant.compareAtPrice > (variant.price || 0)" 
                class="text-xs text-fortu-light/70 line-through"
              >
                {{ formatVariantPrice(variant.compareAtPrice) }}
              </span>
            </div>

            <!-- Stock Status -->
            <div v-if="variant.inStock !== undefined" class="mt-2">
              <span 
                class="text-xs px-2 py-0.5 rounded-full block text-center"
                :class="variant.inStock 
                  ? 'bg-green-500/80 text-white' 
                  : 'bg-red-500/80 text-white'"
              >
                {{ variant.inStock ? 'Tersedia' : 'Habis' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Buy Button -->
      <div v-if="whatsappLink" class="mt-8" data-track-source="product_hero">
        <Button
          :href="whatsappLink"
          variant="green"
          size="lg"
          target="_blank"
          class="gap-2"
        >
          Beli via WhatsApp
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { urlFor } from '@/sanity/client'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
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
      const builder = urlFor(props.heroImage).width(1920).quality(IMAGE_CONFIG.quality)
      return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
    } catch {
      return null
    }
  }
  return null
})

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

// Fetch site settings for WhatsApp
const siteSettings = ref<SiteSettings | null>(null)

const whatsappLink = computed(() => {
  if (!siteSettings.value?.whatsapp) return null
  // Remove any non-numeric characters except +
  const phone = siteSettings.value.whatsapp.replace(/[^\d+]/g, '')
  // Remove leading + if present for wa.me format
  const cleanPhone = phone.startsWith('+') ? phone.slice(1) : phone
  // Add product name to message
  const message = encodeURIComponent(`Halo, saya tertarik dengan produk ${props.productName}`)
  return `https://wa.me/${cleanPhone}?text=${message}`
})

onMounted(async () => {
  try {
    siteSettings.value = await client.fetch(SITE_SETTINGS_QUERY)
  } catch (e) {
    console.error('Failed to fetch site settings:', e)
  }
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

