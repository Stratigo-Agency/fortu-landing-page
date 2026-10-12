<template>
  <!-- Reserve the carousel's height while products are still loading -->
  <SectionSkeleton v-if="loading" min-height="min-h-[50vh]" align="left" :cards="0">
    <div class="skeleton h-9 md:h-10 w-52 rounded-lg mb-12"></div>
    <div class="flex gap-4 md:gap-6 w-full">
      <div v-for="n in 4" :key="n" class="flex-shrink-0 w-[220px] md:w-[300px] lg:w-[380px]">
        <div class="skeleton aspect-[3/3.2] rounded-2xl"></div>
        <div class="skeleton h-8 w-3/4 rounded-lg mt-3"></div>
      </div>
    </div>
  </SectionSkeleton>

  <div v-else-if="recommendedProducts.length > 0" class="py-16 bg-fortu-off-white">
    <ImageCarousel
      :images="productImages"
      heading="Cek Produk Lain"
      :show-button="true"
      mode="light"
      :clickable="true"
      @image-click="handleProductClick"
    />
  </div>
</template>

<script setup lang="ts">
import { buildImageUrl } from '@/utils/image'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { client } from '@/sanity/client'
import { PRODUCTS_QUERY, type Product } from '@/sanity/queries'
import ImageCarousel from '@/components/ImageCarousel.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

interface Props {
  currentProductId?: string
  currentProductSlug?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentProductId: '',
  currentProductSlug: ''
})

const router = useRouter()
const allProducts = ref<Product[]>([])
const loading = ref(true)

const recommendedProducts = computed(() => {
  if (!props.currentProductId && !props.currentProductSlug) {
    return allProducts.value
  }
  
  return allProducts.value.filter(product => {
    // Exclude current product by ID or slug
    if (props.currentProductId && product._id === props.currentProductId) {
      return false
    }
    if (props.currentProductSlug && product.slug?.current === props.currentProductSlug) {
      return false
    }
    return true
  })
})

const getProductImage = (product: Product): string | undefined => {
  const firstImage = product.images?.[0]
  if (firstImage?.asset) {
    if (firstImage.asset.url) {
      return firstImage.asset.url
    }
    try {
      return buildImageUrl(firstImage, { width: 600, height: 600 }) ?? undefined
    } catch {
      return undefined
    }
  }
  return undefined
}

const productImages = computed(() => {
  return recommendedProducts.value.map(product => ({
    url: getProductImage(product) || '/placeholder.jpg',
    alt: product.name,
    caption: product.name,
    slug: product.slug?.current
  }))
})

const handleProductClick = (index: number) => {
  const product = recommendedProducts.value[index]
  if (product?.slug?.current) {
    router.push(`/products/${product.slug.current}`)
  }
}

onMounted(async () => {
  try {
    allProducts.value = await client.fetch(PRODUCTS_QUERY)
  } catch (e) {
    console.error('Failed to fetch products for recommendations:', e)
  } finally {
    loading.value = false
  }
})
</script>

