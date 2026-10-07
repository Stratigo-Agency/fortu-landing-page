<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import Button from '@/reusables/Button.vue'
import { client } from '@/sanity/client'
import { NAV_PRODUCTS_QUERY, type NavProduct } from '@/sanity/queries'
import { FALLBACK_NAV_PRODUCTS, NAV_LINKS } from '@/config/nav'

const route = useRoute()
const isMenuOpen = ref(false)
const isVisible = ref(true)
const isInHeroSection = ref(true)
const lastScrollY = ref(0)

// Featured products shown directly in the header (managed in Sanity: "Tampilkan di menu header")
const navProducts = ref<NavProduct[]>(FALLBACK_NAV_PRODUCTS)

const isInHero = computed(() => {
  // Solid background while the mobile menu is open
  if (isMenuOpen.value) return false
  return isInHeroSection.value
})

const isComingSoon = (p: NavProduct) => p.status === 'coming_soon'
const productPath = (p: NavProduct) => `/products/${encodeURIComponent(p.slug.trim())}`

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
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
  }

  lastScrollY.value = currentScrollY
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) closeMenu()
}

// Reset scroll state on route change
watch(() => route.path, () => {
  lastScrollY.value = 0
  isInHeroSection.value = true
  isMenuOpen.value = false
  handleScroll()
})

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  handleScroll() // Initial check
  try {
    const list = (await client.fetch(NAV_PRODUCTS_QUERY)) as NavProduct[]
    if (list?.length) navProducts.value = list
  } catch (e) {
    console.warn('Failed to fetch menu products, using defaults:', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      isVisible ? 'translate-y-0' : '-translate-y-full',
      isInHero
        ? 'bg-transparent'
        : 'bg-white shadow-sm'
    ]"
    aria-label="Menu utama"
  >
    <div class="mx-auto px-4 md:px-16 xl:px-10 2xl:px-16 py-4">
      <div class="flex items-center justify-between gap-6">
        <!-- Logo = home -->
        <RouterLink to="/" class="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity" aria-label="Fortu Digital, ke beranda" @click="closeMenu">
          <img
            src="/logo.png"
            alt="FORTU DIGITAL"
            width="120"
            height="48"
            class="h-12 xl:h-10 2xl:h-12 w-auto transition-all duration-300"
            :class="isInHero ? '' : 'brightness-0'"
          />
        </RouterLink>

        <!-- Desktop navigation: featured products are right here, no extra click -->
        <div class="hidden xl:flex items-center gap-5 2xl:gap-8 text-[15px] tracking-tight">
          <template v-for="p in navProducts" :key="p._id">
            <span
              v-if="isComingSoon(p)"
              class="nav-soon inline-flex items-baseline gap-1.5 cursor-default"
              :class="isInHero ? 'text-fortu-off-white/55' : 'text-fortu-dark/45'"
              :title="`${p.name} segera hadir`"
            >
              {{ p.name }}
              <span class="text-[10px] uppercase tracking-wider">Segera</span>
            </span>
            <RouterLink
              v-else
              :to="productPath(p)"
              class="nav-link whitespace-nowrap transition-colors"
              :class="isInHero
                ? 'text-fortu-off-white hover:text-fortu-light'
                : 'text-fortu-dark hover:text-fortu-medium'"
              @click="closeMenu"
            >
              {{ p.name }}
            </RouterLink>
          </template>

          <span class="w-px h-4 flex-shrink-0" :class="isInHero ? 'bg-fortu-off-white/30' : 'bg-fortu-dark/20'" aria-hidden="true"></span>

          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="nav-link whitespace-nowrap transition-colors"
            :class="isInHero
              ? 'text-fortu-off-white hover:text-fortu-light'
              : 'text-fortu-dark hover:text-fortu-medium'"
            @click="closeMenu"
          >
            {{ link.label }}
          </RouterLink>
        </div>

        <!-- Desktop CTA -->
        <div class="hidden xl:block flex-shrink-0">
          <Button
            :variant="isInHero ? 'secondary' : 'primary'"
            size="sm"
            to="/products"
            :class="!isInHero ? 'border-fortu-dark text-fortu-dark hover:bg-fortu-dark hover:text-fortu-off-white' : ''"
          >
            Lihat Produk
          </Button>
        </div>

        <!-- Mobile / tablet menu button -->
        <button
          type="button"
          @click="toggleMenu"
          class="xl:hidden p-2 transition-colors"
          :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          aria-label="Buka/Tutup menu"
        >
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile / tablet menu: products first -->
      <div
        v-show="isMenuOpen"
        id="mobile-menu"
        class="xl:hidden mt-3 pt-3 border-t max-h-[calc(100dvh-5.5rem)] overflow-y-auto"
        :class="isInHero ? 'border-fortu-medium/30' : 'border-fortu-light'"
      >
        <p class="text-[11px] uppercase tracking-[0.2em] mb-1" :class="isInHero ? 'text-fortu-light' : 'text-fortu-medium'">Produk</p>
        <ul class="mb-4">
          <li v-for="p in navProducts" :key="p._id">
            <span
              v-if="isComingSoon(p)"
              class="flex items-baseline justify-between py-3 text-lg"
              :class="isInHero ? 'text-fortu-off-white/55' : 'text-fortu-dark/45'"
            >
              {{ p.name }}
              <span class="text-[11px] uppercase tracking-wider">Segera hadir</span>
            </span>
            <RouterLink
              v-else
              :to="productPath(p)"
              class="nav-link-m block py-3 text-lg tracking-tight transition-colors"
              :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
              @click="closeMenu"
            >
              {{ p.name }}
            </RouterLink>
          </li>
        </ul>

        <ul class="border-t pt-2 mb-4" :class="isInHero ? 'border-fortu-medium/30' : 'border-fortu-light'">
          <li v-for="link in NAV_LINKS" :key="link.to">
            <RouterLink
              :to="link.to"
              class="nav-link-m block py-3 text-lg tracking-tight transition-colors"
              :class="isInHero ? 'text-fortu-off-white' : 'text-fortu-dark'"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <RouterLink
          to="/products"
          class="mb-2 inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm tracking-wide transition-colors"
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
</template>

<style scoped>
/* Current page: thin underline instead of a weight change (keeps item widths stable) */
.nav-link {
  text-underline-offset: 8px;
  text-decoration-thickness: 1px;
}
.nav-link.router-link-active {
  text-decoration-line: underline;
}
.nav-link-m.router-link-active {
  font-weight: 500;
}
</style>
