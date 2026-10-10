<template>
  <div class="case-studies-page bg-fortu-off-white min-h-screen">
    <PageHero
      pageName="case-studies"
      fallbackTitle="Studi Kasus"
      fallbackSubtitle="Proyek nyata Fortu Digital bersama klien di berbagai industri"
    />

    <SectionSkeleton v-if="loading" min-height="min-h-[60vh]" :cards="3" />

    <div v-else class="mx-auto px-4 md:px-16 py-16 md:py-24">
      <ul v-if="studies.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 list-none">
        <li v-for="s in studies" :key="s._id">
          <CaseStudyCard :study="s" />
        </li>
      </ul>
      <p v-else class="text-center text-fortu-medium">Studi kasus akan segera hadir.</p>
    </div>

    <CTA variant="dark" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { CASE_STUDIES_QUERY, type CaseStudyListItem } from '@/sanity/queries'
import { usePageSeo } from '@/composables/usePageSeo'
import PageHero from '@/components/PageHero.vue'
import CaseStudyCard from '@/components/CaseStudyCard.vue'
import CTA from '@/components/CTA.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const studies = ref<CaseStudyListItem[]>([])
const loading = ref(true)

usePageSeo('case-studies', {
  title: 'Studi Kasus Digital Signage | Fortu Digital',
  description:
    'Proyek digital signage dan interactive display Fortu Digital bersama klien di berbagai industri: dari kebutuhan, solusi, sampai hasilnya.',
})

onMounted(async () => {
  try {
    studies.value = (await client.fetch(CASE_STUDIES_QUERY)) as CaseStudyListItem[]
  } catch (e) {
    console.error('Failed to fetch case studies:', e)
  } finally {
    loading.value = false
  }
})
</script>
