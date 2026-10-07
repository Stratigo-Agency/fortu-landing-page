<template>
  <div class="contact-page bg-fortu-off-white min-h-screen">
    <PageHero 
      pageName="contact" 
      fallbackTitle="Contact Us"
      fallbackSubtitle="We'd love to hear from you"
    />

    <!-- Loading State - two columns, like the real contact layout -->
    <SectionSkeleton v-if="loading" min-height="min-h-[70vh]" align="left" :cards="0">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full">
        <div class="space-y-4">
          <div class="skeleton h-12 md:h-16 w-2/3 rounded-lg"></div>
          <div class="skeleton h-4 w-full rounded"></div>
          <div class="skeleton h-4 w-5/6 rounded"></div>
          <div class="skeleton h-24 w-full rounded-2xl mt-8"></div>
          <div class="skeleton h-24 w-full rounded-2xl"></div>
        </div>
        <div class="skeleton h-[420px] w-full rounded-2xl"></div>
      </div>
    </SectionSkeleton>

    <!-- Contact Content -->
    <div v-else class="px-4 md:px-16 py-16 md:py-24">
      <div class="">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          <!-- Left Column: Contact Info -->
          <div class="space-y-8">
            <div>
              <h2 class="text-4xl md:text-6xl font-medium text-fortu-dark mb-4 tracking-tight">
                Get in Touch
              </h2>
              <p class="text-fortu-medium leading-relaxed">
                Have questions about our products or services? We're here to help. 
                Reach out through any of the channels below.
              </p>
            </div>

            <!-- Contact Cards -->
            <div class="space-y-4">
              <!-- Offices -->
              <div
                v-for="(office, i) in offices"
                :key="office._key || i"
                class="contact-card p-6 bg-white rounded-lg"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-fortu-dark/5 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-fortu-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-fortu-medium uppercase tracking-wider mb-1">
                      {{ office.city ? `Kantor ${office.city}` : 'Address' }}
                    </p>
                    <p v-if="office.name && office.address" class="text-fortu-dark font-medium">{{ office.name }}</p>
                    <p class="text-fortu-dark whitespace-pre-line">{{ office.address || officeLabel(office) }}</p>
                    <a
                      v-if="safeUrl(office.mapsUrl)"
                      :href="safeUrl(office.mapsUrl)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-block mt-2 text-sm text-fortu-dark underline"
                    >
                      Lihat di Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <!-- Phone -->
              <a 
                v-if="settings?.phone" 
                :href="`tel:${settings.phone.replace(/\s/g, '')}`"
                class="contact-card block p-6 bg-white rounded-lg"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-fortu-dark/5 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-fortu-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-fortu-medium uppercase tracking-wider mb-1">Phone</p>
                    <p class="text-fortu-dark">{{ settings.phone }}</p>
                  </div>
                </div>
              </a>

              <!-- Email -->
              <div 
                v-if="settings?.email" 
                :href="`mailto:${settings.email}`"
                class="contact-card block p-6 bg-white rounded-lg"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-fortu-dark/5 flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-fortu-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-fortu-medium uppercase tracking-wider mb-1">Email</p>
                    <p class="text-fortu-dark">{{ settings.email }}</p>
                  </div>
                </div>
              </div>

              <!-- WhatsApp -->
              <a 
                v-if="settings?.whatsapp" 
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-card group block p-6 bg-fortu-dark/90 rounded-lg border border-green-200/50 hover:border-green-300 transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-full bg-fortu-off-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg class="w-5 h-5 text-fortu-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-fortu-off-white uppercase tracking-wider mb-1">WhatsApp</p>
                    <p class="text-fortu-off-white group-hover:text-fortu-off-white transition-colors">{{ settings.whatsapp }}</p>
                  </div>
                </div>
              </a>
            </div>

            <!-- Social Media -->
            <div v-if="hasSocialMedia" class="pt-4">
              <p class="text-sm font-medium text-fortu-medium uppercase tracking-wider mb-4">Follow Us</p>
              <div class="flex flex-wrap gap-4">
                <!-- Instagram -->
                <a 
                  v-if="settings?.socialMedia?.instagram"
                  :href="settings.socialMedia.instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-fortu-medium/20 text-fortu-dark flex items-center justify-center hover:bg-fortu-off-white hover:text-fortu-dark transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                <!-- Facebook -->
                <a 
                  v-if="settings?.socialMedia?.facebook"
                  :href="settings.socialMedia.facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-fortu-medium/20 text-fortu-dark flex items-center justify-center hover:bg-fortu-off-white hover:text-fortu-dark transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                <!-- Twitter/X -->
                <a 
                  v-if="settings?.socialMedia?.twitter"
                  :href="settings.socialMedia.twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-fortu-medium/20 text-fortu-dark flex items-center justify-center hover:bg-fortu-off-white hover:text-fortu-dark transition-all duration-300"
                  aria-label="Twitter/X"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                <!-- LinkedIn -->
                <a 
                  v-if="settings?.socialMedia?.linkedin"
                  :href="settings.socialMedia.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-fortu-medium/20 text-fortu-dark flex items-center justify-center hover:bg-fortu-off-white hover:text-fortu-dark transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                <!-- YouTube -->
                <a 
                  v-if="settings?.socialMedia?.youtube"
                  :href="settings.socialMedia.youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-fortu-medium/20 text-fortu-dark flex items-center justify-center hover:bg-fortu-off-white hover:text-fortu-dark transition-all duration-300"
                  aria-label="YouTube"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                <!-- TikTok -->
                <a 
                  v-if="settings?.socialMedia?.tiktok"
                  :href="settings.socialMedia.tiktok"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-10 h-10 rounded-full bg-fortu-medium/20 text-fortu-dark flex items-center justify-center hover:bg-fortu-off-white hover:text-fortu-dark transition-all duration-300"
                  aria-label="TikTok"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Right Column: FAQ -->
          <div class="space-y-8">
            <div v-if="faq">
              <h2 class="text-2xl md:text-6xl font-medium text-fortu-dark mb-4 tracking-tight">
                {{ faq.heading || 'Frequently Asked Questions' }}
              </h2>
              <p v-if="faq.subheading" class="text-fortu-medium leading-relaxed mb-8">
                {{ faq.subheading }}
              </p>

              <!-- FAQ Accordion -->
              <div class="space-y-0">
                <div 
                  v-for="(item, index) in faq.items" 
                  :key="item._key || index"
                  class="faq-item border-b border-fortu-light/30"
                >
                  <button
                    @click="toggleFaqItem(index)"
                    :aria-label="`${openFaqItems.includes(index) ? 'Collapse' : 'Expand'} question: ${item.question}`"
                    :aria-expanded="openFaqItems.includes(index) ? 'true' : 'false'"
                    class="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span class="text-lg font-medium text-fortu-dark group-hover:text-fortu-medium transition-colors pr-8">
                      {{ item.question }}
                    </span>
                    <span 
                      class="flex-shrink-0 w-10 h-10 rounded-full border border-fortu-light/50 flex items-center justify-center transition-all duration-300"
                      :class="openFaqItems.includes(index) ? 'bg-fortu-dark border-fortu-dark rotate-180' : 'bg-transparent'"
                    >
                      <svg 
                        class="w-5 h-5 transition-colors duration-300"
                        :class="openFaqItems.includes(index) ? 'text-fortu-off-white' : 'text-fortu-dark'"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    class="faq-answer overflow-hidden transition-all duration-300 ease-in-out"
                    :class="openFaqItems.includes(index) ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'"
                  >
                    <p class="text-fortu-medium leading-relaxed">
                      {{ item.answer }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State for FAQ -->
            <div v-else-if="faqLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-2 border-fortu-dark border-t-transparent rounded-full animate-spin"></div>
            </div>          
          </div>
        </div>
      </div>
    </div>
    <CTA />
  </div>
</template>

<script setup lang="ts">
import { getOffices, safeUrl, officeLabel } from '@/utils/offices'
import { usePageSeo } from '@/composables/usePageSeo'
import { ref, computed, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY, FAQ_QUERY, type SiteSettings, type FAQ } from '@/sanity/queries'
import PageHero from '@/components/PageHero.vue'
import CTA from '@/components/CTA.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'
const settings = ref<SiteSettings | null>(null)
const faq = ref<FAQ | null>(null)
const loading = ref(true)
const faqLoading = ref(true)
const openFaqItems = ref<number[]>([])

const whatsappLink = computed(() => {
  if (!settings.value?.whatsapp) return '#'
  const phone = settings.value.whatsapp.replace(/[^\d+]/g, '')
  const cleanPhone = phone.startsWith('+') ? phone.slice(1) : phone
  return `https://wa.me/${cleanPhone}`
})

const offices = computed(() => getOffices(settings.value))

const hasSocialMedia = computed(() => {
  const social = settings.value?.socialMedia
  if (!social) return false
  return social.instagram || social.facebook || social.twitter || social.linkedin || social.youtube || social.tiktok
})

const toggleFaqItem = (index: number) => {
  const idx = openFaqItems.value.indexOf(index)
  if (idx === -1) {
    openFaqItems.value.push(index)
  } else {
    openFaqItems.value.splice(idx, 1)
  }
}

onMounted(async () => {
  try {
    const [settingsData, faqData] = await Promise.all([
      client.fetch(SITE_SETTINGS_QUERY),
      client.fetch(FAQ_QUERY)
    ])
    settings.value = settingsData
    faq.value = faqData
  } catch (e) {
    console.error('Failed to fetch data:', e)
  } finally {
    loading.value = false
    faqLoading.value = false
  }
})

usePageSeo('contact', {
  title: 'Hubungi Fortu Digital | Konsultasi Digital Signage',
  description:
    'Hubungi tim Fortu Digital lewat WhatsApp, telepon, atau email untuk konsultasi digital signage dan interactive display, dari perangkat sampai instalasi.',
})
</script>

<style scoped>
.faq-item:first-child {
  border-top: 1px solid rgba(191, 191, 191, 0.3);
}

.faq-answer {
  will-change: max-height, opacity;
}
</style>
