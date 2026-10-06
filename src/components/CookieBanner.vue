<template>
  <Transition name="slide-up">
    <div
      v-if="showBanner"
      ref="bannerEl"
      class="cookie-banner fixed bottom-0 left-0 right-0 z-[1001] bg-fortu-dark border-t border-fortu-medium/30 shadow-lg"
    >
      <div class="mx-auto px-4 md:px-16 py-4 md:py-6">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex-1">
            <p class="text-fortu-off-white text-sm md:text-base leading-relaxed">
              Kami menggunakan cookies untuk meningkatkan pengalaman Anda dan menganalisis penggunaan situs. 
              Dengan melanjutkan, Anda menyetujui penggunaan cookies kami.
              <RouterLink 
                to="/privacy" 
                class="underline hover:text-fortu-light transition-colors"
              >
                Pelajari lebih lanjut
              </RouterLink>
            </p>
          </div>
          <div class="flex items-center gap-3 flex-shrink-0">
            <button
              @click="acceptCookies"
              class="px-6 py-2.5 bg-fortu-off-white text-fortu-dark font-medium rounded-lg hover:bg-fortu-light transition-colors text-sm md:text-base"
            >
              Terima
            </button>
            <button
              @click="declineCookies"
              class="px-6 py-2.5 border border-fortu-medium text-fortu-off-white font-medium rounded-lg hover:bg-fortu-medium/20 transition-colors text-sm md:text-base"
            >
              Tolak
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'

const COOKIE_CONSENT_KEY = 'fortu_cookie_consent'
const showBanner = ref(false)
const bannerEl = ref<HTMLElement | null>(null)

// Share the banner height with fixed-position elements (e.g. the floating
// contact button in App.vue) so they can sit above the banner instead of under it.
const setBannerHeight = (px: number) => {
  document.documentElement.style.setProperty('--cookie-banner-height', `${px}px`)
}

let resizeObserver: ResizeObserver | null = null

watch(bannerEl, (el) => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (!el) {
    setBannerHeight(0)
    return
  }
  setBannerHeight(el.offsetHeight)
  resizeObserver = new ResizeObserver(() => setBannerHeight(el.offsetHeight))
  resizeObserver.observe(el)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  setBannerHeight(0)
})

const acceptCookies = () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
  showBanner.value = false
  
  // Update Consent Mode to allow analytics
  if ((window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted'
    })
    
    // Send a pageview event
    (window as any).gtag('event', 'page_view', {
      page_path: window.location.pathname,
    })
  }
}

const declineCookies = () => {
  localStorage.setItem(COOKIE_CONSENT_KEY, 'declined')
  showBanner.value = false
  
  // Ensure Consent Mode remains denied
  if ((window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    })
  }
}

onMounted(() => {
  // Check if user has already given consent
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
  
  if (!consent) {
    // Show banner if no consent decision has been made
    showBanner.value = true
  } else if (consent === 'accepted') {
    // If consent was previously accepted, update Consent Mode immediately
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      })
    }
  } else {
    // Consent was declined, ensure it stays denied
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      })
    }
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

