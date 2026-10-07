<template>
  <section v-if="cmsDemo && !loading" class="cms-demo-section md:min-h-dvh relative overflow-hidden pt-0 md:pb-32 bg-fortu-dark">
    <!-- Grid pattern overlay -->

    <div class="cms-demo-inner py-16 md:py-24 mx-auto px-6 relative z-10">
      <!-- Section header -->
      <div class="cms-demo-header text-center mb-10 md:mb-20">
        <span class="inline-block px-4 py-2 rounded-full bg-fortu-off-white border text-fortu-dark font-light text-xs md:text-md tracking-wide uppercase mb-6">
          {{ cmsDemo.badge }}
        </span>
        <h2 class="text-3xl md:text-5xl lg:text-6xl font-light text-fortu-off-white mb-4 md:mb-6 tracking-tight">
          {{ cmsDemo.heading.line1 }}
          <span class="block mt-1 md:mt-2 text-fortu-light">
            {{ cmsDemo.heading.line2 }}
          </span>
        </h2>
        <p class="text-fortu-medium text-md md:text-lg max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
          {{ cmsDemo.description }}
        </p>
      </div>

      <!-- Main visualization container -->
      <div ref="stageRef" class="visualization-stage relative max-w-6xl mx-auto h-[300px] mt-32 md:mt-48 md:h-[780px] flex items-center justify-center">

        <!-- Connection lines: geometry is measured from the real card / laptop
             boxes every frame, so they stay attached at any viewport width -->
        <svg class="connection-svg" aria-hidden="true" focusable="false">
          <g v-for="conn in connectors" :key="conn.id">
            <path
              :d="conn.d"
              fill="none"
              stroke="rgba(191, 191, 191, 0.4)"
              stroke-width="2"
              stroke-dasharray="6 6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              class="conn-dot"
              :cx="conn.dotX"
              :cy="conn.dotY"
              :r="dotRadius"
              :opacity="conn.dotOpacity"
              fill="#F9F9F9"
            />
          </g>
        </svg>
        
        <!-- Product cards converging -->
        <!-- Product 1 - Top Left -->
        <div v-if="getProductByPosition('top-left')" class="product-card product-1 absolute top-0 left-2 md:left-12 lg:left-24 z-30">
          <div class="relative group">
            <div ref="cardTopLeft" class="relative z-20 w-28 md:w-56 bg-gradient-to-br from-fortu-off-white/10 to-fortu-off-white/5 backdrop-blur-xl rounded-md md:rounded-lg border border-fortu-light/10 p-2 md:p-4 transform transition-all duration-700 hover:scale-105 hover:border-fortu-light/30">
              <div class="aspect-square rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-4 bg-fortu-dark">
                <img 
                  v-if="getProductImage('top-left')"
                  :src="getProductImage('top-left')" 
                  :alt="getProductName('top-left')"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div class="space-y-1 md:space-y-2">
                <div class="flex items-center gap-1 md:gap-2">
                  <div class="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[green] animate-pulse"></div>
                  <span class="text-[10px] md:text-xs text-fortu-light uppercase tracking-wider">Perangkat Terhubung</span>
                </div>
                <p class="text-fortu-off-white font-medium text-xs md:text-base truncate">{{ getProductName('top-left') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Product 2 - Top Right -->
        <div v-if="getProductByPosition('top-right')" class="product-card product-2 absolute top-0 right-2 md:right-12 lg:right-24 z-30">
          <div class="relative group">
            <div ref="cardTopRight"  class="relative z-20 w-28 md:w-56 bg-gradient-to-br from-fortu-off-white/10 to-fortu-off-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl border border-fortu-light/10 p-2 md:p-4 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:border-fortu-light/30">
              <div class="aspect-square rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-4 bg-fortu-dark">
                <img 
                  v-if="getProductImage('top-right')"
                  :src="getProductImage('top-right')" 
                  :alt="getProductName('top-right')"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div class="space-y-1 md:space-y-2">
                <div class="flex items-center gap-1 md:gap-2">
                  <div class="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[green] animate-pulse"></div>
                  <span class="text-[10px] md:text-xs text-fortu-light uppercase tracking-wider">Perangkat Terhubung</span>
                </div>
                <p class="text-fortu-off-white font-medium text-xs md:text-base truncate">{{ getProductName('top-right') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Product 3 - Bottom Center -->
        <div v-if="getProductByPosition('bottom-center')" class="product-card product-3 absolute top-[-80px] md:top-[-150px] left-1/2 z-30">
          <div class="relative group">
            <div ref="cardBottomCenter"  class="relative z-20 w-28 md:w-56 bg-gradient-to-br from-fortu-off-white/10 to-fortu-off-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl border border-fortu-light/10 p-2 md:p-4 shadow-2xl transform transition-all duration-700 hover:scale-105 hover:border-fortu-light/30">
              <div class="aspect-square rounded-lg md:rounded-xl overflow-hidden mb-2 md:mb-4 bg-fortu-dark">
                <img 
                  v-if="getProductImage('bottom-center')"
                  :src="getProductImage('bottom-center')" 
                  :alt="getProductName('bottom-center')"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="400"
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div class="space-y-1 md:space-y-2">
                <div class="flex items-center gap-1 md:gap-2">
                  <div class="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[green] animate-pulse"></div>
                  <span class="text-[10px] md:text-xs text-fortu-light uppercase tracking-wider">Perangkat Terhubung</span>
                </div>
                <p class="text-fortu-off-white font-medium text-xs md:text-base truncate">{{ getProductName('bottom-center') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Central Laptop with CMS -->
        <div class="laptop-container relative z-40">
          <!-- Laptop frame -->
          <div class="laptop-frame relative">
            <!-- Screen bezel -->
            <div ref="laptopScreen" class="w-[600px] md:w-[600px] bg-gradient-to-b from-fortu-medium/60 mt-64 md:mt-0 to-fortu-medium/40 rounded-lg p-3">
              
              <!-- Screen content -->
              <div class="bg-fortu-dark rounded-lg overflow-hidden aspect-[16/10]">
                <!-- CMS Interface -->
                <div class="h-full flex">
                  <!-- Sidebar -->
                  <div class="w-14 bg-fortu-dark border-r border-fortu-medium/20 p-2 flex flex-col items-center gap-3">
                    <div class="w-8 h-8 rounded-md bg-fortu-off-white flex items-center justify-center text-fortu-dark text-xs font-bold">F</div>
                    <div class="w-8 h-8 rounded-md bg-fortu-medium/20 flex items-center justify-center">
                      <svg class="w-4 h-4 text-fortu-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                      </svg>
                    </div>
                    <div class="w-8 h-8 rounded-md bg-fortu-medium/10 flex items-center justify-center">
                      <svg class="w-4 h-4 text-fortu-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                    </div>
                    <div class="w-8 h-8 rounded-md bg-fortu-medium/10 flex items-center justify-center">
                      <svg class="w-4 h-4 text-fortu-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Main content area -->
                  <div class="flex-1 p-4 overflow-hidden">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-4">
                      <div>
                        <p class="text-fortu-off-white text-sm font-medium">Products</p>
                        <p class="text-fortu-medium text-xs">{{ cmsDemo.products.length }} perangkat terhubung</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="px-2 py-1 rounded bg-fortu-off-white/10 text-fortu-off-white text-xs">Live</div>
                        <div class="w-6 h-6 rounded-full bg-fortu-medium/20 flex items-center justify-center">
                          <svg class="w-3 h-3 text-fortu-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Product list in CMS -->
                    <div class="space-y-2">
                      <div 
                        v-for="(product, index) in cmsDemo.products" 
                        :key="product._key || index"
                        class="cms-product-row flex items-center gap-3 p-2 rounded-lg bg-fortu-medium/10 border border-fortu-medium/10"
                        :style="{ animationDelay: `${index * 0.2}s` }"
                      >
                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-fortu-dark flex-shrink-0">
                          <img 
                            v-if="getProductImageForCMS(product)"
                            :src="getProductImageForCMS(product)" 
                            :alt="getProductNameForCMS(product)"
                            loading="lazy"
                            decoding="async"
                            width="80"
                            height="80"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-fortu-off-white text-xs truncate">{{ getProductNameForCMS(product) }}</p>
                        </div>
                        <div class="w-2 h-2 rounded-full bg-fortu-off-white animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          
          </div>
          
          
        </div>

        <!-- Animated data flow particles -->
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
        <div class="particle particle-6"></div>
        
      </div>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-dvh" tone="dark" :cards="3" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { client } from '@/sanity/client'
import { CMS_DEMO_QUERY, type CMSDemo, type CMSDemoProduct } from '@/sanity/queries'
import { urlFor } from '@/sanity/client'
import { IMAGE_CONFIG } from '@/config/image'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const cmsDemo = ref<CMSDemo | null>(null)
const loading = ref(true)

/* ------------------------------------------------------------------ *
 * Connection lines
 *
 * The dashed connectors used to be fixed-size CSS boxes (120px across,
 * 180px down), so they only met the laptop at the exact widths they were
 * tuned for. Instead we measure the real card and laptop rectangles and
 * draw the elbows as SVG paths, re-measuring on every animation frame the
 * section is visible (the cards float, so their boxes move continuously).
 * ------------------------------------------------------------------ */

type Connector = {
  id: string
  d: string
  dotX: number
  dotY: number
  dotOpacity: number
}

const stageRef = ref<HTMLElement | null>(null)
const laptopScreen = ref<HTMLElement | null>(null)
const cardTopLeft = ref<HTMLElement | null>(null)
const cardTopRight = ref<HTMLElement | null>(null)
const cardBottomCenter = ref<HTMLElement | null>(null)

const connectors = ref<Connector[]>([])
const isCompact = ref(false)
const dotRadius = computed(() => (isCompact.value ? 3 : 4))

// One travelling dot per connector, staggered like the old CSS animations.
const DOT_DURATION = 3000
const DOT_DELAYS: Record<string, number> = {
  'top-left': 0,
  'top-right': 1000,
  'bottom-center': 2000,
}

// Detached path used purely to sample points along a connector.
let measurePath: SVGPathElement | null = null
const getMeasurePath = () => {
  if (!measurePath) {
    measurePath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  }
  return measurePath
}

// Elbow that leaves horizontally and arrives vertically, with rounded corner.
const elbow = (sx: number, sy: number, tx: number, ty: number) => {
  const dx = tx - sx
  const dy = ty - sy
  const r = Math.min(14, Math.abs(dx), Math.abs(dy))
  if (r < 1) return `M ${sx} ${sy} L ${tx} ${sy} L ${tx} ${ty}`
  const sgnX = Math.sign(dx)
  const sgnY = Math.sign(dy)
  return `M ${sx} ${sy} L ${tx - sgnX * r} ${sy} Q ${tx} ${sy} ${tx} ${sy + sgnY * r} L ${tx} ${ty}`
}

const buildConnectors = (now: number): Connector[] => {
  const stage = stageRef.value
  const screen = laptopScreen.value
  if (!stage || !screen) return []

  const stageBox = stage.getBoundingClientRect()
  const laptopBox = screen.getBoundingClientRect()
  if (!stageBox.width || !laptopBox.width) return []

  // Short viewports scale the whole stage down; getBoundingClientRect reports
  // screen pixels, so divide back into the stage's own coordinate space.
  const scale = stage.offsetWidth ? stageBox.width / stage.offsetWidth : 1
  const toStageX = (clientX: number) => (clientX - stageBox.left) / scale
  const toStageY = (clientY: number) => (clientY - stageBox.top) / scale

  const laptopTop = toStageY(laptopBox.top)
  const laptopLeft = toStageX(laptopBox.left)
  const laptopRight = toStageX(laptopBox.right)

  const sources: Array<{ id: string; el: HTMLElement | null; targetX: number }> = [
    { id: 'top-left', el: cardTopLeft.value, targetX: laptopLeft + laptopBox.width * 0.2 },
    { id: 'top-right', el: cardTopRight.value, targetX: laptopLeft + laptopBox.width * 0.8 },
    { id: 'bottom-center', el: cardBottomCenter.value, targetX: laptopLeft + laptopBox.width * 0.5 },
  ]

  const path = getMeasurePath()
  const next: Connector[] = []

  for (const source of sources) {
    if (!source.el) continue
    const box = source.el.getBoundingClientRect()
    if (!box.width) continue

    const cardLeft = toStageX(box.left)
    const cardRight = toStageX(box.right)
    const tx = Math.min(Math.max(source.targetX, laptopLeft + 16), laptopRight - 16)

    // Leave from whichever edge actually faces the target: sideways when the
    // laptop anchor is clear of the card (desktop), straight down when the
    // card already sits above it (narrow viewports).
    let sx: number
    let sy: number
    if (tx > cardRight) {
      sx = cardRight
      sy = toStageY(box.top + box.height / 2)
    } else if (tx < cardLeft) {
      sx = cardLeft
      sy = toStageY(box.top + box.height / 2)
    } else {
      sx = tx
      sy = toStageY(box.bottom)
    }

    // The card may already sit below the laptop's top edge on short screens;
    // stop the line at the card instead of drawing it backwards.
    if (sy >= laptopTop) continue

    const d = elbow(sx, sy, tx, laptopTop)

    // Sample the travelling dot straight off the path we just built.
    path.setAttribute('d', d)
    const length = path.getTotalLength()
    const elapsed = now - (DOT_DELAYS[source.id] ?? 0)
    const progress = elapsed <= 0 ? 0 : (elapsed % DOT_DURATION) / DOT_DURATION
    const point = path.getPointAtLength(length * progress)

    next.push({
      id: source.id,
      d,
      dotX: point.x,
      dotY: point.y,
      dotOpacity: progress > 0.8 ? Math.max(0, (1 - progress) / 0.2) : 1,
    })
  }

  return next
}

let frameId = 0
let visible = false
let observer: IntersectionObserver | null = null

const tick = (now: number) => {
  connectors.value = buildConnectors(now)
  frameId = requestAnimationFrame(tick)
}

const startTracking = () => {
  if (frameId) return
  frameId = requestAnimationFrame(tick)
}

const stopTracking = () => {
  if (!frameId) return
  cancelAnimationFrame(frameId)
  frameId = 0
}

const handleResize = () => {
  isCompact.value = window.matchMedia('(max-width: 768px)').matches
  if (!visible) connectors.value = buildConnectors(performance.now())
}

const observeStage = () => {
  if (!stageRef.value || observer) return
  observer = new IntersectionObserver(
    entries => {
      visible = entries.some(entry => entry.isIntersecting)
      if (visible) startTracking()
      else {
        stopTracking()
        connectors.value = buildConnectors(performance.now())
      }
    },
    { rootMargin: '100px' }
  )
  observer.observe(stageRef.value)
}

watch(
  () => cmsDemo.value,
  async value => {
    if (!value) return
    await nextTick()
    handleResize()
    observeStage()
    connectors.value = buildConnectors(performance.now())
  }
)

// Helper function to get product by position
const getProductByPosition = (position: 'top-left' | 'top-right' | 'bottom-center') => {
  if (!cmsDemo.value?.products) return null
  return cmsDemo.value.products.find(p => p.position === position)
}

// Helper function to get product data (handles both referenced and custom products)
const getProductData = (position: 'top-left' | 'top-right' | 'bottom-center') => {
  const product = getProductByPosition(position)
  if (!product) return null
  
  // Prefer referenced product, fallback to custom product
  if (product.product) {
    return {
      name: product.product.name,
      image: product.product.images?.[0]
    }
  } else if (product.customProduct) {
    return {
      name: product.customProduct.name,
      image: product.customProduct.image
    }
  }
  return null
}

// Helper function to get product name
const getProductName = (position: 'top-left' | 'top-right' | 'bottom-center') => {
  const data = getProductData(position)
  return data?.name || ''
}

// Helper function to get product image URL
const getProductImage = (position: 'top-left' | 'top-right' | 'bottom-center'): string | undefined => {
  const data = getProductData(position)
  if (!data?.image?.asset) return undefined
  
  try {
    const builder = urlFor(data.image.asset).width(400).height(400).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return undefined
  }
}

// Helper functions for CMS product list
const getProductNameForCMS = (product: CMSDemoProduct) => {
  if (product.product) {
    return product.product.name
  } else if (product.customProduct) {
    return product.customProduct.name
  }
  return ''
}

const getProductImageForCMS = (product: CMSDemoProduct): string | undefined => {
  let imageAsset = null
  
  if (product.product?.images?.[0]?.asset) {
    imageAsset = product.product.images[0].asset
  } else if (product.customProduct?.image?.asset) {
    imageAsset = product.customProduct.image.asset
  }
  
  if (!imageAsset) return undefined
  
  try {
    const builder = urlFor(imageAsset).width(80).height(80).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return undefined
  }
}

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize, { passive: true })
  try {
    cmsDemo.value = await client.fetch(CMS_DEMO_QUERY)
  } catch (e) {
    console.error('Failed to fetch CMS Demo content:', e)
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  stopTracking()
  observer?.disconnect()
  observer = null
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Product card animations */
.product-card {
  animation: float 6s ease-in-out infinite;
}

.product-1 {
  animation-delay: 0s;
}

.product-2 {
  animation-delay: 2s;
}

.product-3 {
  animation: float-center 6s ease-in-out infinite;
  animation-delay: 4s;
  animation-fill-mode: backwards;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-center {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-15px);
  }
}

/* Connection lines - drawn as an SVG overlay sized to the stage */
.connection-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 20;
}

.conn-dot {
  filter: drop-shadow(0 0 6px rgba(249, 249, 249, 0.8));
}

/* CMS product rows animation */
.cms-product-row {
  animation: slideIn 0.8s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Particles - using brand colors (#F9F9F9 off-white, #BFBFBF light, #7D7D7D medium) */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #F9F9F9;
  opacity: 0;
  animation: particleFlow 4s ease-in-out infinite;
}

.particle-1 {
  top: 10%;
  left: 20%;
  background: #F9F9F9;
  animation-delay: 0s;
}

.particle-2 {
  top: 15%;
  right: 22%;
  background: #BFBFBF;
  animation-delay: 0.8s;
}

.particle-3 {
  bottom: 18%;
  left: 50%;
  background: #F9F9F9;
  animation-delay: 1.6s;
}

.particle-4 {
  top: 25%;
  left: 30%;
  background: #BFBFBF;
  animation-delay: 2.4s;
}

.particle-5 {
  top: 20%;
  right: 30%;
  background: #F9F9F9;
  animation-delay: 3.2s;
}

.particle-6 {
  bottom: 25%;
  left: 48%;
  background: #BFBFBF;
  animation-delay: 4s;
}

@keyframes particleFlow {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(100px) scale(0.5);
  }
}

/* Laptop glow animation - using brand colors */
.laptop-container {
  animation: laptopGlow 4s ease-in-out infinite alternate;
}

@keyframes laptopGlow {
  0% {
    filter: drop-shadow(0 0 30px rgba(191, 191, 191, 0.15));
  }
  50% {
    filter: drop-shadow(0 0 50px rgba(249, 249, 249, 0.2));
  }
  100% {
    filter: drop-shadow(0 0 30px rgba(191, 191, 191, 0.15));
  }
}

/* Short viewports (landscape signage panels, laptops with little height):
   the section used to be locked to one screen with overflow hidden, which cut
   the visualisation off. It now grows to fit, and the composition is scaled
   down so the whole thing still lands close to a single screen. */
@media (min-width: 769px) and (max-height: 1100px) {
  .cms-demo-section {
    padding-bottom: 4rem;
  }

  .cms-demo-inner {
    padding-top: 3rem;
    padding-bottom: 2rem;
  }

  .cms-demo-header {
    margin-bottom: 2rem;
  }

  .cms-demo-header h2 {
    font-size: clamp(1.875rem, 6vh, 3.75rem);
  }

  .visualization-stage {
    --stage-scale: 0.74;
    /* the top-centre card hangs above the stage; leave it room to clear the
       header instead of landing on the description */
    margin-top: 6rem;
    transform: scale(var(--stage-scale));
    transform-origin: top center;
    /* reclaim the space the scale no longer occupies */
    margin-bottom: calc(-780px * (1 - var(--stage-scale)));
  }
}

@media (min-width: 769px) and (max-height: 700px) {
  .visualization-stage {
    --stage-scale: 0.62;
    margin-top: 5.5rem;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .laptop-container {
    transform: scale(0.55) translateY(140px);
    transform-origin: center center;
  }
  
  .product-1 {
    animation: float-mobile 6s ease-in-out infinite;
  }
  
  .product-2 {
    animation: float-mobile 6s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  .product-3 {
    animation: float-center-mobile 6s ease-in-out infinite;
    animation-delay: 4s;
    animation-fill-mode: backwards;
  }
  
  /* Hide desktop particles on mobile */
  .particle {
    display: none;
  }
  
}

@keyframes float-mobile {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-center-mobile {
  0%, 100% {
    transform: translateX(-50%) translateY(0px);
  }
  50% {
    transform: translateX(-50%) translateY(-8px);
  }
}
</style>
