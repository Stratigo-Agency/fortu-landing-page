<template>
  <section class="office-map bg-white py-16 md:py-24" aria-labelledby="office-map-title">
    <div class="mx-auto px-4 md:px-16">
      <div class="mb-8 md:mb-12">
        <p class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-fortu-medium mb-3">Lokasi</p>
        <h2 id="office-map-title" class="text-3xl md:text-5xl font-medium text-fortu-dark tracking-tight">
          Kantor Fortu Digital
        </h2>
      </div>

      <!-- Branch picker -->
      <div
        v-if="offices.length > 1"
        class="flex flex-wrap gap-2 mb-6 md:mb-8"
        role="tablist"
        aria-label="Pilih cabang"
      >
        <button
          v-for="(office, i) in offices"
          :id="`office-tab-${i}`"
          :key="office._key || i"
          type="button"
          role="tab"
          :aria-selected="i === active"
          :aria-controls="`office-panel-${i}`"
          :tabindex="i === active ? 0 : -1"
          class="px-5 py-2.5 rounded-full text-sm md:text-base font-medium border transition-colors"
          :class="
            i === active
              ? 'bg-fortu-dark text-fortu-off-white border-fortu-dark'
              : 'bg-transparent text-fortu-dark border-fortu-light hover:border-fortu-dark'
          "
          @click="active = i"
          @keydown.right.prevent="move(1)"
          @keydown.left.prevent="move(-1)"
        >
          {{ office.city || office.name }}
        </button>
      </div>

      <div
        v-if="current"
        :id="`office-panel-${active}`"
        role="tabpanel"
        :aria-labelledby="`office-tab-${active}`"
        class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch"
      >
        <!-- Details -->
        <div class="lg:col-span-2 space-y-5">
          <div>
            <h3 class="text-xl md:text-2xl font-medium text-fortu-dark tracking-tight">
              {{ current.name || (current.city ? `Kantor ${current.city}` : 'Kantor') }}
            </h3>
            <p v-if="current.address" class="mt-2 text-fortu-medium leading-relaxed whitespace-pre-line">
              {{ current.address }}
            </p>
            <p v-else class="mt-2 text-fortu-medium">Alamat lengkap segera hadir.</p>
          </div>

          <ul v-if="hours.length" class="text-sm text-fortu-medium space-y-1">
            <li v-for="line in hours" :key="line">{{ line }}</li>
          </ul>

          <p v-if="current.phone">
            <a :href="`tel:${current.phone.replace(/[^+\d]/g, '')}`" class="text-fortu-dark font-medium underline underline-offset-4">
              {{ current.phone }}
            </a>
          </p>

          <a
            v-if="safeUrl(current.mapsUrl)"
            :href="safeUrl(current.mapsUrl)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fortu-dark text-fortu-off-white font-medium hover:opacity-90 transition-opacity"
          >
            Buka di Google Maps
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <!-- Map -->
        <div class="lg:col-span-3">
          <div class="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden bg-fortu-off-white border border-fortu-light/60">
            <iframe
              v-if="embedUrl && mapLoaded"
              :key="embedUrl"
              :src="embedUrl"
              :title="`Peta ${current.name || current.city}`"
              class="absolute inset-0 w-full h-full border-0"
              loading="lazy"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            ></iframe>

            <!-- Map loads only after cookie consent or an explicit click -->
            <div
              v-else-if="embedUrl"
              class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
            >
              <p class="text-fortu-medium max-w-sm">
                Peta dari Google Maps dimuat setelah Anda menyetujui cookies atau menekan tombol di bawah.
              </p>
              <button
                type="button"
                class="px-6 py-3 rounded-full bg-fortu-dark text-fortu-off-white font-medium hover:opacity-90 transition-opacity"
                @click="mapLoaded = true"
              >
                Tampilkan peta
              </button>
            </div>

            <div v-else class="absolute inset-0 flex items-center justify-center p-6 text-center">
              <p class="text-fortu-medium">Peta segera hadir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Office } from '@/sanity/queries'
import { safeUrl, safeEmbedUrl, formatHours } from '@/utils/offices'

const props = defineProps<{ offices: Office[] }>()

const active = ref(0)
const consent = () => {
  try {
    return localStorage.getItem('fortu_cookie_consent') === 'accepted'
  } catch {
    return false
  }
}
const mapLoaded = ref(consent())

const current = computed(() => props.offices[active.value])
const embedUrl = computed(() => safeEmbedUrl(current.value?.mapsEmbed))
const hours = computed(() => formatHours(current.value?.openingHours))

const move = (step: number) => {
  const n = props.offices.length
  active.value = (active.value + step + n) % n
  document.getElementById(`office-tab-${active.value}`)?.focus()
}

// keep the selection valid if the list changes
watch(
  () => props.offices.length,
  (n) => {
    if (active.value >= n) active.value = 0
  },
)
</script>
