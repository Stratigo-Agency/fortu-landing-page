<template>
  <div class="not-found-page bg-fortu-dark min-h-screen flex items-center justify-center">
    <div class="text-center px-4 md:px-16 py-24 max-w-2xl mx-auto">
      <!-- 404 Number -->
      <p class="text-8xl md:text-9xl font-medium text-fortu-off-white mb-4 tracking-tight opacity-20" aria-hidden="true">
        404
      </p>
      
      <!-- Title -->
      <h1 class="text-3xl md:text-5xl font-medium text-fortu-off-white mb-4 tracking-tight">
        Halaman Tidak Ditemukan
      </h1>
      
      <!-- Description -->
      <p class="text-fortu-light text-lg mb-8 leading-relaxed">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button href="/" variant="secondary" size="lg">
          Kembali ke Beranda
        </Button>
        <Button href="/products" variant="outline" size="lg">
          Lihat Produk
        </Button>
      </div>
      
      <!-- Additional Links -->
      <div class="mt-12 pt-8 border-t border-fortu-medium/30">
        <p class="text-sm text-fortu-light mb-4">Atau kunjungi:</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link to="/about" class="text-fortu-off-white hover:text-fortu-light transition-colors text-sm">
            Tentang Kami
          </router-link>
          <router-link to="/contact" class="text-fortu-off-white hover:text-fortu-light transition-colors text-sm">
            Kontak
          </router-link>
          <router-link to="/products" class="text-fortu-off-white hover:text-fortu-light transition-colors text-sm">
            Produk
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import Button from '@/reusables/Button.vue'

useSeo({
  title: 'Halaman Tidak Ditemukan | Fortu Digital',
  description: 'Halaman yang Anda cari tidak tersedia. Kembali ke beranda Fortu Digital.',
  noindex: true,
})
</script>

<style scoped>
.not-found-page {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

