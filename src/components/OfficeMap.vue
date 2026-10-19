<template>
  <section class="office-map bg-white py-16 md:py-24" aria-labelledby="office-map-title" data-track-source="office_map">
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

          <!-- WhatsApp numbers open WhatsApp (logo); regular numbers start a call (phone icon) -->
          <p v-if="phone">
            <a
              :href="phone.href"
              :target="phone.kind === 'whatsapp' ? '_blank' : undefined"
              :rel="phone.kind === 'whatsapp' ? 'noopener noreferrer' : undefined"
              :aria-label="phone.kind === 'whatsapp' ? `Chat WhatsApp ke ${phone.display}` : `Telepon ${phone.display}`"
              class="group inline-flex items-center gap-3"
            >
              <span
                class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105"
                :class="phone.kind === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-fortu-dark text-fortu-off-white'"
              >
                <svg v-if="phone.kind === 'whatsapp'" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <span class="flex flex-col leading-tight">
                <span class="text-lg font-medium text-fortu-dark underline underline-offset-4">{{ phone.display }}</span>
                <span class="mt-1 text-sm text-fortu-medium">{{ phone.kind === 'whatsapp' ? 'Chat lewat WhatsApp' : 'Telepon kantor' }}</span>
              </span>
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
import { safeUrl, safeEmbedUrl, formatHours, officePhone } from '@/utils/offices'

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
const phone = computed(() => (current.value ? officePhone(current.value) : null))

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
