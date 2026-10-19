<template>
  <div class="spec-table">
    <h3 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight mb-6">Spesifikasi lengkap</h3>

    <!-- Phones: one size at a time, picked with large buttons -->
    <div v-if="columns.length > 1" class="md:hidden mb-6">
      <p class="text-base text-fortu-medium mb-3">Pilih ukuran</p>
      <div class="flex flex-wrap gap-2" role="group" aria-label="Pilih ukuran">
        <button
          v-for="(col, i) in columns"
          :key="col"
          type="button"
          class="min-w-[64px] h-12 px-5 rounded-full border text-lg font-medium transition-colors"
          :class="i === active ? 'bg-fortu-dark border-fortu-dark text-fortu-off-white' : 'border-fortu-dark/25 text-fortu-dark'"
          :aria-pressed="i === active ? 'true' : 'false'"
          @click="$emit('select', col)"
        >
          {{ col }}
        </button>
      </div>
    </div>

    <!-- Phones: label above value, for the size picked above -->
    <div v-for="group in visibleGroups" :key="group._key || group.title" class="md:hidden mb-8">
      <h4 class="text-sm uppercase tracking-[0.16em] text-fortu-medium mb-2">{{ group.title }}</h4>
      <dl class="divide-y divide-fortu-dark/10 border-y border-fortu-dark/10">
        <div v-for="row in group.rows" :key="row._key || row.label" class="py-3">
          <dt class="text-base text-fortu-medium">{{ row.label }}</dt>
          <dd class="mt-0.5 text-lg text-fortu-dark leading-snug">
            <SpecValue :value="valueAt(row, active)" />
          </dd>
        </div>
      </dl>
    </div>

    <!-- Tablet and up: one table, every size side by side, the selected size highlighted -->
    <table class="hidden md:table w-full table-fixed border-collapse text-left mb-8">
      <caption class="sr-only">Spesifikasi lengkap per ukuran</caption>
      <colgroup>
        <col class="w-[28%] lg:w-[24%]" />
        <col v-for="col in columns" :key="col" />
      </colgroup>
      <thead v-if="columns.length > 1" class="sticky top-[84px] z-10 bg-white">
        <tr>
          <th scope="col"><span class="sr-only">Spesifikasi</span></th>
          <th v-for="(col, i) in columns" :key="col" scope="col" class="px-4 py-3 font-normal" :class="i === active ? 'bg-fortu-off-white rounded-t-xl' : ''">
            <button
              type="button"
              class="text-lg font-medium underline-offset-4 hover:underline"
              :class="i === active ? 'text-fortu-dark' : 'text-fortu-medium'"
              :aria-pressed="i === active ? 'true' : 'false'"
              @click="$emit('select', col)"
            >
              {{ col }}
            </button>
          </th>
        </tr>
      </thead>
      <tbody v-for="group in visibleGroups" :key="group._key || group.title">
        <tr>
          <th scope="colgroup" :colspan="columns.length + 1" class="pt-8 pb-2 text-sm font-normal uppercase tracking-[0.16em] text-fortu-medium">
            {{ group.title }}
          </th>
        </tr>
        <tr v-for="row in group.rows" :key="row._key || row.label" class="border-t border-fortu-dark/10">
          <th scope="row" class="py-3 pr-4 text-base font-normal text-fortu-medium align-top">{{ row.label }}</th>
          <!-- A value that is the same for every size spans the whole row -->
          <td v-if="isShared(row)" :colspan="columns.length" class="py-3 px-4 text-base lg:text-lg text-fortu-dark leading-snug align-top">
            <SpecValue :value="valueAt(row, 0)" />
          </td>
          <template v-else>
            <td
              v-for="(col, i) in columns"
              :key="col"
              class="py-3 px-4 text-base lg:text-lg text-fortu-dark leading-snug align-top"
              :class="i === active ? 'bg-fortu-off-white' : ''"
            >
              <SpecValue :value="valueAt(row, i)" />
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <button
      v-if="hiddenRows > 0 || expanded"
      type="button"
      class="mt-2 inline-flex items-center gap-2 h-12 px-6 rounded-full border border-fortu-dark text-fortu-dark text-base font-medium hover:bg-fortu-dark hover:text-fortu-off-white transition-colors"
      :aria-expanded="expanded ? 'true' : 'false'"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Tampilkan lebih sedikit' : `Lihat semua spesifikasi (${hiddenRows} lagi)` }}
    </button>

    <p v-if="table.note" class="mt-6 text-sm text-fortu-medium">{{ table.note }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref } from 'vue'
import type { ProductSpecRow, ProductSpecTable } from '@/sanity/queries'
import { sizeKey } from '@/utils/size'

const props = defineProps<{
  table: ProductSpecTable
  /** Name of the selected variant (e.g. 55"); its column is highlighted */
  selected?: string
}>()
defineEmits<{ select: [column: string] }>()

// Long sheets start with the first groups only (up to about this many rows)
const INITIAL_ROWS = 14

const columns = computed(() => (props.table.columns?.length ? props.table.columns : ['']))
const groups = computed(() => (props.table.groups || []).filter((g) => g.rows?.length))

const active = computed(() => {
  if (!props.selected) return 0
  const i = columns.value.findIndex((c) => sizeKey(c) === sizeKey(props.selected as string))
  return i < 0 ? 0 : i
})

const expanded = ref(false)
const initialGroupCount = computed(() => {
  let rows = 0
  let count = 0
  for (const g of groups.value) {
    if (count > 0 && rows + (g.rows?.length || 0) > INITIAL_ROWS) break
    rows += g.rows?.length || 0
    count++
  }
  return count
})
const visibleGroups = computed(() => (expanded.value ? groups.value : groups.value.slice(0, initialGroupCount.value)))
const hiddenRows = computed(() =>
  expanded.value ? 0 : groups.value.slice(initialGroupCount.value).reduce((n, g) => n + (g.rows?.length || 0), 0),
)

const valueAt = (row: ProductSpecRow, i: number) => {
  const values = row.values || []
  return (values.length === 1 ? values[0] : values[i])?.trim() || ''
}
const isShared = (row: ProductSpecRow) => {
  const values = row.values || []
  return values.length <= 1 || values.every((v) => v.trim() === values[0].trim())
}

// "-" or an empty cell means "not available for this size"
const SpecValue = defineComponent({
  props: { value: { type: String, default: '' } },
  setup: (p) => () =>
    !p.value || p.value === '-'
      ? [h('span', { 'aria-hidden': 'true', class: 'text-fortu-medium' }, '—'), h('span', { class: 'sr-only' }, 'Tidak tersedia')]
      : p.value,
})
</script>
