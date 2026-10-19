<template>
  <!-- Loading State - full-height so the page never collapses -->
  <SectionSkeleton v-if="loading" min-height="min-h-screen" align="left" :cards="0">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center">
      <div class="skeleton aspect-[4/3] w-full rounded-2xl"></div>
      <div class="space-y-4">
        <div class="skeleton h-12 md:h-16 w-3/4 rounded-lg"></div>
        <div class="skeleton h-4 w-full rounded"></div>
        <div class="skeleton h-4 w-5/6 rounded"></div>
        <div class="skeleton h-10 w-40 rounded-full mt-6"></div>
      </div>
    </div>
  </SectionSkeleton>

  <!-- Error State -->
  <div v-else-if="error" class="min-h-screen flex items-center justify-center bg-fortu-off-white">
    <div class="text-center px-4">
      <h1 class="text-2xl font-medium text-fortu-dark mb-4">Produk Tidak Ditemukan</h1>
      <p class="text-fortu-medium mb-8">{{ error }}</p>
      <Button href="/products" variant="primary">
        Kembali ke Produk
      </Button>
    </div>
  </div>

  <!-- Product Detail -->
  <div v-else-if="product" class="bg-fortu-off-white">
    <!-- Product Hero -->
    <ProductHero
      :product-name="product.name"
      :product-slug="product.slug?.current"
      :description="product.description"
      :hero-image="product.heroImage"
      :hero-video="product.heroVideo"
      :price="displayPrice"
      :compare-at-price="compareAtPrice"
      :currency="product.currency"
      :has-variants="product.hasVariants"
      :variants="product.variants"
      :variant-type="product.variantType"
      :selected-variant-key="selectedVariant?._key"
      @select-variant="selectVariant"
    />

    <!-- Image Carousel Section -->
    <ImageCarousel
      v-if="carouselImages.length > 0"
      :images="carouselImages"
      heading="Lihat lebih dekat"
      :variants="product.variants"
      :variant-type="product.variantType"
      :selected-variant-key="selectedVariant?._key"
      :selected-variant-name="selectedVariant?.name"
      @select-variant="selectVariant"
      class="bg-fortu-dark pt-12"
    />

    <!-- Feature Sections -->
    <ProductSingleFeature
      v-for="feature in product.features"
      :key="feature._key"
      :feature="feature"
    />

    <!-- Specifications Section -->
    <section v-if="product.specs?.length || product.specTable?.groups?.length" id="spesifikasi" class="py-16 px-4 md:px-16 bg-white">
      <div>
        <h2 class="text-4xl md:text-4xl font-medium text-fortu-dark mb-10 tracking-tight">
          Spesifikasi
        </h2>
        
        <div v-if="product.specs?.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          <div 
            v-for="(spec, index) in product.specs" 
            :key="spec._key || index"
            class="p-6 bg-fortu-off-white rounded-xl"
          >
            <div class="w-12 h-12 rounded-full bg-fortu-dark/10 flex items-center justify-center mb-4">
              <CompareIcon :icon="spec.icon || 'check'" class="text-fortu-dark" />
            </div>
            <p class="font-medium text-fortu-dark">{{ spec.label }}</p>
            <p v-if="spec.value" class="text-base text-fortu-medium mt-1">{{ spec.value }}</p>
          </div>
        </div>

        <!-- Full spec sheet per size (from the product team's specification sheet) -->
        <ProductSpecTable
          v-if="product.specTable?.groups?.length"
          class="mt-14"
          :table="product.specTable"
          :selected="selectedVariant?.name"
          @select="selectVariantByName"
        />
      </div>
    </section>

    <!-- Product Recommendations -->
    <ProductRecommendation
      :current-product-id="product._id"
      :current-product-slug="product.slug?.current"
    />

    <CTA variant="dark" />
  </div>
</template>

<script setup lang="ts">
import { buildImageUrl, ogImageUrl } from '@/utils/image'
import { useSeo } from '@/composables/useSeo'
import { fitTitle, trimTo } from '@/utils/seo'
import { useAnalytics } from '@/composables/useAnalytics'
import { useJsonLd } from '@/composables/useJsonLd'
import { breadcrumbs, productSchema } from '@/utils/structuredData'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchSanity } from '@/sanity/fetch'
import { PRODUCT_BY_SLUG_QUERY, type Product, type ProductVariant } from '@/sanity/queries'
import Button from '@/reusables/Button.vue'
import CompareIcon from '@/components/CompareIcon.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'
import ProductHero from '@/components/productDetail/ProductHero.vue'
import ProductSingleFeature from '@/components/productDetail/ProductSingleFeature.vue'
import ProductRecommendation from '@/components/productDetail/ProductRecommendation.vue'
import ProductSpecTable from '@/components/productDetail/ProductSpecTable.vue'
import { sizeKey } from '@/utils/size'
import CTA from '@/components/CTA.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'
const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedVariant = ref<ProductVariant | null>(null)

const carouselImages = computed(() => {
  const images: { url: string; alt?: string }[] = []
  
  // Add all product images
  if (product.value?.images) {
    product.value.images.forEach((img, index) => {
      if (img.asset) {
        try {
          // Whole image object is passed so crop/hotspot are honoured
          // Pass the full image object (not just asset) to preserve hotspot and crop
          const url = buildImageUrl(img, { width: 960 })
          if (url) {
            images.push({
              url,
              alt: img.alt || `${product.value?.name} - gambar ${index + 1}`
            })
          }
        } catch (e) {
          console.warn('Failed to generate image URL:', e)
        }
      }
    })
  }
  
  // Add variant images if any
  if (product.value?.variants) {
    product.value.variants.forEach(variant => {
      if (variant.image?.asset) {
        try {
          // Whole image object is passed so crop/hotspot are honoured
          const url = buildImageUrl(variant.image, { width: 960 })
          if (url && !images.some(img => img.url === url)) {
            images.push({
              url,
              alt: variant.image.alt || `${product.value?.name} - ${variant.name}`
            })
          }
        } catch (e) {
          console.warn('Failed to generate variant image URL:', e)
        }
      }
      // Add additional variant images
      if (variant.images) {
        variant.images.forEach(variantImg => {
          if (variantImg.asset) {
            try {
              // Whole image object is passed so crop/hotspot are honoured
              const url = buildImageUrl(variantImg, { width: 960 })
              if (url && !images.some(img => img.url === url)) {
                images.push({
                  url,
                  alt: variantImg.alt || `${product.value?.name} - ${variant.name}`
                })
              }
            } catch (e) {
              console.warn('Failed to generate variant image URL:', e)
            }
          }
        })
      }
    })
  }
  
  return images
})

const displayPrice = computed(() => {
  if (selectedVariant.value?.price) {
    return selectedVariant.value.price
  }
  return product.value?.price || 0
})

const compareAtPrice = computed(() => {
  if (selectedVariant.value?.compareAtPrice && selectedVariant.value.compareAtPrice > displayPrice.value) {
    return selectedVariant.value.compareAtPrice
  }
  if (product.value?.compareAtPrice && product.value.compareAtPrice > displayPrice.value) {
    return product.value.compareAtPrice
  }
  return undefined
})

const selectVariant = (variant: ProductVariant) => {
  selectedVariant.value = variant
}

// A size from the header menu (?ukuran=65) or a column of the spec table
const selectVariantByName = (size?: string | null) => {
  if (!size || !product.value?.variants) return
  const match = product.value.variants.find((v) => sizeKey(v.name) === sizeKey(size))
  if (match) selectedVariant.value = match
}
const selectVariantFromQuery = () => {
  const wanted = route.query.ukuran
  selectVariantByName(Array.isArray(wanted) ? wanted[0] : wanted)
}
watch(() => route.query.ukuran, selectVariantFromQuery)

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    await fetchProduct(newSlug as string)
  }
})

const fetchProduct = async (slug: string) => {
  loading.value = true
  error.value = null
  
  try {
    const productData = await fetchSanity(PRODUCT_BY_SLUG_QUERY, { slug })
    
    if (!productData) {
      error.value = 'Produk yang Anda cari tidak tersedia.'
      return
    }
    
    product.value = productData
    
    // Auto-select first variant, unless the link asked for a size (?ukuran=65 from the header menu)
    if (productData.hasVariants && productData.variants && productData.variants.length > 0) {
      selectedVariant.value = productData.variants[0]
      selectVariantFromQuery()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Produk tidak dapat dimuat. Coba lagi nanti.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const slug = route.params.slug as string
  if (slug) {
    fetchProduct(slug)
  }
})

const productImageUrl = computed(() => {
  const img = product.value?.shareImage?.asset
    ? product.value.shareImage
    : product.value?.heroImage || product.value?.images?.[0]
  return img?.asset ? ogImageUrl(img) ?? undefined : undefined
})


useSeo(() => {
  const name = product.value?.name
  const desc = (product.value?.seoDescription || product.value?.description)?.replace(/\s+/g, ' ').trim()
  return {
    title: product.value?.seoTitle?.trim()
      ? product.value.seoTitle.trim()
      : name
        ? fitTitle(name)
        : 'Produk | Fortu Digital',
    description: desc
      ? trimTo(desc, 155)
      : name
        ? `Spesifikasi, fitur, dan informasi pemesanan ${name} dari Fortu Digital.`
        : undefined,
    image: productImageUrl.value,
    noindex: product.value?.noIndex === true || (!!error.value && !product.value),
  }
})

const { trackEvent } = useAnalytics()
watch(
  () => product.value?._id,
  (id) => {
    if (id) {
      trackEvent('view_product', {
        product_name: product.value?.name,
        product_slug: product.value?.slug.current,
        page_path: route.path,
      })
    }
  },
)

useJsonLd('product', () =>
  productSchema(
    product.value,
    carouselImages.value.map((img) => img.url),
  ),
)
useJsonLd('breadcrumb', () =>
  product.value
    ? breadcrumbs([
        { name: 'Beranda', path: '/' },
        { name: 'Produk', path: '/products' },
        { name: product.value.name, path: `/products/${product.value.slug.current}` },
      ])
    : null,
)
</script>

<style scoped>
/* Product detail styles */
</style>
