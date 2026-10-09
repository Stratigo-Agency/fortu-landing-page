<template>
  <section class="marien-flow relative overflow-hidden bg-fortu-dark py-16 md:py-28" aria-labelledby="marien-flow-title">
    <div class="mx-auto px-6 md:px-10 xl:px-16 max-w-7xl relative z-10">
      <!-- Header (editable in Sanity: Integrasi Praktis) -->
      <div class="text-center mb-12 md:mb-20">
        <span class="inline-block px-4 py-2 rounded-full bg-fortu-off-white text-fortu-dark font-light text-xs tracking-wide uppercase mb-6">
          {{ content.badge }}
        </span>
        <h2 id="marien-flow-title" class="text-3xl md:text-5xl lg:text-6xl font-light text-fortu-off-white mb-4 md:mb-6 tracking-tight">
          {{ content.line1 }}
          <span class="block mt-1 md:mt-2 text-fortu-light">{{ content.line2 }}</span>
        </h2>
        <p class="text-fortu-light/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {{ content.description }}
        </p>
      </div>

      <!-- Screen-reader summary of the diagram -->
      <p class="sr-only">
        Pengguna mengatur Marien CMS dari satu akun. Marien terhubung ke setiap gedung (Gedung 1, Gedung 2, Gedung 3,
        dan seterusnya), dan setiap gedung berisi produk Fortu seperti {{ productNames }}.
      </p>

      <!-- Desktop: left to right -->
      <div class="hidden md:block relative h-[500px] lg:h-[520px]" aria-hidden="true">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
          <g class="flow-lines" fill="none" stroke-linecap="round">
            <!-- user -> Marien -->
            <path class="flow" d="M15 50 H 22" />
            <!-- Marien -> buildings -->
            <path class="flow" d="M40 50 C 44 50, 44 17, 48 17" />
            <path class="flow" d="M40 50 H 48" />
            <path class="flow" d="M40 50 C 44 50, 44 83, 48 83" />
            <!-- buildings -> products -->
            <path class="flow" d="M64 17 H 69" />
            <path class="flow" d="M64 50 H 69" />
            <path class="flow" d="M64 83 H 69" />
          </g>
        </svg>

        <!-- 1. User -->
        <div class="node absolute left-0 top-1/2 -translate-y-1/2 w-[15%] flex flex-col items-center text-center">
          <div class="icon-tile"><svg viewBox="0 0 24 24" class="w-8 h-8"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></svg></div>
          <p class="node-title">Pengguna</p>
          <p class="node-sub">Satu akun, dari mana saja</p>
        </div>

        <!-- 2. Marien -->
        <div class="node absolute left-[22%] top-1/2 -translate-y-1/2 w-[18%] flex flex-col items-center text-center">
          <div class="hub">
            <span class="hub-ring"></span>
            <svg viewBox="0 0 24 24" class="w-10 h-10 relative"><circle cx="12" cy="12" r="3" /><circle cx="5" cy="6" r="1.6" /><circle cx="19" cy="6" r="1.6" /><circle cx="5" cy="18" r="1.6" /><circle cx="19" cy="18" r="1.6" /><path d="M6.3 7l3.8 3.4M17.7 7l-3.8 3.4M6.3 17l3.8-3.4M17.7 17l-3.8-3.4" /></svg>
          </div>
          <p class="node-title text-xl">Marien CMS</p>
          <p class="node-sub">Pusat kendali semua layar</p>
        </div>

        <!-- 3. Buildings -->
        <div
          v-for="(b, i) in buildings"
          :key="b"
          class="node absolute left-[48%] w-[16%] -translate-y-1/2 flex flex-col items-center text-center"
          :style="{ top: rowTop[i] }"
        >
          <div class="icon-tile small"><svg viewBox="0 0 24 24" class="w-7 h-7"><path d="M5 21V5.5L13 3v18M13 8l6 2v11M3 21h18M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1" /></svg></div>
          <p class="node-title text-base">{{ b }}</p>
        </div>
        <p class="absolute left-[48%] w-[16%] text-center text-fortu-light/60 text-sm top-[96%]">dan seterusnya</p>

        <!-- 4. Fortu products in each building -->
        <div
          v-for="(chips, i) in buildingProducts"
          :key="i"
          class="absolute left-[69%] w-[31%] -translate-y-1/2 flex flex-wrap gap-2"
          :style="{ top: rowTop[i] }"
        >
          <span v-for="p in chips" :key="p" class="chip">
            <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0"><path :d="iconFor(p)" /></svg>
            {{ p }}
          </span>
        </div>
      </div>

      <!-- Mobile: top to bottom -->
      <div class="md:hidden flex flex-col items-center" aria-hidden="true">
        <div class="node flex flex-col items-center text-center">
          <div class="icon-tile"><svg viewBox="0 0 24 24" class="w-8 h-8"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></svg></div>
          <p class="node-title">Pengguna</p>
          <p class="node-sub">Satu akun, dari mana saja</p>
        </div>
        <svg class="v-line" viewBox="0 0 4 56" preserveAspectRatio="none" focusable="false"><path class="flow" d="M2 0 V 56" /></svg>
        <div class="node flex flex-col items-center text-center">
          <div class="hub">
            <span class="hub-ring"></span>
            <svg viewBox="0 0 24 24" class="w-10 h-10 relative"><circle cx="12" cy="12" r="3" /><circle cx="5" cy="6" r="1.6" /><circle cx="19" cy="6" r="1.6" /><circle cx="5" cy="18" r="1.6" /><circle cx="19" cy="18" r="1.6" /><path d="M6.3 7l3.8 3.4M17.7 7l-3.8 3.4M6.3 17l3.8-3.4M17.7 17l-3.8-3.4" /></svg>
          </div>
          <p class="node-title text-xl">Marien CMS</p>
          <p class="node-sub">Pusat kendali semua layar</p>
        </div>
        <svg class="v-line" viewBox="0 0 4 56" preserveAspectRatio="none" focusable="false"><path class="flow" d="M2 0 V 56" /></svg>
        <div class="w-full space-y-4">
          <div v-for="(b, i) in buildings" :key="b" class="rounded-2xl border border-fortu-light/15 bg-fortu-off-white/[0.04] p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-tile small !mb-0"><svg viewBox="0 0 24 24" class="w-6 h-6"><path d="M5 21V5.5L13 3v18M13 8l6 2v11M3 21h18M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1" /></svg></div>
              <p class="node-title text-base !mb-0">{{ b }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="p in buildingProducts[i]" :key="p" class="chip">
                <svg viewBox="0 0 24 24" class="w-4 h-4 flex-shrink-0"><path :d="iconFor(p)" /></svg>
                {{ p }}
              </span>
            </div>
          </div>
          <p class="text-center text-fortu-light/60 text-sm">dan seterusnya</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { CMS_DEMO_QUERY, type CMSDemo } from '@/sanity/queries'

const cmsDemo = ref<CMSDemo | null>(null)

const DEFAULT_PRODUCTS = [
  'Digital Signage',
  'Wallmount Display',
  'Interactive Flat Panel',
  'Videotron',
  'Layar Lift',
  'Smart Mobile Signage',
]

// Copy comes from Sanity (cmsDemo); these are the fallbacks for the new message
const content = computed(() => ({
  badge: cmsDemo.value?.badge || 'Integrasi Praktis',
  line1: cmsDemo.value?.heading?.line1 || 'All Fortu,',
  line2: cmsDemo.value?.heading?.line2 || 'connected by Marien.',
  description:
    cmsDemo.value?.description ||
    'Atur semua layar Fortu di setiap gedung dan cabang dari satu akun Marien, dari mana saja.',
}))

const products = computed(() => {
  const list = (cmsDemo.value?.flowProducts || []).filter(Boolean)
  return list.length >= 3 ? list : DEFAULT_PRODUCTS
})
const productNames = computed(() => products.value.join(', '))

const buildings = ['Gedung 1', 'Gedung 2', 'Gedung 3']
const rowTop = ['17%', '50%', '83%']

// Rotate the list so each building shows a slightly different mix
const buildingProducts = computed(() =>
  buildings.map((_, i) => {
    const p = products.value
    return [0, 1, 2].map((k) => p[(i + k) % p.length])
  }),
)

const iconFor = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('videotron') || n.includes('led'))
    return 'M3 5h18v14H3zM7 9h2M11 9h2M15 9h2M7 13h2M11 13h2M15 13h2'
  if (n.includes('wall')) return 'M3 4v16M3 8h6M3 16h6M9 6h12v10H9zM12 20h6'
  if (n.includes('lift')) return 'M5 3h14v18H5zM12 3v18M8 10l-1.5 2L8 14M16 10l1.5 2L16 14'
  if (n.includes('standing') || n.includes('mobile') || n.includes('signage'))
    return 'M8 3h8v14H8zM12 17v4M8 21h8'
  return 'M3 5h18v11H3zM8 20h8M12 16v4'
}

onMounted(async () => {
  try {
    cmsDemo.value = await client.fetch(CMS_DEMO_QUERY)
  } catch (e) {
    console.error('Failed to fetch Marien flow content:', e)
  }
})
</script>

<style scoped>
.marien-flow svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon-tile {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f9f9f9;
  background: rgba(249, 249, 249, 0.06);
  border: 1px solid rgba(191, 191, 191, 0.22);
  margin-bottom: 12px;
}
.icon-tile.small {
  width: 52px;
  height: 52px;
  border-radius: 14px;
}

.hub {
  position: relative;
  width: 92px;
  height: 92px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #101111;
  background: #f9f9f9;
  margin-bottom: 14px;
}
.hub-ring {
  position: absolute;
  inset: -10px;
  border-radius: 9999px;
  border: 1px solid rgba(249, 249, 249, 0.35);
  animation: pulse 3s ease-out infinite;
}

.node-title {
  color: #f9f9f9;
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 2px;
}
.node-sub {
  color: rgba(191, 191, 191, 0.75);
  font-size: 0.8rem;
  line-height: 1.35;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 0.8rem;
  color: #f9f9f9;
  background: rgba(249, 249, 249, 0.06);
  border: 1px solid rgba(191, 191, 191, 0.22);
  white-space: nowrap;
}

/* Connectors: dashes travel from the user towards the products */
.flow {
  stroke: rgba(191, 191, 191, 0.55);
  stroke-width: 1.6;
  stroke-dasharray: 3 3.5;
  vector-effect: non-scaling-stroke;
  animation: flow 1.4s linear infinite;
}
.v-line {
  width: 4px;
  height: 56px;
  overflow: visible;
}

@keyframes flow {
  to {
    stroke-dashoffset: -13;
  }
}
@keyframes pulse {
  0% {
    transform: scale(0.96);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(1.18);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flow,
  .hub-ring {
    animation: none;
  }
  .hub-ring {
    opacity: 0.4;
  }
}
</style>
