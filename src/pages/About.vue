<template>
  <div class="about-page bg-fortu-off-white min-h-screen">
    <PageHero 
      pageName="about" 
      fallbackTitle="About Us"
      fallbackSubtitle="Pelajari lebih lanjut tentang kami dan misi kami"
    />

    <!-- Reserve the content height while Sanity responds -->
    <SectionSkeleton v-if="loading" min-height="min-h-[80vh]" :cards="2" />

    <!-- About Content -->
    <div v-else>
      <div class="max-w-4xl mx-auto px-4 pt-16 md:pt-24">
        <!-- Description -->
        <div class="mb-16 md:mb-24">
          <p class="text-fortu-dark text-lg md:text-xl leading-relaxed text-center">
            {{ aboutContent?.description || defaultContent.description }}
          </p>
        </div>

        <!-- Vision & Mission Grid -->
        <div class="grid md:grid-cols-2 gap-12 md:gap-16">
          <!-- Vision -->
          <div class="vision-section">
            <div class="mb-6">
              <p class="text-sm md:text-4xl font-medium text-fortu-medium uppercase tracking-wider mb-4">
                {{ aboutContent?.vision?.title || defaultContent.vision.title }}
              </p>
              <h2 class="text-3xl md:text-3xl font-medium text-fortu-dark mb-6 tracking-tight">
                {{ aboutContent?.vision?.heading || defaultContent.vision.heading }}
              </h2>
            </div>
            <p class="text-fortu-medium text-base md:text-lg leading-relaxed">
              {{ aboutContent?.vision?.description || defaultContent.vision.description }}
            </p>
          </div>

          <!-- Mission -->
          <div class="mission-section">
            <div class="mb-6">
              <p class="text-sm md:text-4xl font-medium text-fortu-medium uppercase tracking-wider mb-4">
                {{ aboutContent?.mission?.title || defaultContent.mission.title }}
              </p>
              <h2 class="text-3xl md:text-3xl font-medium text-fortu-dark mb-6 tracking-tight">
                {{ aboutContent?.mission?.heading || defaultContent.mission.heading }}
              </h2>
            </div>
            <p class="text-fortu-medium text-base md:text-lg leading-relaxed">
              {{ aboutContent?.mission?.description || defaultContent.mission.description }}
            </p>
          </div>
        </div>
      </div>
      <!-- Installation process (Sanity: "Tentang: Showcase Proses Instalasi"); falls back to the old gallery -->
      <InstallShowcase v-if="showcase" class="mt-16" :data="showcase" />
      <UseCaseSection v-else class="mt-16" :show-title="false" :show-description="false" />
      <CTA variant="dark" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
import { ref, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { ABOUT_PAGE_QUERY, INSTALL_SHOWCASE_QUERY, type AboutPage, type InstallShowcase as InstallShowcaseData } from '@/sanity/queries'
import PageHero from '@/components/PageHero.vue'
import UseCaseSection from '@/components/UseCaseSection.vue'
import InstallShowcase from '@/components/InstallShowcase.vue'
import CTA from '@/components/CTA.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const aboutContent = ref<AboutPage | null>(null)
const showcase = ref<InstallShowcaseData | null>(null)
const loading = ref(true)

// Default content fallback
const defaultContent = {
  description: 'FORTU Digital adalah solusi display digital modern untuk membantu bisnis FORTU menyampaikan informasi dan promosi secara visual, interaktif, dan terpusat. Kami menggabungkan teknologi, desain, dan kemudahan penggunaan dalam satu sistem yang efisien dan elegan.',
  vision: {
    title: 'Visi',
    heading: 'FORTU DIGITAL',
    description: 'Menjadi pelopor brand teknologi visual terdepan di Indonesia.'
  },
  mission: {
    title: 'Misi',
    heading: 'FORT DIGITAL',
    description: 'Menjadi solusi bagi bisnis dalam berkomunikasi dan beriklan melalui pengalaman visual yang interaktif, elegan, berdampak, serta memberikan layanan aftersales yang responsif dan terpercaya di seluruh Indonesia.'
  }
}

onMounted(async () => {
  try {
    const [about, install] = await Promise.all([
      client.fetch(ABOUT_PAGE_QUERY),
      client.fetch(INSTALL_SHOWCASE_QUERY).catch(() => null),
    ])
    aboutContent.value = about
    showcase.value = install?.steps?.length ? install : null
  } catch (e) {
    console.error('Failed to fetch about page content:', e)
  } finally {
    loading.value = false
  }
})

usePageSeo('about', {
  title: 'Tentang Fortu Digital | Vendor Digital Signage Indonesia',
  description:
    'Kenali Fortu Digital: tim di balik perangkat, CMS cloud, dan instalasi digital signage untuk instansi, korporasi, dan institusi pendidikan di Indonesia.',
})
</script>

<style scoped>
.vision-section,
.mission-section {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.vision-section {
  animation-delay: 0.2s;
}

.mission-section {
  animation-delay: 0.4s;
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
