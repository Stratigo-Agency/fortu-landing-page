<template>
  <component
    :is="clickable ? RouterLink : 'div'"
    :to="clickable ? `/studi-kasus/${study.slug.current}` : undefined"
    class="case-card group relative block overflow-hidden rounded-2xl bg-white border border-fortu-light/50 aspect-[4/3] transition-colors duration-300"
    :class="clickable ? 'cursor-pointer hover:border-fortu-dark focus-visible:border-fortu-dark' : ''"
    :aria-label="clickable ? `Lihat studi kasus ${study.clientName}` : undefined"
    @click="onClick"
  >
    <!-- Logo -->
    <div class="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300" :class="clickable ? 'group-hover:opacity-0 group-focus-visible:opacity-0' : ''">
      <img
        v-if="logo"
        :src="logo"
        :alt="study.clientName"
        loading="lazy"
        decoding="async"
        class="max-h-[56%] max-w-[78%] w-auto object-contain"
      />
      <span v-else class="text-xl font-medium text-fortu-dark text-center tracking-tight">{{ study.clientName }}</span>
      <span
        v-if="!clickable"
        class="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.18em] text-fortu-medium"
      >Segera hadir</span>
    </div>

    <!-- Preview on hover / focus -->
    <template v-if="clickable">
      <div class="case-preview absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 bg-fortu-dark">
        <img
          v-if="cover"
          :src="cover"
          :alt="study.coverImage?.alt || study.clientName"
          loading="lazy"
          decoding="async"
          width="800"
          height="600"
          class="absolute inset-0 w-full h-full object-cover"
        :style="focalStyle(study.coverImage)"
      />
        <div class="absolute inset-0 bg-gradient-to-t from-fortu-dark/85 via-fortu-dark/30 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-5 text-fortu-off-white">
          <p class="text-lg font-medium tracking-tight">{{ study.clientName }}</p>
          <p v-if="meta" class="text-sm text-fortu-light mt-0.5">{{ meta }}</p>
          <span class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
            Lihat studi kasus
            <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import { focalStyle } from '@/utils/focal'
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import type { CaseStudyListItem } from '@/sanity/queries'
import { logoSrc, imageUrl } from '@/utils/caseStudy'

const props = defineProps<{ study: CaseStudyListItem }>()
const router = useRouter()

const clickable = computed(() => props.study.status === 'published')
const logo = computed(() => logoSrc(props.study.logoKey))
const cover = computed(() => imageUrl(props.study.coverImage, 800, 600))
const meta = computed(() => [props.study.industry, props.study.projectType].filter(Boolean).join(' · '))

// The card "opens" into the case-study page: View Transitions where supported, plain navigation otherwise.
const onClick = (e: MouseEvent) => {
  if (!clickable.value || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!doc.startViewTransition || reduce) return
  e.preventDefault()
  const el = e.currentTarget as HTMLElement
  el.style.viewTransitionName = 'case-open'
  doc.startViewTransition(async () => {
    await router.push(`/studi-kasus/${props.study.slug.current}`)
    el.style.viewTransitionName = ''
  })
}
</script>
