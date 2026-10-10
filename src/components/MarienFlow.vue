<template>
  <section class="marien-flow relative overflow-hidden bg-fortu-dark py-16 md:py-28" aria-labelledby="marien-flow-title">
    <div class="mx-auto px-6 md:px-10 xl:px-16 max-w-7xl relative z-10">
      <!-- Header (editable in Sanity: Integrasi Praktis) -->
      <div class="text-center mb-12 md:mb-16">
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

      <!-- Desktop: circuit traces from the user, through Marien, to every building and its products.
           Drawn at 1152px and scaled to fit, so the elbows keep their exact shape. -->
      <div ref="deskWrap" class="hidden lg:block" :style="{ height: `${DESK_H * deskScale}px` }" aria-hidden="true">
        <div class="diagram" :style="{ width: `${DESK_W}px`, height: `${DESK_H}px`, transform: `scale(${deskScale})` }">
          <div class="grid-bg"></div>

          <!-- traces -->
          <div class="hl" style="left: 88px; top: 289px; width: 180px"></div>
          <div class="hl" style="left: 436px; top: 289px; width: 164px"></div>
          <div class="cr cr-top" style="left: 519px; top: 89px; width: 81px; height: 22px"></div>
          <div class="vl" style="left: 519px; top: 111px; height: 358px"></div>
          <div class="cr cr-bottom" style="left: 519px; top: 469px; width: 81px; height: 22px"></div>
          <div class="hl" style="left: 541px; top: 89px; width: 59px"></div>
          <div class="hl" style="left: 541px; top: 489px; width: 59px"></div>
          <div class="junction" style="left: 515px; top: 285px"></div>
          <div
            v-for="(b, i) in buildings"
            :key="`trace-${b}`"
            class="hl"
            :style="{ left: '832px', top: `${rowY(i) - 1}px`, width: '52px' }"
          ></div>

          <!-- 1. user -->
          <div class="user" style="left: 0; top: 246px; width: 88px; height: 88px">
            <svg viewBox="0 0 24 24" class="w-10 h-10"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></svg>
          </div>
          <p class="label" style="left: -16px; top: 346px; width: 120px; font-size: 20px">Pengguna</p>

          <!-- 2. Marien -->
          <div class="chip" style="left: 268px; top: 206px; width: 168px; height: 168px">
            <span class="ring" style="left: -16px; top: -16px; width: 200px; height: 200px; border-radius: 54px"></span>
            <template v-for="p in PINS" :key="`pin-${p}`">
              <span class="pin" :style="{ left: '-10px', top: `${p}px`, width: '10px', height: '4px' }"></span>
              <span class="pin" :style="{ right: '-10px', top: `${p}px`, width: '10px', height: '4px' }"></span>
              <span class="pin" :style="{ top: '-10px', left: `${p}px`, width: '4px', height: '10px' }"></span>
              <span class="pin" :style="{ bottom: '-10px', left: `${p}px`, width: '4px', height: '10px' }"></span>
            </template>
            <img src="/marien-icon.png" alt="" width="96" height="75" class="relative" />
          </div>
          <p class="label" style="left: 222px; top: 398px; width: 260px; font-size: 24px">Marien CMS</p>

          <!-- 3. buildings -->
          <div
            v-for="(b, i) in buildings"
            :key="b"
            class="node"
            :style="{ left: '600px', top: `${rowY(i) - 56}px`, width: '232px', height: '112px', gap: '16px', padding: '0 22px' }"
          >
            <span class="ico" style="width: 54px; height: 54px; border-radius: 16px">
              <svg viewBox="0 0 24 24" class="w-[30px] h-[30px]"><path :d="BUILDING_ICON" /></svg>
            </span>
            <span class="font-medium tracking-tight" style="font-size: 24px">{{ b }}</span>
          </div>
          <p class="more" style="left: 600px; top: 558px">dan seterusnya</p>

          <!-- 4. Fortu products in each building -->
          <template v-for="(chips, i) in buildingProducts" :key="`prod-${i}`">
            <span
              v-for="(p, k) in chips"
              :key="p"
              class="tile"
              :style="{ left: `${884 + k * 76}px`, top: `${rowY(i) - 32}px` }"
            >
              <svg viewBox="0 0 24 24" class="w-[30px] h-[30px]"><path :d="iconFor(p)" /></svg>
            </span>
          </template>
        </div>
      </div>

      <!-- Phones and tablets: one line from the user into Marien, then it fans out to three buildings.
           Drawn at 350px and scaled to fit. -->
      <div ref="mobWrap" class="lg:hidden" aria-hidden="true">
        <div class="mx-auto" :style="{ width: `${MOB_W * mobScale}px`, height: `${MOB_H * mobScale}px` }">
          <div class="diagram" :style="{ width: `${MOB_W}px`, height: `${MOB_H}px`, transform: `scale(${mobScale})` }">
            <div class="orbit" style="left: 65px; top: 104px; width: 220px; height: 220px"></div>
            <div class="orbit dashed" style="left: 105px; top: 144px; width: 140px; height: 140px"></div>

            <!-- traces -->
            <div class="vl" style="left: 174px; top: 104px; height: 60px"></div>
            <div class="hl" style="left: 143px; top: 262px; width: 165px; transform: rotate(123.5deg)"></div>
            <div class="vl" style="left: 174px; top: 272px; height: 128px"></div>
            <div class="hl" style="left: 207px; top: 262px; width: 165px; transform: rotate(56.5deg)"></div>
            <div
              v-for="(cx, i) in MOB_CX"
              :key="`down-${i}`"
              class="vl"
              :style="{ left: `${cx - 1}px`, top: '484px', height: '160px' }"
            ></div>

            <!-- 1. user -->
            <div class="user" style="left: 143px; top: 0; width: 64px; height: 64px">
              <svg viewBox="0 0 24 24" class="w-[30px] h-[30px]"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></svg>
            </div>
            <p class="label" style="left: 75px; top: 72px; width: 200px; font-size: 20px">Pengguna</p>

            <!-- 2. Marien -->
            <div class="chip round" style="left: 125px; top: 164px; width: 100px; height: 100px">
              <span class="ring" style="left: -9px; top: -9px; width: 118px; height: 118px; border-radius: 9999px"></span>
              <img src="/marien-icon.png" alt="" width="62" height="49" class="relative" />
            </div>
            <p class="label tag" style="left: 232px; top: 203px; font-size: 17px">Marien CMS</p>

            <!-- 3. buildings, 4. their products -->
            <template v-for="(b, i) in buildings" :key="b">
              <div class="node col" :style="{ left: `${MOB_CX[i] - 52}px`, top: '400px', width: '104px', height: '84px' }">
                <svg viewBox="0 0 24 24" class="w-[26px] h-[26px]"><path :d="BUILDING_ICON" /></svg>
                <span class="font-medium" style="font-size: 17px">{{ b }}</span>
              </div>
              <span
                v-for="(p, k) in buildingProducts[i]"
                :key="p"
                class="tile small"
                :style="{ left: `${MOB_CX[i] - 22}px`, top: `${508 + k * 52}px` }"
              >
                <svg viewBox="0 0 24 24" class="w-6 h-6"><path :d="iconFor(p)" /></svg>
              </span>
            </template>
            <p class="more" style="left: 0; top: 690px; width: 350px; text-align: center">dan seterusnya</p>
          </div>
        </div>
      </div>

      <!-- Which product each icon stands for -->
      <ul class="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px] text-fortu-light" aria-hidden="true">
        <li v-for="p in usedProducts" :key="p" class="inline-flex items-center gap-2.5">
          <svg viewBox="0 0 24 24" class="legend-icon"><path :d="iconFor(p)" /></svg>
          {{ p }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { CMS_DEMO_QUERY, type CMSDemo } from '@/sanity/queries'
import { useFitScale } from '@/composables/useFitScale'

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

// Rotate the list so each building shows a slightly different mix
const buildingProducts = computed(() =>
  buildings.map((_, i) => {
    const p = products.value
    return [0, 1, 2].map((k) => p[(i + k) % p.length])
  }),
)
const usedProducts = computed(() => [...new Set(buildingProducts.value.flat())])

// Both diagrams are drawn at a fixed size (px) and scaled to the width they are given
const DESK_W = 1152
const DESK_H = 584
const MOB_W = 350
const MOB_H = 720
const deskWrap = ref<HTMLElement | null>(null)
const mobWrap = ref<HTMLElement | null>(null)
const deskScale = useFitScale(deskWrap, DESK_W, 1)
const mobScale = useFitScale(mobWrap, MOB_W, 1.35)

const rowY = (i: number) => 90 + i * 200 // desktop: centre line of each building row
const MOB_CX = [52, 175, 298] // phones: centre of each building column
const PINS = [40, 82, 124] // contact pins along each side of the Marien chip

const BUILDING_ICON = 'M5 21V5.5L13 3v18M13 8l6 2v11M3 21h18M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1'

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

.diagram {
  position: relative;
  transform-origin: 0 0;
  color: #f9f9f9;
}
.diagram > * {
  position: absolute;
}

.grid-bg {
  inset: 0;
  background-image: radial-gradient(rgba(249, 249, 249, 0.12) 1.2px, transparent 1.5px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(ellipse at 45% 50%, #000 35%, transparent 80%);
  mask-image: radial-gradient(ellipse at 45% 50%, #000 35%, transparent 80%);
}

/* Traces: a dim line with bright dashes travelling along it (data flowing) */
.hl,
.vl {
  background-repeat: repeat-x, no-repeat;
}
.hl {
  height: 2px;
  transform-origin: 0 50%;
  background-image: repeating-linear-gradient(90deg, #f9f9f9 0 5px, transparent 5px 15px),
    linear-gradient(rgba(191, 191, 191, 0.28), rgba(191, 191, 191, 0.28));
  background-size: 15px 2px, 100% 100%;
  animation: flow-x 1.2s linear infinite;
}
.vl {
  width: 2px;
  background-image: repeating-linear-gradient(180deg, #f9f9f9 0 5px, transparent 5px 15px),
    linear-gradient(rgba(191, 191, 191, 0.28), rgba(191, 191, 191, 0.28));
  background-size: 2px 15px, 100% 100%;
  background-repeat: repeat-y, no-repeat;
  animation: flow-y 1.2s linear infinite;
}
.cr {
  border: 0 solid rgba(191, 191, 191, 0.28);
}
.cr-top {
  border-left-width: 2px;
  border-top-width: 2px;
  border-top-left-radius: 20px;
}
.cr-bottom {
  border-left-width: 2px;
  border-bottom-width: 2px;
  border-bottom-left-radius: 20px;
}
.junction {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: #f9f9f9;
}

.user {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 1.5px solid rgba(191, 191, 191, 0.45);
  background: rgba(249, 249, 249, 0.05);
}
.label {
  text-align: center;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #f9f9f9;
  white-space: nowrap;
}
.label.tag {
  background: #101111;
  padding: 2px 6px;
}
.more {
  font-size: 15px;
  color: rgba(191, 191, 191, 0.7);
}

.chip {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 38px;
  background: #f9f9f9;
  color: #101111;
}
.chip.round {
  border-radius: 9999px;
}
.pin {
  position: absolute;
  background: rgba(249, 249, 249, 0.5);
  border-radius: 2px;
}
.ring {
  position: absolute;
  border: 1px solid rgba(249, 249, 249, 0.35);
  animation: pulse 3s ease-out infinite;
}
.orbit {
  border-radius: 9999px;
  border: 1px solid rgba(191, 191, 191, 0.16);
}
.orbit.dashed {
  border-style: dashed;
}

.node {
  display: flex;
  align-items: center;
  border-radius: 22px;
  background: #161717;
  border: 1px solid rgba(191, 191, 191, 0.25);
}
.node.col {
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  border-radius: 18px;
}
.ico {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(249, 249, 249, 0.08);
}
.tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  border: 1px solid rgba(191, 191, 191, 0.3);
  background: #161717;
}
.tile.small {
  width: 44px;
  height: 44px;
  border-radius: 14px;
}
.legend-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

@keyframes flow-x {
  to {
    background-position: 15px 0, 0 0;
  }
}
@keyframes flow-y {
  to {
    background-position: 0 15px, 0 0;
  }
}
@keyframes pulse {
  0% {
    transform: scale(0.94);
    opacity: 0.8;
  }
  70%,
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hl,
  .vl,
  .ring {
    animation: none;
  }
  .ring {
    opacity: 0.4;
  }
}
</style>
