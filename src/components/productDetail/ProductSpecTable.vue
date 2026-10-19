<template>
  <div class="spec-table">
    <h3 class="text-2xl md:text-3xl font-medium text-fortu-dark tracking-tight mb-6">Productsheet</h3>

    <!-- Phones: one size at a time, picked with large buttons (independent of the size picked in the hero) -->
    <div v-if="columns.length > 1" class="md:hidden mb-6">
      <p class="text-base text-fortu-medium mb-3">Pilih ukuran</p>
      <div class="flex flex-wrap gap-2" role="group" aria-label="Pilih ukuran">
        <button
          v-for="(col, i) in columns"
          :key="col"
          type="button"
          class="min-w-[64px] h-12 px-5 rounded-full border text-lg font-medium transition-colors"
          :class="i === phoneIndex ? 'bg-fortu-dark border-fortu-dark text-fortu-off-white' : 'border-fortu-dark/25 text-fortu-dark'"
          :aria-pressed="i === phoneIndex ? 'true' : 'false'"
          @click="phoneIndex = i"
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
            <SpecValue :value="valueAt(row, phoneIndex)" />
          </dd>
        </div>
      </dl>
    </div>

    <!-- Tablet and up: one table, every size side by side. Neighbouring sizes with the same value share one
         merged, centred cell (like "merge and centre" in a spreadsheet), so no cell is left empty. -->
    <table class="hidden md:table w-full table-fixed border-collapse text-left mb-8">
      <caption class="sr-only">Productsheet per ukuran</caption>
      <colgroup>
        <col class="w-[28%] lg:w-[24%]" />
        <col v-for="col in columns" :key="col" />
      </colgroup>
      <thead v-if="columns.length > 1" class="sticky top-[84px] z-10 bg-white">
        <tr>
          <th scope="col"><span class="sr-only">Spesifikasi</span></th>
          <th
            v-for="(col, i) in columns"
            :key="col"
            scope="col"
            class="px-4 py-3 text-center text-lg font-medium text-fortu-dark"
            :class="i > 0 ? 'border-l border-fortu-dark/10' : ''"
          >
            {{ col }}
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
          <td
            v-for="(cell, ci) in cellsOf(row)"
            :key="ci"
            :colspan="cell.span"
            class="py-3 px-4 text-center text-base lg:text-lg text-fortu-dark leading-snug align-middle"
            :class="cell.start > 0 ? 'border-l border-fortu-dark/10' : ''"
          >
            <SpecValue :value="cell.value" />
          </td>
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

const props = defineProps<{
  table: ProductSpecTable
}>()

// Long sheets start with the first groups only (up to about this many rows)
const INITIAL_ROWS = 14

const columns = computed(() => (props.table.columns?.length ? props.table.columns : ['']))
const groups = computed(() => (props.table.groups || []).filter((g) => g.rows?.length))

// The phone layout shows one size; it starts on the first and does not follow the hero's size picker
const phoneIndex = ref(0)

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

// Neighbouring sizes with the same value become one cell spanning them (a single value spans every size)
interface Cell {
  value: string
  start: number
  span: number
}
const cellsOf = (row: ProductSpecRow): Cell[] => {
  const cells: Cell[] = []
  for (let i = 0; i < columns.value.length; i++) {
    const value = valueAt(row, i)
    const last = cells[cells.length - 1]
    if (last && last.value === value) last.span++
    else cells.push({ value, start: i, span: 1 })
  }
  return cells
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
