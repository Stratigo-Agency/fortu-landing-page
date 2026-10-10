<template>
  <SectionSkeleton v-if="loading" min-height="min-h-screen" align="left" :cards="0" />

  <div v-else-if="!study" class="min-h-screen flex items-center justify-center bg-fortu-off-white">
    <div class="text-center px-4">
      <h1 class="text-2xl font-medium text-fortu-dark mb-4">Studi kasus belum tersedia</h1>
      <p class="text-fortu-medium mb-8">Halaman ini belum tayang atau sudah dipindahkan.</p>
      <Button to="/studi-kasus" variant="primary">Lihat semua studi kasus</Button>
    </div>
  </div>

  <article v-else class="bg-white">
    <!-- Title block. A dark band keeps the transparent menu above it readable; the photo below straddles its edge. -->
    <header class="bg-fortu-dark text-fortu-off-white pt-28 md:pt-36" :class="cover ? 'pb-28 md:pb-52' : 'pb-16 md:pb-24'">
      <div class="mx-auto max-w-5xl px-4 md:px-8">
        <nav aria-label="Navigasi halaman">
          <RouterLink to="/studi-kasus" class="inline-flex items-center gap-2 text-base text-fortu-light hover:text-fortu-off-white transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Semua studi kasus
          </RouterLink>
        </nav>

        <div class="mt-10 md:mt-14 text-center">
          <p class="inline-flex flex-wrap items-center justify-center gap-3 text-base md:text-lg text-fortu-light">
            Fortu Digital untuk
            <span v-if="logo" class="inline-flex h-12 items-center rounded-xl bg-white px-4">
              <img :src="logo" :alt="study.clientName" width="160" height="48" decoding="async" class="h-8 w-auto object-contain" />
            </span>
            <span v-else class="rounded-full bg-fortu-off-white/10 px-4 py-1.5 font-medium text-fortu-off-white">{{ study.clientName }}</span>
          </p>
          <h1 class="mx-auto mt-6 max-w-3xl text-3xl md:text-5xl font-medium tracking-tight leading-tight">{{ headline }}</h1>
          <p v-if="study.spokespersonName" class="mt-6 text-base md:text-lg">
            <span class="font-medium">{{ study.spokespersonName }}</span>
            <span v-if="study.spokespersonRole" class="ml-2 text-fortu-light">{{ study.spokespersonRole }}</span>
          </p>
        </div>
      </div>
    </header>

    <!-- Main photo (the card's photo opens into this) -->
    <div v-if="cover" class="relative z-10 mx-auto max-w-6xl px-4 md:px-8 -mt-20 md:-mt-40">
      <div class="overflow-hidden rounded-3xl bg-fortu-dark aspect-[4/3] md:aspect-[16/9]" style="view-transition-name: case-open">
        <img
          :src="cover"
          :alt="study.coverImage?.alt || study.clientName"
          width="1600"
          height="900"
          fetchpriority="high"
          decoding="async"
          class="w-full h-full object-cover"
          :style="focalStyle(study.coverImage)"
        />
      </div>
    </div>

    <!-- Story -->
    <div class="mx-auto max-w-3xl px-4 md:px-8 py-14 md:py-20">
      <dl v-if="facts.length" class="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6 pb-8 border-b border-fortu-light/60">
        <div v-for="f in facts" :key="f.label">
          <dt class="text-sm uppercase tracking-[0.18em] text-fortu-dark/60">{{ f.label }}</dt>
          <dd class="mt-1 text-lg font-medium text-fortu-dark">{{ f.value }}</dd>
        </div>
      </dl>

      <ul v-if="study.tags?.length" class="mt-8 flex flex-wrap gap-2 list-none">
        <li v-for="t in study.tags" :key="t" class="rounded-full bg-fortu-off-white px-4 py-1.5 text-base text-fortu-dark">{{ t }}</li>
      </ul>

      <p v-if="study.summary" class="mt-8 text-xl md:text-2xl font-medium leading-snug text-fortu-dark">{{ study.summary }}</p>

      <div class="mt-10 space-y-12">
        <section v-for="part in story" :key="part.title">
          <h2 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight mb-4">{{ part.title }}</h2>
          <p class="text-lg md:text-xl leading-relaxed text-fortu-dark/80 whitespace-pre-line">{{ part.text }}</p>
        </section>

        <section v-if="gallery.length">
          <h2 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight mb-6">Foto proyek</h2>
          <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none">
            <li v-for="(g, i) in gallery" :key="g._key || i">
              <figure>
                <img :src="g.url" :alt="g.alt" width="1000" height="750" loading="lazy" decoding="async" class="w-full rounded-2xl object-cover aspect-[4/3]" />
                <figcaption v-if="g.caption" class="mt-2 text-base text-fortu-dark/70">{{ g.caption }}</figcaption>
              </figure>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <!-- Next step -->
    <section class="mx-auto max-w-3xl px-4 md:px-8 pb-16 md:pb-24 text-center">
      <h2 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight">Ada pertanyaan?</h2>
      <p class="mt-3 text-lg md:text-xl text-fortu-dark/70">Diskusikan kebutuhan Anda dengan tim Fortu Digital.</p>
      <div class="mt-8">
        <Button variant="primary" size="lg" @click="openChooser('case_study', { campaign: study.slug.current })">Diskusikan proyek Anda</Button>
      </div>
    </section>

    <!-- More stories -->
    <section v-if="others.length" class="bg-fortu-off-white py-16 md:py-24" aria-labelledby="more-stories-title">
      <div class="mx-auto max-w-7xl px-4 md:px-16">
        <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-10">
          <h2 id="more-stories-title" class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight">Jelajahi studi kasus lainnya</h2>
          <RouterLink to="/studi-kasus" class="inline-flex items-center gap-2 text-lg font-medium text-fortu-dark underline underline-offset-4">
            Lihat semua studi kasus
          </RouterLink>
        </div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 list-none">
          <li v-for="o in others" :key="o._id"><CaseStudyCard :study="o" /></li>
        </ul>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { focalStyle } from '@/utils/focal'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { client } from '@/sanity/client'
import { CASE_STUDY_BY_SLUG_QUERY, CASE_STUDIES_QUERY, type CaseStudy, type CaseStudyListItem } from '@/sanity/queries'
import { logoSrc, imageUrl } from '@/utils/caseStudy'
import { useSeo } from '@/composables/useSeo'
import { useJsonLd } from '@/composables/useJsonLd'
import { useContactChooser } from '@/composables/useContactChooser'
import { breadcrumbs, caseStudySchema } from '@/utils/structuredData'
import Button from '@/reusables/Button.vue'
import CaseStudyCard from '@/components/CaseStudyCard.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const route = useRoute()
const study = ref<CaseStudy | null>(null)
const others = ref<CaseStudyListItem[]>([])
const loading = ref(true)
const { openChooser } = useContactChooser()

const logo = computed(() => logoSrc(study.value?.logoKey))
// The page title: the story's headline, else what was done for whom
const headline = computed(() => {
  const s = study.value
  if (!s) return ''
  return s.headline?.trim() || (s.projectType ? `${s.projectType}: ${s.clientName}` : s.clientName)
})
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
    { title: 'Latar belakang', text: s.background },
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

// Other published stories, for "Jelajahi studi kasus lainnya"
const loadOthers = async (slug: string) => {
  try {
    const all = (await client.fetch(CASE_STUDIES_QUERY)) as CaseStudyListItem[]
    others.value = all.filter((c) => c.status === 'published' && c.slug.current !== slug).slice(0, 4)
  } catch (e) {
    console.error('Failed to fetch other case studies:', e)
    others.value = []
  }
}

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
  if (study.value) loadOthers(slug)
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
