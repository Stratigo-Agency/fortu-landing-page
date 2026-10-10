<template>
  <section
    v-if="compare && !loading"
    class="compare-section py-16 md:py-24"
    :class="isLight ? 'bg-fortu-off-white' : 'bg-fortu-dark'"
  >
    <div class="mx-auto px-4 md:px-16">
      <!-- Section Header -->
      <div v-if="compare.heading || compare.subheading" class="text-center mb-8 md:mb-16">
        <h2 v-if="compare.heading" class="text-3xl md:text-7xl font-medium mb-4 tracking-tight" :class="th.title">
          {{ compare.heading }}
        </h2>
        <p v-if="compare.subheading" class="text-lg" :class="th.sub">
          {{ compare.subheading }}
        </p>
      </div>

      <!-- Phones and tablets: two products side by side -->
      <div class="cmp-fade lg:hidden">
        <div v-if="columns.length > 2" class="flex flex-col gap-3 mb-8 max-w-md mx-auto">
          <p class="text-center text-base" :class="th.sub">Bandingkan dua produk</p>
          <div v-for="slot in [0, 1]" :key="slot" class="select-wrap">
            <select
              v-model.number="mobileSelection[slot]"
              :aria-label="`Produk ${slot + 1}`"
              class="w-full h-[52px] pl-4 pr-10 rounded-xl text-base font-medium appearance-none cursor-pointer"
              :class="th.select"
            >
              <option
                v-for="(c, idx) in columns"
                :key="c.id"
                :value="idx"
                :disabled="idx === mobileSelection[slot === 0 ? 1 : 0]"
              >
                {{ c.name }}{{ c.soon ? ' (segera)' : '' }}
              </option>
            </select>
          </div>
        </div>

        <table class="w-full table-fixed border-collapse">
          <caption class="sr-only">Perbandingan dua produk Fortu</caption>
          <thead>
            <tr>
              <th v-for="c in mobileCols" :key="c.id" scope="col" class="px-1.5 pb-6 align-top font-normal">
                <div class="pimg h-[150px] mb-3" :class="[th.panel, { 'is-soon': c.soon }]">
                  <img v-if="c.image" :src="c.image" :alt="c.name" loading="lazy" decoding="async" width="320" height="320" />
                  <img v-else-if="c.soon" src="/products/videotron.svg" :alt="`${c.name}, segera hadir`" loading="lazy" width="320" height="240" class="soon-art" />
                </div>
                <p class="text-center text-[17px] font-medium leading-tight min-h-[2.6rem]" :class="th.title">{{ c.name }}</p>
                <div class="mt-3 text-center">
                  <Button v-if="!c.soon && c.slug" :to="`/products/${c.slug}`" :variant="th.cta" size="md" class="!px-4 !py-3 !text-sm">
                    {{ c.cta }}
                  </Button>
                  <span v-else class="soon-pill !h-11 !px-4 !text-sm" :class="th.pill">Segera hadir</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody v-for="r in mobileRows" :key="r.key">
            <tr>
              <th scope="rowgroup" colspan="2" class="border-t pt-4 pb-2 text-center text-xs font-normal uppercase tracking-[0.14em]" :class="[th.line, th.rowLabel]">
                {{ r.label }}
              </th>
            </tr>
            <tr>
              <td v-for="i in mobileIdx" :key="i" class="px-1.5 pb-4 text-center text-base leading-snug" :class="r.cells[i] ? th.value : th.na">
                <template v-if="r.cells[i]">{{ r.cells[i] }}</template>
                <template v-else><span aria-hidden="true">—</span><span class="sr-only">Tidak tersedia</span></template>
              </td>
            </tr>
          </tbody>
          <tbody v-if="mobileExtras">
            <tr>
              <th scope="rowgroup" colspan="2" class="border-t pt-4 pb-2 text-center text-xs font-normal uppercase tracking-[0.14em]" :class="[th.line, th.rowLabel]">
                Fitur lain
              </th>
            </tr>
            <tr>
              <td v-for="i in mobileIdx" :key="i" class="px-1.5 pb-4 text-center text-[15px] leading-snug" :class="extraCells[i].length ? th.value : th.na">
                <template v-if="extraCells[i].length">{{ extraCells[i].join(', ') }}</template>
                <template v-else><span aria-hidden="true">—</span><span class="sr-only">Tidak tersedia</span></template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Desktop: every product in one table, spec rows lined up across the columns -->
      <table class="cmp-fade hidden lg:table w-full table-fixed border-collapse">
        <caption class="sr-only">Perbandingan produk Fortu</caption>
        <colgroup>
          <col class="w-[150px] xl:w-[188px]" />
          <col v-for="c in columns" :key="c.id" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" class="p-0"><span class="sr-only">Spesifikasi</span></th>
            <th v-for="c in columns" :key="c.id" scope="col" class="px-2.5 pb-7 align-top font-normal">
              <div class="pimg h-[190px] xl:h-[210px] mb-5" :class="[th.panel, { 'is-soon': c.soon }]">
                <img v-if="c.image" :src="c.image" :alt="c.name" loading="lazy" decoding="async" width="560" height="560" />
                <img v-else-if="c.soon" src="/products/videotron.svg" :alt="`${c.name}, segera hadir`" loading="lazy" width="560" height="420" class="soon-art" />
              </div>
              <p class="text-center text-xl xl:text-[22px] font-medium leading-tight tracking-tight min-h-[3.1rem]" :class="th.title">
                {{ c.name }}
              </p>
              <div class="mt-3.5 text-center">
                <Button v-if="!c.soon && c.slug" :to="`/products/${c.slug}`" :variant="th.cta" size="md">
                  {{ c.cta }}
                </Button>
                <span v-else class="soon-pill" :class="th.pill">Segera hadir</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.key">
            <th scope="row" class="border-t py-5 pr-3 text-left text-base xl:text-lg font-normal" :class="[th.line, th.rowLabel]">
              {{ r.label }}
            </th>
            <td v-for="(cell, i) in r.cells" :key="i" class="border-t px-3 py-5 text-center text-base xl:text-lg leading-snug" :class="[th.line, cell ? th.value : th.na]">
              <template v-if="cell">{{ cell }}</template>
              <template v-else><span aria-hidden="true">—</span><span class="sr-only">Tidak tersedia</span></template>
            </td>
          </tr>
          <tr v-if="hasExtras">
            <th scope="row" class="border-t py-5 pr-3 text-left text-base xl:text-lg font-normal" :class="[th.line, th.rowLabel]">Fitur lain</th>
            <td v-for="(list, i) in extraCells" :key="i" class="border-t px-3 py-5 text-center text-[15px] xl:text-base leading-snug" :class="[th.line, list.length ? th.value : th.na]">
              <template v-if="list.length">{{ list.join(', ') }}</template>
              <template v-else><span aria-hidden="true">—</span><span class="sr-only">Tidak tersedia</span></template>
            </td>
          </tr>
        </tbody>
      </table>

      <RouterLink
        to="/products"
        class="inline-block mx-auto mt-14 md:mt-20 w-full text-center text-base font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
        :class="th.link"
      >
        Lihat Semua Produk
      </RouterLink>
    </div>
  </section>

  <!-- Loading State -->
  <section v-else-if="loading" class="py-24 bg-fortu-dark">
    <div class="flex justify-center">
      <div class="w-8 h-8 border-2 border-fortu-off-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { client, urlFor } from '@/sanity/client'
import { PRODUCT_COMPARE_QUERY, type ProductCompare, type ProductCompareItem, type ProductSpec } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import Button from '@/reusables/Button.vue'

const compare = ref<ProductCompare | null>(null)
const loading = ref(true)

// Four products fit side by side from 1280px; phones compare two at a time
const MAX_COLUMNS = 4
const mobileSelection = ref<number[]>([0, 1])

const isLight = computed(() => compare.value?.backgroundColor === 'light')

// Colour classes for the light and dark section backgrounds
const th = computed(() =>
  isLight.value
    ? {
        title: 'text-fortu-dark',
        sub: 'text-fortu-medium',
        rowLabel: 'text-fortu-medium',
        value: 'text-fortu-dark',
        na: 'text-fortu-medium',
        line: 'border-fortu-dark/15',
        cta: 'primary' as const,
        pill: 'border-fortu-dark/30 text-fortu-medium',
        select: 'bg-white border border-fortu-light/50 text-fortu-dark',
        panel: 'pimg-light',
        link: 'text-fortu-dark',
      }
    : {
        title: 'text-fortu-off-white',
        sub: 'text-fortu-light',
        rowLabel: 'text-fortu-light',
        value: 'text-fortu-off-white',
        na: 'text-fortu-medium',
        line: 'border-fortu-light/20',
        cta: 'inverted' as const,
        pill: 'border-fortu-light/45 text-fortu-light',
        select: 'bg-fortu-medium/20 border border-fortu-medium/30 text-fortu-off-white',
        panel: 'pimg-dark',
        link: 'text-fortu-off-white',
      },
)

interface Column {
  id: string
  name: string
  slug: string | null
  soon: boolean
  image: string | null
  cta: string
  all: ProductSpec[]
  specs: Map<string, ProductSpec>
}

const norm = (s: string) => s.trim().toLowerCase()

const imageOf = (item: ProductCompareItem): string | null => {
  // Priority 1: the image picked for the comparison; priority 2: the first product image
  const source = item.compareImage?.asset ? item.compareImage.asset : item.product?.images?.[0]?.asset
  if (!source) return null
  try {
    const builder = urlFor(source).width(640).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return source.url || null
  }
}

const columns = computed<Column[]>(() =>
  (compare.value?.products || [])
    .filter((item) => item.product)
    .slice(0, MAX_COLUMNS)
    .map((item) => {
      const all = item.product.specs || []
      return {
        id: item.product._id,
        name: item.product.name,
        slug: item.product.slug?.current || null,
        soon: item.product.status === 'coming_soon',
        image: imageOf(item),
        cta: item.ctaLabel || 'Pelajari Lebih Lanjut',
        all,
        specs: new Map(all.map((s) => [norm(s.label), s])),
      }
    }),
)

// A spec that has a label but no value (e.g. "Audio Stereo") is simply "yes"
const cellOf = (spec?: ProductSpec): string | null => (spec ? spec.value?.trim() || '✓' : null)

/**
 * Rows of the comparison: the specs that at least two products have (in the order they first
 * appear), so every row lines up across the columns. Everything else goes into "Fitur lain".
 */
const rows = computed(() => {
  const cols = columns.value
  const need = Math.min(2, cols.filter((c) => c.all.length).length)
  if (!need) return []
  const seen = new Map<string, { label: string; count: number }>()
  for (const c of cols) {
    for (const s of c.all) {
      const key = norm(s.label)
      const entry = seen.get(key) || { label: s.label, count: 0 }
      entry.count++
      seen.set(key, entry)
    }
  }
  return [...seen.entries()]
    .filter(([, entry]) => entry.count >= need)
    .map(([key, entry]) => ({ key, label: entry.label, cells: cols.map((c) => cellOf(c.specs.get(key))) }))
})

const extraCells = computed(() => {
  const common = new Set(rows.value.map((r) => r.key))
  return columns.value.map((c) =>
    c.all.filter((s) => !common.has(norm(s.label))).map((s) => (s.value ? `${s.label}: ${s.value}` : s.label)),
  )
})
const hasExtras = computed(() => extraCells.value.some((list) => list.length))

// Phones: the two chosen products (or all of them when there are only two)
const mobileIdx = computed(() =>
  columns.value.length <= 2 ? columns.value.map((_, i) => i) : mobileSelection.value.filter((i) => columns.value[i]),
)
const mobileCols = computed(() => mobileIdx.value.map((i) => columns.value[i]))
const mobileRows = computed(() => rows.value.filter((r) => mobileIdx.value.some((i) => r.cells[i])))
const mobileExtras = computed(() => mobileIdx.value.some((i) => extraCells.value[i]?.length))

onMounted(async () => {
  try {
    compare.value = await client.fetch(PRODUCT_COMPARE_QUERY)
  } catch (e) {
    console.error('Failed to fetch product comparison:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.cmp-fade {
  animation: fadeIn 0.6s ease-out both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.pimg {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
}
.pimg img {
  max-width: 84%;
  max-height: 84%;
  object-fit: contain;
}
.pimg-dark {
  background: radial-gradient(circle at 50% 38%, rgba(249, 249, 249, 0.12), rgba(249, 249, 249, 0.03));
}
.pimg-light {
  background: radial-gradient(circle at 50% 38%, rgba(16, 17, 17, 0.07), rgba(16, 17, 17, 0.02));
}
.pimg.is-soon {
  border: 1px dashed rgba(125, 125, 125, 0.55);
}
.pimg .soon-art {
  max-width: 78%;
}

.soon-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 24px;
  border-radius: 9999px;
  border-width: 1px;
  border-style: solid;
  font-size: 1rem;
}

.select-wrap {
  position: relative;
}
.select-wrap::after {
  content: '';
  position: absolute;
  right: 18px;
  top: 50%;
  width: 8px;
  height: 8px;
  margin-top: -6px;
  border-right: 2px solid #bfbfbf;
  border-bottom: 2px solid #bfbfbf;
  transform: rotate(45deg);
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .cmp-fade {
    animation: none;
  }
}
</style>
