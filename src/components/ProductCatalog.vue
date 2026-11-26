<template>
  <div class="product-catalog">
    <!-- Loading State - mirrors the carousel layout so nothing shifts -->
    <div v-if="loading" class="overflow-hidden" aria-busy="true">
      <div class="px-4 md:px-16">
        <div class="skeleton h-9 md:h-10 w-52 rounded-lg mb-12"></div>
      </div>
      <div class="flex gap-4 md:gap-6 px-4 md:px-16 pb-4">
        <div
          v-for="n in 4"
          :key="n"
          class="flex-shrink-0 w-[220px] md:w-[300px] lg:w-[380px]"
        >
          <div class="skeleton aspect-[3/3.2] rounded-2xl"></div>
          <div class="skeleton h-8 w-3/4 rounded-lg mt-3"></div>
          <div class="skeleton h-9 w-40 rounded-full mt-4"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20 text-red-500">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-20 text-fortu-medium">
      Produk belum tersedia.
    </div>

    <!-- Mobile: 2-column grid so every product is visible without swiping -->
    <section v-else-if="isMobile" class="px-4 overflow-hidden">
      <h2 class="text-3xl font-medium mb-8 tracking-tight text-fortu-dark">Produk Kami</h2>
      <ul class="grid grid-cols-2 gap-3">
        <li v-for="(image, index) in productImages" :key="image.slug">
          <RouterLink :to="`/products/${image.slug}`" class="block group">
            <div class="aspect-[3/4] rounded-2xl overflow-hidden bg-black">
              <SkeletonImage
                :src="image.url"
                :alt="image.alt || `Produk Fortu Digital - gambar ${index + 1}`"
                :width="320"
                :height="427"
                tone="dark"
                img-class="w-full h-full object-cover group-hover:opacity-80"
              />
            </div>
            <p class="mt-2 text-lg font-medium leading-snug text-fortu-dark">
              {{ image.caption }}
            </p>
          </RouterLink>
        </li>
      </ul>
    </section>

    <!-- Desktop / tablet: products carousel -->
    <ImageCarousel
      v-else
      :images="productImages"
      :clickable="true"
      heading="Produk Kami"
      :show-button="true"
      mode="light"
      @image-click="handleProductClick"
    />
  </div>
</template>

<script setup lang="ts">
import { buildImageUrl } from '@/utils/image'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchSanity } from '@/sanity/fetch'
import { PRODUCTS_QUERY, type Product } from '@/sanity/queries'
import ImageCarousel from '@/components/ImageCarousel.vue'
import SkeletonImage from '@/reusables/SkeletonImage.vue'

const router = useRouter()
const route = useRoute()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// Phones get the grid; the carousel stays for tablet and desktop
const mobileQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)') : null
const isMobile = ref(mobileQuery?.matches ?? false)
const syncMobile = () => {
  isMobile.value = mobileQuery?.matches ?? false
}

const emit = defineEmits<{
  (e: 'product-click', slug: string): void
  (e: 'close-navbar'): void
}>()

const getProductImage = (product: Product): string | undefined => {
  const firstImage = product.images?.[0]
  if (firstImage?.asset) {
    if (firstImage.asset.url) {
      return firstImage.asset.url
    }
    try {
      // Pass the full image object (not just asset) to preserve hotspot and crop
      return buildImageUrl(firstImage, { width: 600, height: 600 }) ?? undefined
    } catch {
      return undefined
    }
  }
  return undefined
}

const productImages = computed(() => {
  return products.value.map(product => ({
    url: getProductImage(product) || '/placeholder.jpg',
    alt: product.name,
    caption: product.name,
    slug: product.slug.current
  }))
})

const handleProductClick = (index: number) => {
  const product = products.value[index]
  if (product?.slug?.current) {
    const productSlug = product.slug.current
    const currentPath = route.path
    
    // Check if we're already on this product's page
    if (currentPath === `/products/${productSlug}`) {
      // Emit event to close navbar
      emit('close-navbar')
    } else {
      // Navigate to the product page
      router.push(`/products/${productSlug}`)
      emit('product-click', productSlug)
    }
  }
}

onMounted(async () => {
  mobileQuery?.addEventListener('change', syncMobile)
  try {
    products.value = await fetchSanity(PRODUCTS_QUERY)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Produk tidak dapat dimuat. Coba lagi nanti.'
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  mobileQuery?.removeEventListener('change', syncMobile)
})
</script>
