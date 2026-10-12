<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Small label above the title */
    eyebrow?: string
    title: string
    description?: string
    /** id of the title, for `aria-labelledby` on the section */
    titleId?: string
    /** `light` = thin display weight (large home sections), `medium` = regular heading */
    weight?: 'light' | 'medium'
    align?: 'center' | 'left'
  }>(),
  { weight: 'medium', align: 'center' },
)
</script>

<template>
  <div :class="align === 'center' ? 'text-center' : 'text-left'">
    <p v-if="eyebrow" class="text-xs md:text-sm uppercase tracking-[0.2em] text-fortu-medium mb-3">{{ eyebrow }}</p>
    <h2
      :id="titleId"
      class="tracking-tight text-fortu-dark"
      :class="weight === 'light' ? 'text-4xl md:text-5xl lg:text-6xl font-light' : 'text-3xl md:text-5xl font-medium'"
    >
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-4 text-fortu-medium text-base md:text-lg max-w-2xl"
      :class="align === 'center' ? 'mx-auto' : ''"
    >
      {{ description }}
    </p>
  </div>
</template>
