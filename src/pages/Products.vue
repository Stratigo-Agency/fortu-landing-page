<template>
  <div class="products-page min-h-screen bg-fortu-off-white">
    <PageHero 
      pageName="products" 
      fallbackTitle="Produk Fortu Digital"
      fallbackSubtitle="Temukan digital signage yang tepat untuk Anda"
    />
    <ProductCatalog class="py-12" />
    <Compare />
    <CTA variant="dark" />
   
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
import PageHero from '@/components/PageHero.vue'
import ProductCatalog from '@/components/ProductCatalog.vue'
import Compare from '@/components/Compare.vue'
import CTA from '@/components/CTA.vue'

usePageSeo('products', {
  title: 'Produk Digital Signage & Interactive Flat Panel | Fortu',
  description:
    'Katalog Fortu Digital: digital signage standing, interactive flat panel, dan smart mobile signage untuk rapat, retail, sekolah, dan lobi.',
})
</script>
