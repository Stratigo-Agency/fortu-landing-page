<template>
  <Teleport to="body">
    <Transition name="chooser">
      <div
        v-if="state.open"
        class="fixed inset-0 z-[1100] flex items-end sm:items-center justify-center p-4 sm:p-6"
        @keydown.esc.prevent="closeChooser"
        @keydown.tab="trapFocus"
      >
        <div class="absolute inset-0 bg-fortu-dark/70" @click="closeChooser"></div>

        <div
          ref="dialogEl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-chooser-title"
          class="chooser-panel relative w-full max-w-lg rounded-2xl bg-fortu-off-white p-6 sm:p-8"
        >
          <button
            ref="closeBtn"
            type="button"
            class="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-fortu-medium hover:text-fortu-dark hover:bg-fortu-off-white transition-colors"
            aria-label="Tutup"
            @click="closeChooser"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 id="contact-chooser-title" class="text-2xl sm:text-3xl font-medium tracking-tight text-fortu-dark pr-10">
            Hubungi Kami
          </h2>
          <p class="mt-2 text-fortu-medium">
            Pilih keperluan Anda. Tim kami akan menyambut lewat halaman Fortu Digital berikut.
          </p>

          <div class="mt-6 space-y-3">
            <a
              v-for="opt in options"
              :key="opt.choice"
              :href="opt.href"
              target="_blank"
              rel="noopener noreferrer"
              class="chooser-option group flex items-start gap-4 rounded-2xl border border-fortu-light/70 p-4 sm:p-5 hover:border-fortu-dark hover:bg-fortu-off-white transition-colors"
              @click="onChoose(opt.choice)"
            >
              <span class="w-11 h-11 rounded-full bg-fortu-dark text-fortu-off-white flex items-center justify-center flex-shrink-0">
                <svg v-if="opt.choice === 'sales'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M8 10h8M8 14h5m-9 6l2.6-3H18a3 3 0 003-3V7a3 3 0 00-3-3H6a3 3 0 00-3 3v13z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M7 11a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zM2 19a5 5 0 0110 0M12 19a5 5 0 0110 0" />
                </svg>
              </span>
              <span class="flex-1">
                <span class="block text-lg font-medium text-fortu-dark">{{ opt.title }}</span>
                <span class="block text-sm text-fortu-medium mt-0.5">{{ opt.description }}</span>
              </span>
              <svg class="w-4 h-4 mt-1.5 text-fortu-medium group-hover:text-fortu-dark transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/queries'
import { useContactChooser } from '@/composables/useContactChooser'
import { useAnalytics } from '@/composables/useAnalytics'
import { buildContactUrl, type ContactChoice } from '@/config/contact'

const route = useRoute()
const { state, closeChooser } = useContactChooser()
const { trackEvent } = useAnalytics()

const settings = ref<SiteSettings | null>(null)
const dialogEl = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const options = computed(() => [
  {
    choice: 'sales' as ContactChoice,
    title: 'Hubungi Sales',
    description: 'Konsultasi kebutuhan layar, informasi produk, dan penawaran.',
    href: buildContactUrl(settings.value?.contactSalesUrl, 'sales', state.campaign),
  },
  {
    choice: 'partnership' as ContactChoice,
    title: 'Partnership & Kolaborasi',
    description: 'Kerja sama bisnis, program kemitraan, dan kolaborasi proyek.',
    href: buildContactUrl(settings.value?.contactPartnershipUrl, 'partnership', state.campaign),
  },
])

const onChoose = (choice: ContactChoice) => {
  trackEvent(choice === 'sales' ? 'click_contact_sales' : 'click_contact_partnership', {
    button_location: state.source,
    page_path: route.path,
    ...(state.productName ? { product_name: state.productName } : {}),
  })
  closeChooser()
}

const focusables = () =>
  Array.from(
    dialogEl.value?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') || [],
  )

const trapFocus = (e: KeyboardEvent) => {
  const items = focusables()
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => state.open,
  async (open) => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null
      await nextTick()
      closeBtn.value?.focus()
    } else {
      previouslyFocused?.focus?.()
    }
  },
)

// close when navigating to another page
watch(() => route.fullPath, closeChooser)

onMounted(async () => {
  try {
    settings.value = await client.fetch(SITE_SETTINGS_QUERY)
  } catch (e) {
    console.error('Failed to fetch site settings:', e)
  }
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.chooser-enter-active,
.chooser-leave-active {
  transition: opacity 0.2s ease;
}
.chooser-enter-active .chooser-panel,
.chooser-leave-active .chooser-panel {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.chooser-enter-from,
.chooser-leave-to {
  opacity: 0;
}
.chooser-enter-from .chooser-panel,
.chooser-leave-to .chooser-panel {
  transform: translateY(16px) scale(0.98);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .chooser-enter-active,
  .chooser-leave-active,
  .chooser-enter-active .chooser-panel,
  .chooser-leave-active .chooser-panel {
    transition: none;
  }
}
</style>
