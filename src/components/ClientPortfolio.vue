<template>
  <section v-if="studies.length" class="client-portfolio bg-fortu-off-white py-16 md:py-24" aria-labelledby="client-portfolio-title">
    <div class="mx-auto px-4 md:px-16">
      <div class="text-center mb-10 md:mb-14">
        <p class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-fortu-medium mb-3">Portofolio</p>
        <h2 id="client-portfolio-title" class="text-4xl md:text-5xl lg:text-6xl font-light text-fortu-dark tracking-tight">
          Kreativitas tanpa Batas
        </h2>
        <p class="mt-4 text-fortu-medium text-base md:text-lg max-w-2xl mx-auto">
          Sebagian klien dan proyek Fortu Digital. Pilih klien untuk melihat studi kasusnya.
        </p>
      </div>

      <ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none">
        <li v-for="s in shown" :key="s._id">
          <CaseStudyCard :study="s" />
        </li>
      </ul>

      <div v-if="hasPublished" class="text-center mt-10">
        <RouterLink to="/studi-kasus" class="inline-flex items-center gap-2 text-fortu-dark font-medium group">
          Lihat semua studi kasus
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { client } from '@/sanity/client'
import { CASE_STUDIES_QUERY, type CaseStudyListItem } from '@/sanity/queries'
import CaseStudyCard from '@/components/CaseStudyCard.vue'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 8 })
const studies = ref<CaseStudyListItem[]>([])

const shown = computed(() => studies.value.slice(0, props.limit))
const hasPublished = computed(() => studies.value.some((s) => s.status === 'published'))

onMounted(async () => {
  try {
    studies.value = (await client.fetch(CASE_STUDIES_QUERY)) as CaseStudyListItem[]
  } catch (e) {
    console.error('Failed to fetch case studies:', e)
  }
})
</script>
