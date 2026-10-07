<template>
  <div class="products-page min-h-screen bg-fortu-off-white">
    <PageHero 
      pageName="products" 
      fallbackTitle="Discover Fortu"
      fallbackSubtitle="Explore our collection of premium products"
    />
    <ProductCatalog class="py-12" />
    <Compare />
    <CTA variant="dark" />
   
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import PageHero from '@/components/PageHero.vue'
import ProductCatalog from '@/components/ProductCatalog.vue'
import Compare from '@/components/Compare.vue'
import CTA from '@/components/CTA.vue'

useSeo({
  title: 'Produk Digital Signage & Interactive Display | Fortu Digital',
  description:
    'Katalog Fortu Digital: layar digital signage, interactive flat panel, dan videotron untuk ruang rapat, ritel, pendidikan, dan lobi perusahaan.',
})
</script>
