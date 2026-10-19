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

    <!-- Products Carousel -->
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { fetchSanity } from '@/sanity/fetch'
import { PRODUCTS_QUERY, type Product } from '@/sanity/queries'
import ImageCarousel from '@/components/ImageCarousel.vue'

const router = useRouter()
const route = useRoute()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

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
  try {
    products.value = await fetchSanity(PRODUCTS_QUERY)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Produk tidak dapat dimuat. Coba lagi nanti.'
  } finally {
    loading.value = false
  }
})
</script>
