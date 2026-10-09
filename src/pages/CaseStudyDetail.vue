<template>
  <SectionSkeleton v-if="loading" min-height="min-h-screen" align="left" :cards="0" />

  <div v-else-if="!study" class="min-h-screen flex items-center justify-center bg-fortu-off-white">
    <div class="text-center px-4">
      <h1 class="text-2xl font-medium text-fortu-dark mb-4">Studi kasus belum tersedia</h1>
      <p class="text-fortu-medium mb-8">Halaman ini belum tayang atau sudah dipindahkan.</p>
      <Button to="/studi-kasus" variant="primary">Lihat semua studi kasus</Button>
    </div>
  </div>

  <article v-else class="bg-fortu-off-white">
    <!-- Hero (the card opens into this) -->
    <section class="case-hero relative bg-fortu-dark text-fortu-off-white overflow-hidden">
      <img
        v-if="cover"
        :src="cover"
        :alt="study.coverImage?.alt || study.clientName"
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover"
        :style="focalStyle(study.coverImage)"
      />
      <div class="absolute inset-0 bg-fortu-dark/70"></div>
      <div class="relative z-10 mx-auto max-w-5xl px-4 md:px-16 pt-36 pb-16 md:pt-44 md:pb-24">
        <nav aria-label="Navigasi halaman" class="text-sm text-fortu-light/80 mb-6">
          <RouterLink to="/studi-kasus" class="hover:text-fortu-off-white">Studi kasus</RouterLink>
          <span class="mx-2">/</span>
          <span class="text-fortu-off-white">{{ study.clientName }}</span>
        </nav>
        <div v-if="logo" class="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 mb-6">
          <img :src="logo" :alt="study.clientName" width="240" height="96" decoding="async" class="h-10 md:h-12 w-auto object-contain" />
        </div>
        <h1 class="text-4xl md:text-6xl font-medium tracking-tight leading-tight">
          {{ study.projectType || 'Proyek digital signage' }}
          <span class="block text-fortu-light mt-1">{{ study.clientName }}</span>
        </h1>
        <p v-if="study.summary" class="mt-6 text-lg md:text-xl text-fortu-light max-w-3xl leading-relaxed">
          {{ study.summary }}
        </p>
      </div>
    </section>

    <!-- Facts -->
    <section v-if="facts.length" class="bg-white border-b border-fortu-light/50">
      <dl class="mx-auto max-w-5xl px-4 md:px-16 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div v-for="f in facts" :key="f.label">
          <dt class="text-[11px] uppercase tracking-[0.2em] text-fortu-medium">{{ f.label }}</dt>
          <dd class="mt-1 text-fortu-dark font-medium">{{ f.value }}</dd>
        </div>
      </dl>
    </section>

    <!-- Story -->
    <div class="mx-auto max-w-3xl px-4 md:px-8 py-16 md:py-24 space-y-12">
      <section v-for="part in story" :key="part.title">
        <h2 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight mb-4">{{ part.title }}</h2>
        <p class="text-fortu-medium text-base md:text-lg leading-relaxed whitespace-pre-line">{{ part.text }}</p>
      </section>

      <section v-if="gallery.length">
        <h2 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight mb-6">Foto proyek</h2>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none">
          <li v-for="(g, i) in gallery" :key="g._key || i">
            <figure>
              <img :src="g.url" :alt="g.alt" width="1000" height="750" loading="lazy" decoding="async" class="w-full rounded-2xl object-cover aspect-[4/3]" />
              <figcaption v-if="g.caption" class="mt-2 text-sm text-fortu-medium">{{ g.caption }}</figcaption>
            </figure>
          </li>
        </ul>
      </section>

      <div class="text-center pt-4 flex flex-wrap justify-center gap-3">
        <Button variant="primary" @click="openChooser('case_study', { campaign: study.slug.current })">Diskusikan proyek Anda</Button>
        <Button to="/studi-kasus" variant="outline" class="!text-fortu-dark !border-fortu-dark hover:!bg-fortu-dark hover:!text-fortu-off-white">Semua studi kasus</Button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { focalStyle } from '@/utils/focal'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { client } from '@/sanity/client'
import { CASE_STUDY_BY_SLUG_QUERY, type CaseStudy } from '@/sanity/queries'
import { logoSrc, imageUrl } from '@/utils/caseStudy'
import { useSeo } from '@/composables/useSeo'
import { useJsonLd } from '@/composables/useJsonLd'
import { useContactChooser } from '@/composables/useContactChooser'
import { breadcrumbs, caseStudySchema } from '@/utils/structuredData'
import Button from '@/reusables/Button.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const route = useRoute()
const study = ref<CaseStudy | null>(null)
const loading = ref(true)
const { openChooser } = useContactChooser()

const logo = computed(() => logoSrc(study.value?.logoKey))
const cover = computed(() => imageUrl(study.value?.coverImage, 1920, 1080))

const facts = computed(() => {
  const s = study.value
  if (!s) return []
  return [
    { label: 'Industri', value: s.industry },
    { label: 'Lokasi', value: s.location },
    { label: 'Jenis proyek', value: s.projectType },
    { label: 'Produk', value: s.productsUsed?.join(', ') },
  ].filter((f): f is { label: string; value: string } => !!f.value)
})

const story = computed(() => {
  const s = study.value
  if (!s) return []
  return [
    { title: 'Tantangan', text: s.challenge },
    { title: 'Solusi Fortu', text: s.solution },
    { title: 'Hasil', text: s.result },
  ].filter((p): p is { title: string; text: string } => !!p.text)
})

const gallery = computed(() =>
  (study.value?.gallery || [])
    .map((g) => ({ _key: g._key, url: imageUrl(g, 1000, 750), alt: g.alt || study.value?.clientName || '', caption: g.caption }))
    .filter((g): g is { _key: string | undefined; url: string; alt: string; caption: string | undefined } => !!g.url),
)

const trimTo = (t: string, max: number) => (t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, '') + '…')

useSeo(() => {
  const s = study.value
  return {
    title: s
      ? trimTo(s.seoTitle?.trim() || `Studi Kasus ${s.clientName} | Fortu Digital`, 70)
      : 'Studi Kasus | Fortu Digital',
    description: s ? trimTo((s.seoDescription || [s.projectType ? `${s.projectType} untuk ${s.clientName}.` : '', s.summary || ''].join(' ')).trim(), 155) || undefined : undefined,
    image: imageUrl(s?.shareImage as never, 1200, 630) || cover.value || undefined,
    type: 'article',
    noindex: s?.noIndex === true || (!loading.value && !s),
  }
})

useJsonLd('case-study', () => caseStudySchema(study.value, cover.value || undefined))
useJsonLd('breadcrumb', () =>
  study.value
    ? breadcrumbs([
        { name: 'Beranda', path: '/' },
        { name: 'Studi Kasus', path: '/studi-kasus' },
        { name: study.value.clientName, path: `/studi-kasus/${study.value.slug.current}` },
      ])
    : null,
)

const load = async (slug: string) => {
  loading.value = true
  try {
    study.value = (await client.fetch(CASE_STUDY_BY_SLUG_QUERY, { slug })) as CaseStudy | null
  } catch (e) {
    console.error('Failed to fetch case study:', e)
    study.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => load(String(route.params.slug)))
watch(() => route.params.slug, (s) => s && load(String(s)))
</script>

<style>
/* View Transitions: the clicked card morphs into the page hero */
::view-transition-old(case-open),
::view-transition-new(case-open) {
  animation-duration: 0.45s;
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
</style>
