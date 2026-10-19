<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Button from '@/reusables/Button.vue'
import { fetchSanity } from '@/sanity/fetch'
import { NAV_PRODUCTS_QUERY, type NavProduct } from '@/sanity/queries'
import { FALLBACK_LIVE_SLUGS, NAV_LINKS, NAV_MENU, type MenuGroup, type MenuSize, type NavLink } from '@/config/nav'

const route = useRoute()
const router = useRouter()
const isMenuOpen = ref(false)
const isVisible = ref(true)
const isInHeroSection = ref(true)
const lastScrollY = ref(0)

// Desktop: the category whose panel is open. Phones: the category expanded in the menu.
const openId = ref<string | null>(null)
const mobileOpenId = ref<string | null>(null)
let closeTimer: ReturnType<typeof setTimeout> | null = null

// Which product pages exist (Sanity). Until it answers, the products that already exist are treated as live.
const liveSlugs = ref<Set<string>>(new Set(FALLBACK_LIVE_SLUGS))

// Transparent over the hero, solid once scrolled, while the mobile menu is open or a panel is open
const isInHero = computed(() => !isMenuOpen.value && openId.value === null && isInHeroSection.value)

const isLive = (g: MenuGroup) => liveSlugs.value.has(g.slug)
const groupPath = (g: MenuGroup) => `/products/${encodeURIComponent(g.slug)}`
const sizeTo = (g: MenuGroup, s: MenuSize) => ({ path: groupPath(g), query: { ukuran: s.value } })
const sizeLive = (g: MenuGroup, s: MenuSize) => isLive(g) && !s.soon && !!s.value

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (!isMenuOpen.value) mobileOpenId.value = null
}
const closeMenu = () => {
  isMenuOpen.value = false
  mobileOpenId.value = null
  openId.value = null
}

// Desktop panels: open on hover (with a short grace period) or on click/Enter, close on leave, Escape, outside click
const cancelClose = () => {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = null
}
const scheduleClose = () => {
  cancelClose()
  closeTimer = setTimeout(() => (openId.value = null), 160)
}
const hoverOpen = (id: string, e: PointerEvent) => {
  if (e.pointerType !== 'mouse') return
  cancelClose()
  openId.value = id
}
const toggleCategory = (id: string) => {
  cancelClose()
  openId.value = openId.value === id ? null : id
}

// "Portfolio": glide to that section of the home page, also when already on it
const goTo = async (link: NavLink) => {
  closeMenu()
  if (link.hash) await router.push({ path: link.to, hash: link.hash, force: true })
  else await router.push(link.to)
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const heroHeight = window.innerHeight * 0.8 // Consider "in hero" for 80% of viewport height

  // Determine if we're in the hero section (for scroll-based transparency)
  isInHeroSection.value = currentScrollY < heroHeight

  // Determine scroll direction and visibility
  if (currentScrollY < 100) {
    // Always show at the top
    isVisible.value = true
  } else if (currentScrollY < lastScrollY.value) {
    // Scrolling up - show navbar
    isVisible.value = true
  } else if (currentScrollY > lastScrollY.value + 10) {
    // Scrolling down (with threshold to prevent jitter) - hide navbar
    isVisible.value = false
    isMenuOpen.value = false // Close mobile menu when hiding
    openId.value = null
  }

  lastScrollY.value = currentScrollY
}

const navEl = ref<HTMLElement | null>(null)
const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (openId.value) {
    const id = openId.value
    openId.value = null
    nextTick(() => navEl.value?.querySelector<HTMLElement>(`[data-cat="${id}"]`)?.focus())
  } else if (isMenuOpen.value) closeMenu()
}

// Reset scroll state on route change
watch(() => route.fullPath, () => {
  lastScrollY.value = 0
  isInHeroSection.value = true
  closeMenu()
  handleScroll()
})

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  handleScroll() // Initial check
  try {
    const list = (await fetchSanity(NAV_PRODUCTS_QUERY)) as NavProduct[]
    if (list) liveSlugs.value = new Set(list.filter((p) => p.status === 'active').map((p) => p.slug))
  } catch (e) {
    console.warn('Failed to fetch menu products, using defaults:', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', onKeydown)
  cancelClose()
})
</script>

<template>
  <nav
    ref="navEl"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isVisible ? 'translate-y-0' : '-translate-y-full',
      isInHero
        ? 'bg-transparent'
        : 'bg-white shadow-sm'
    ]"
    aria-label="Menu utama"
    @pointerleave="scheduleClose"
    @pointerenter="cancelClose"
  >
    <div class="mx-auto px-4 md:px-16 xl:px-10 2xl:px-16 py-4">
      <div class="flex items-center justify-between gap-6">
        <!-- Logo = home -->
        <RouterLink to="/" class="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity" aria-label="Fortu Digital, ke beranda" @click="closeMenu">
          <!-- White lockup over the hero, navy lockup on the white bar (brand guideline) -->
          <img
            :src="isInHero ? '/logo.png' : '/logo-navy.png'"
            alt="FORTU DIGITAL"
            width="164"
            height="48"
            class="h-12 xl:h-10 2xl:h-12 w-auto"
          />
        </RouterLink>

        <!-- Desktop navigation: three categories that open a full-width panel, then the other pages -->
        <div class="hidden xl:flex items-center gap-5 2xl:gap-8 text-[17px] min-[1440px]:text-[18px] min-[1700px]:text-[20px] tracking-tight">
          <div v-for="cat in NAV_MENU" :key="cat.id">
            <button
              type="button"
              :data-cat="cat.id"
              class="nav-link whitespace-nowrap transition-colors inline-flex items-center gap-1.5"
              :class="[
                isInHero ? 'text-fortu-off-white hover:text-fortu-light' : 'text-fortu-dark hover:text-fortu-medium',
                { 'is-open': openId === cat.id },
              ]"
              :aria-expanded="openId === cat.id ? 'true' : 'false'"
              :aria-controls="`panel-${cat.id}`"
              @pointerenter="hoverOpen(cat.id, $event)"
              @click="toggleCategory(cat.id)"
            >
              {{ cat.label }}
              <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': openId === cat.id }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            <Transition name="panel">
              <div
                v-if="openId === cat.id"
                :id="`panel-${cat.id}`"
                class="absolute left-0 right-0 top-full bg-white border-t border-fortu-dark/10 shadow-lg"
                role="region"
                :aria-label="cat.label"
              >
                <div
                  class="mx-auto max-w-7xl px-16 xl:px-10 2xl:px-16 py-10 grid gap-x-12 gap-y-8"
                  :style="{ gridTemplateColumns: `repeat(${cat.groups.length}, minmax(0, 1fr))` }"
                >
                  <div v-for="g in cat.groups" :key="g.slug">
                    <RouterLink
                      v-if="isLive(g)"
                      :to="groupPath(g)"
                      class="panel-title block mb-4 text-2xl font-medium tracking-tight text-fortu-dark hover:text-fortu-medium transition-colors"
                      @click="closeMenu"
                    >
                      {{ g.label }}
                    </RouterLink>
                    <p v-else class="mb-4 text-2xl font-medium tracking-tight text-fortu-dark/45">
                      {{ g.label }}
                      <span class="ml-2 align-middle text-xs font-normal uppercase tracking-wider">Segera</span>
                    </p>

                    <ul v-if="g.sizes" class="space-y-1">
                      <li v-for="s in g.sizes" :key="s.label">
                        <RouterLink
                          v-if="sizeLive(g, s)"
                          :to="sizeTo(g, s)"
                          class="block py-2 text-xl text-fortu-medium hover:text-fortu-dark transition-colors"
                          @click="closeMenu"
                        >
                          {{ s.label }}
                        </RouterLink>
                        <span v-else class="block py-2 text-xl text-fortu-dark/35">
                          {{ s.soon ? 'Segera' : s.label }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <span class="w-px h-4 flex-shrink-0" :class="isInHero ? 'bg-fortu-off-white/30' : 'bg-fortu-dark/20'" aria-hidden="true"></span>

          <template v-for="link in NAV_LINKS" :key="link.label">
            <a
              v-if="link.hash"
              :href="`${link.to}${link.hash}`"
              class="nav-link whitespace-nowrap transition-colors"
              :class="isInHero ? 'text-fortu-off-white hover:text-fortu-light' : 'text-fortu-dark hover:text-fortu-medium'"
              @click.prevent="goTo(link)"
            >
              {{ link.label }}
            </a>
            <RouterLink
              v-else
              :to="link.to"
              class="nav-link whitespace-nowrap transition-colors"
              :class="isInHero
                ? 'text-fortu-off-white hover:text-fortu-light'
                : 'text-fortu-dark hover:text-fortu-medium'"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </template>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden xl:block flex-shrink-0">
          <Button
            :variant="isInHero ? 'secondary' : 'primary'"
            size="sm"
            to="/products"
            class="!text-base"
            :class="!isInHero ? 'border-fortu-dark text-fortu-dark hover:bg-fortu-dark hover:text-fortu-off-white' : ''"
          >
            Lihat Produk
          </Button>
        </div>

        <!-- Mobile / tablet menu button -->
        <button
          type="button"
          @click="toggleMenu"
          class="xl:hidden p-3 -mr-1 transition-colors"
          :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Buka/Tutup menu"
        >
          <svg v-if="!isMenuOpen" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile / tablet menu: each category expands to its products and sizes -->
      <div
        v-show="isMenuOpen"
        id="mobile-menu"
        class="xl:hidden mt-3 pt-3 border-t max-h-[calc(100dvh-5.5rem)] overflow-y-auto"
        :class="isInHero ? 'border-fortu-medium/30' : 'border-fortu-light'"
      >
        <ul class="mb-4">
          <li v-for="cat in NAV_MENU" :key="cat.id" class="border-b last:border-b-0" :class="isInHero ? 'border-fortu-medium/20' : 'border-fortu-light/60'">
            <button
              type="button"
              class="flex w-full items-center justify-between py-3.5 text-xl tracking-tight text-left"
              :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
              :aria-expanded="mobileOpenId === cat.id ? 'true' : 'false'"
              :aria-controls="`m-${cat.id}`"
              @click="mobileOpenId = mobileOpenId === cat.id ? null : cat.id"
            >
              {{ cat.label }}
              <svg class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': mobileOpenId === cat.id }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            <div v-show="mobileOpenId === cat.id" :id="`m-${cat.id}`" class="pb-4 space-y-5">
              <div v-for="g in cat.groups" :key="g.slug">
                <RouterLink
                  v-if="isLive(g)"
                  :to="groupPath(g)"
                  class="block py-1.5 text-lg font-medium"
                  :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
                  @click="closeMenu"
                >
                  {{ g.label }}
                </RouterLink>
                <p v-else class="py-1.5 text-lg font-medium" :class="isInHero ? 'text-fortu-off-white/55' : 'text-fortu-dark/45'">
                  {{ g.label }}
                  <span class="ml-2 text-xs font-normal uppercase tracking-wider">Segera</span>
                </p>

                <ul v-if="g.sizes" class="flex flex-wrap gap-2 mt-1.5">
                  <li v-for="s in g.sizes" :key="s.label">
                    <RouterLink
                      v-if="sizeLive(g, s)"
                      :to="sizeTo(g, s)"
                      class="inline-flex min-h-[44px] min-w-[56px] items-center justify-center rounded-full border px-4 text-base transition-colors"
                      :class="isInHero ? 'border-fortu-light/40 text-fortu-off-white' : 'border-fortu-dark/25 text-fortu-dark'"
                      @click="closeMenu"
                    >
                      {{ s.label }}
                    </RouterLink>
                    <span
                      v-else
                      class="inline-flex min-h-[44px] items-center justify-center rounded-full border border-dashed px-4 text-base"
                      :class="isInHero ? 'border-fortu-light/25 text-fortu-off-white/45' : 'border-fortu-dark/20 text-fortu-dark/40'"
                    >
                      {{ s.soon ? 'Segera' : s.label }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>

        <ul class="border-t pt-2 mb-4" :class="isInHero ? 'border-fortu-medium/30' : 'border-fortu-light'">
          <li v-for="link in NAV_LINKS" :key="link.label">
            <a
              v-if="link.hash"
              :href="`${link.to}${link.hash}`"
              class="block py-3.5 text-xl tracking-tight transition-colors"
              :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
              @click.prevent="goTo(link)"
            >
              {{ link.label }}
            </a>
            <RouterLink
              v-else
              :to="link.to"
              class="nav-link-m block py-3.5 text-xl tracking-tight transition-colors"
              :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <RouterLink
          to="/products"
          class="mb-2 inline-flex items-center gap-1 rounded-full border px-5 py-2.5 text-base tracking-wide transition-colors"
          :class="isInHero
            ? 'border-fortu-light/40 text-fortu-off-white hover:border-fortu-off-white'
            : 'border-fortu-dark text-fortu-dark hover:bg-fortu-dark hover:text-fortu-off-white'"
          @click="closeMenu"
        >
          Lihat Produk
          <span aria-hidden="true">&rarr;</span>
        </RouterLink>
      </div>
    </div>
  </nav>

  <!-- Dims the page behind an open desktop panel; a click on it closes the panel -->
  <Transition name="fade">
    <div v-if="openId" class="hidden xl:block fixed inset-0 z-40 bg-fortu-dark/40 backdrop-blur-sm" aria-hidden="true" @click="openId = null"></div>
  </Transition>
</template>

<style scoped>
/* Current page: thin underline instead of a weight change (keeps item widths stable) */
.nav-link {
  text-underline-offset: 8px;
  text-decoration-thickness: 1px;
}
.nav-link.router-link-active,
.nav-link.is-open {
  text-decoration-line: underline;
}
.nav-link-m.router-link-active {
  font-weight: 500;
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
}
.panel-enter-from,
.panel-leave-to {
  transform: translateY(-6px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
