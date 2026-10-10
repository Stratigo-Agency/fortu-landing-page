<template>
  <component
    :is="clickable ? RouterLink : 'div'"
    :to="clickable ? `/studi-kasus/${study.slug.current}` : undefined"
    class="story-card group block"
    @click="onClick"
  >
    <div ref="mediaRef" class="relative overflow-hidden rounded-2xl bg-fortu-dark aspect-[4/5]">
      <!-- Project photo (published studies) -->
      <img
        v-if="cover"
        :src="cover"
        :alt="study.coverImage?.alt || ''"
        width="800"
        height="1000"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        :style="focalStyle(study.coverImage)"
      />
      <span v-if="cover && logo" class="absolute top-4 left-4 flex h-14 items-center rounded-xl bg-white px-4 shadow-sm">
        <img :src="logo" alt="" width="160" height="56" class="h-9 w-auto max-w-[9rem] object-contain" />
      </span>

      <!-- Logo tile (no photo yet) -->
      <div v-else class="absolute inset-0 flex items-center justify-center bg-white p-8">
        <span v-if="study.industry" class="absolute left-5 top-5 text-xs uppercase tracking-[0.16em] text-fortu-dark/70">
          {{ study.industry }}
        </span>
        <img
          v-if="logo"
          :src="logo"
          alt=""
          width="240"
          height="150"
          loading="lazy"
          decoding="async"
          class="max-h-[34%] max-w-[72%] w-auto object-contain"
        />
        <span v-else class="text-2xl font-medium text-fortu-dark text-center tracking-tight">{{ study.clientName }}</span>
      </div>

      <span
        v-if="!clickable"
        class="absolute bottom-5 left-5 inline-flex h-9 items-center rounded-full border border-fortu-light bg-white px-4 text-sm text-fortu-dark/70"
      >
        Segera hadir
      </span>
    </div>

    <div class="mt-4">
      <p class="text-lg md:text-xl font-semibold leading-snug text-fortu-dark">{{ study.clientName }}</p>
      <p v-if="caption" class="mt-1 text-base md:text-lg leading-snug text-fortu-dark/70">{{ caption }}</p>
      <span
        v-if="clickable"
        class="mt-3 inline-flex items-center gap-1.5 text-base font-medium text-fortu-dark underline underline-offset-4 decoration-fortu-dark/30 group-hover:decoration-fortu-dark"
      >
        Baca studi kasus
        <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { focalStyle } from '@/utils/focal'
import type { CaseStudyListItem } from '@/sanity/queries'
import { logoSrc, imageUrl } from '@/utils/caseStudy'

const props = defineProps<{ study: CaseStudyListItem }>()
const router = useRouter()
const mediaRef = ref<HTMLElement | null>(null)

const clickable = computed(() => props.study.status === 'published')
const logo = computed(() => logoSrc(props.study.logoKey))
const cover = computed(() => (clickable.value ? imageUrl(props.study.coverImage, 800, 1000) : null))

// The line under the client name: the story's headline, else what was done, else just the industry
const caption = computed(() => {
  const s = props.study
  if (!clickable.value) return s.industry || ''
  return s.headline?.trim() || [s.projectType, s.industry].filter(Boolean).join(' · ')
})

// The photo "opens" into the case-study page: View Transitions where supported, plain navigation otherwise.
const onClick = (e: MouseEvent) => {
  if (!clickable.value || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const el = mediaRef.value
  if (!doc.startViewTransition || reduce || !el) return
  e.preventDefault()
  el.style.viewTransitionName = 'case-open'
  doc.startViewTransition(async () => {
    await router.push(`/studi-kasus/${props.study.slug.current}`)
    el.style.viewTransitionName = ''
  })
}
</script>
