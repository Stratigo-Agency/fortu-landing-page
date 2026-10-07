<template>
  <div class="privacy-page min-h-screen bg-fortu-off-white">
    <PageHero 
      pageName="privacy" 
      fallbackTitle="Kebijakan Privasi"
      fallbackSubtitle="Kebijakan privasi dan penggunaan cookies"
    />
    
    <div class="max-w-4xl mx-auto px-4 md:px-16 py-16 md:py-24">
      <div class="prose prose-lg max-w-none">
        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Pengenalan</h2>
          <p class="text-fortu-medium leading-relaxed mb-4">
            Fortu Digital menghormati privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda. 
            Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi 
            Anda saat menggunakan situs web kami.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Informasi yang Kami Kumpulkan</h2>
          <div class="space-y-4 text-fortu-medium leading-relaxed">
            <p>
              Kami dapat mengumpulkan informasi berikut:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Informasi yang Anda berikan secara sukarela saat menghubungi kami</li>
              <li>Data penggunaan situs web melalui Google Analytics (hanya setelah Anda memberikan persetujuan)</li>
              <li>Informasi teknis seperti alamat IP, jenis browser, dan perangkat yang digunakan</li>
            </ul>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Penggunaan Cookies</h2>
          <div class="space-y-4 text-fortu-medium leading-relaxed">
            <p>
              Kami menggunakan cookies untuk:
            </p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Menganalisis penggunaan situs web melalui Google Analytics</li>
              <li>Meningkatkan pengalaman pengguna</li>
              <li>Mengingat preferensi Anda</li>
            </ul>
            <p>
              Cookies yang kami gunakan adalah cookies analitik yang membantu kami memahami bagaimana 
              pengunjung berinteraksi dengan situs web kami. Kami hanya menggunakan cookies ini setelah 
              Anda memberikan persetujuan melalui banner cookies.
            </p>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Google Analytics</h2>
          <p class="text-fortu-medium leading-relaxed mb-4">
            Kami menggunakan Google Analytics untuk menganalisis penggunaan situs web. Google Analytics 
            menggunakan cookies untuk mengumpulkan informasi tentang bagaimana pengunjung menggunakan situs kami. 
            Informasi ini digunakan untuk membuat laporan tentang aktivitas situs web dan membantu kami 
            meningkatkan situs web.
          </p>
          <p class="text-fortu-medium leading-relaxed">
            Anda dapat menolak penggunaan cookies Google Analytics dengan menolak persetujuan melalui 
            banner cookies atau dengan menginstal Google Analytics Opt-out Browser Add-on.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Keamanan Data</h2>
          <p class="text-fortu-medium leading-relaxed">
            Kami mengambil langkah-langkah yang wajar untuk melindungi informasi pribadi Anda dari 
            akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi 
            melalui internet atau penyimpanan elektronik yang 100% aman.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Hak Anda</h2>
          <div class="space-y-4 text-fortu-medium leading-relaxed">
            <p>Anda memiliki hak untuk:</p>
            <ul class="list-disc pl-6 space-y-2">
              <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
              <li>Meminta koreksi informasi yang tidak akurat</li>
              <li>Meminta penghapusan informasi pribadi Anda</li>
              <li>Menolak penggunaan cookies kapan saja</li>
              <li>Mencabut persetujuan penggunaan cookies</li>
            </ul>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Perubahan Kebijakan</h2>
          <p class="text-fortu-medium leading-relaxed">
            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan dipublikasikan 
            di halaman ini dengan tanggal pembaruan terakhir. Kami menyarankan Anda untuk meninjau halaman 
            ini secara berkala.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-3xl font-medium text-fortu-dark mb-6">Hubungi Kami</h2>
          <p class="text-fortu-medium leading-relaxed mb-4">
            Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin menggunakan hak Anda, 
            silakan hubungi kami melalui:
          </p>
          <div class="space-y-2 text-fortu-medium">
            <p>Email: info@stratigo.co.id</p>
          </div>
        </section>

        <section class="text-sm text-fortu-medium">
          <p>Terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import PageHero from '@/components/PageHero.vue'

useSeo({
  title: 'Kebijakan Privasi | Fortu Digital',
  description:
    'Kebijakan privasi Fortu Digital: data apa yang kami kumpulkan, bagaimana cookies digunakan, dan bagaimana Anda dapat mengatur pilihan privasi Anda.',
})
</script>

<style scoped>
.prose ul {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.prose li {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>

