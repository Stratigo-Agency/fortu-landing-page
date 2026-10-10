<script setup lang="ts">
import { computed } from 'vue'

/**
 * The one set of slider controls used across the site: previous / next arrows, a "02 / 05"
 * counter and a progress line (the look of the product slider on the home page).
 * Pair it with useScrollSlider for scroll-snap rails.
 */
const props = withDefaults(
  defineProps<{
    index: number // current item, 0-based
    count: number
    canPrev?: boolean
    canNext?: boolean
    /** Background the controls sit on: 'light' = dark controls, 'dark' = light controls */
    mode?: 'light' | 'dark'
    align?: 'between' | 'center' | 'center-mobile'
    prevLabel?: string
    nextLabel?: string
  }>(),
  {
    canPrev: true,
    canNext: true,
    mode: 'light',
    align: 'between',
    prevLabel: 'Sebelumnya',
    nextLabel: 'Berikutnya',
  },
)

defineEmits<{ prev: []; next: [] }>()

const pad = (n: number) => String(n).padStart(2, '0')
const progress = computed(() => (props.count ? ((props.index + 1) / props.count) * 100 : 0))
const alignClass = computed(
  () =>
    ({
      between: 'justify-between',
      center: 'justify-center',
      'center-mobile': 'justify-center md:justify-between',
    })[props.align],
)
</script>

<template>
  <div class="slider-controls flex items-center gap-6" :class="[alignClass, { 'is-dark': mode === 'dark' }]">
    <div class="flex gap-2">
      <button type="button" class="slider-control" :aria-label="prevLabel" :disabled="!canPrev" @click="$emit('prev')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button type="button" class="slider-control" :aria-label="nextLabel" :disabled="!canNext" @click="$emit('next')">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-4" aria-hidden="true">
      <span class="text-sm font-medium tabular-nums">{{ pad(index + 1) }}</span>
      <div class="slider-track w-24 sm:w-32 h-0.5 rounded-full overflow-hidden">
        <div class="slider-fill h-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
      </div>
      <span class="slider-total text-sm tabular-nums">{{ pad(count) }}</span>
    </div>

    <p class="sr-only" aria-live="polite">{{ index + 1 }} dari {{ count }}</p>
  </div>
</template>

<style scoped>
.slider-controls {
  --ink: #101111;
  --ink-soft: #7d7d7d;
  --on-ink: #f9f9f9;
  --edge: rgba(16, 17, 17, 0.2);
  --track: rgba(16, 17, 17, 0.15);
  color: var(--ink);
}
.slider-controls.is-dark {
  --ink: #f9f9f9;
  --ink-soft: #bfbfbf;
  --on-ink: #101111;
  --edge: rgba(249, 249, 249, 0.3);
  --track: rgba(249, 249, 249, 0.2);
}

.slider-control {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1px solid var(--edge);
  color: var(--ink);
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, opacity 0.2s;
}
.slider-control:hover:not(:disabled) {
  background-color: var(--ink);
  border-color: var(--ink);
  color: var(--on-ink);
}
.slider-control:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}
.slider-control:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.slider-track {
  background-color: var(--track);
}
.slider-fill {
  background-color: var(--ink);
}
.slider-total {
  color: var(--ink-soft);
}
</style>
