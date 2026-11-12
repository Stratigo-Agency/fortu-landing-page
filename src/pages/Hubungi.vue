<template>
  <div class="min-h-screen bg-fortu-off-white">
    <!-- dark band: the navbar is light text over the top of every page -->
    <div class="bg-fortu-dark px-4 pt-28 pb-12 md:pt-36 md:pb-16 text-center">
      <h1 class="text-3xl md:text-5xl font-medium tracking-tight text-fortu-off-white">Hubungi Fortu Digital</h1>
      <p class="mt-3 text-fortu-light">Chat langsung dengan tim sales kami lewat WhatsApp.</p>
    </div>

    <div class="max-w-xl mx-auto px-4 pt-8 pb-16 md:pb-24">
      <section class="space-y-3" aria-labelledby="hubungi-sales" data-track-source="hubungi_sales">
        <h2 id="hubungi-sales" class="sr-only">Chat dengan sales</h2>
        <a
          v-for="team in teams"
          :key="team.id"
          :href="team.href"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 rounded-2xl bg-fortu-dark text-fortu-off-white p-4 sm:p-5 hover:opacity-90 transition-opacity"
        >
          <span class="w-11 h-11 rounded-full bg-fortu-off-white/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z" />
            </svg>
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-lg font-medium">Chat {{ team.title }}</span>
            <span class="block text-sm opacity-75">WhatsApp, kantor {{ team.city }}</span>
          </span>
        </a>
      </section>

      <section
        id="partnership"
        class="mt-8 scroll-mt-28 space-y-3"
        aria-labelledby="hubungi-partnership"
        data-track-source="hubungi_partnership"
      >
        <h2 id="hubungi-partnership" class="text-sm font-medium text-fortu-medium uppercase tracking-wide">
          Partnership &amp; Kolaborasi
        </h2>
        <p class="text-fortu-medium">Kerja sama bisnis, program kemitraan, reseller, dan kolaborasi proyek.</p>
        <a
          :href="partnership.whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between rounded-2xl border border-fortu-light/70 bg-white p-4 text-fortu-dark hover:border-fortu-dark transition-colors"
        >
          <span class="font-medium">Chat soal partnership</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a
          v-if="partnership.email"
          :href="partnership.email"
          class="flex items-center justify-between rounded-2xl border border-fortu-light/70 bg-white p-4 text-fortu-dark hover:border-fortu-dark transition-colors"
        >
          <span class="font-medium">Kirim email proposal</span>
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section class="mt-8 space-y-3" aria-labelledby="hubungi-links" data-track-source="hubungi_links">
        <h2 id="hubungi-links" class="text-sm font-medium text-fortu-medium uppercase tracking-wide">Lainnya</h2>
        <RouterLink
          to="/products"
          class="flex items-center justify-between rounded-2xl border border-fortu-light/70 bg-white p-4 text-fortu-dark hover:border-fortu-dark transition-colors"
        >
          <span class="font-medium">Katalog produk</span>
          <span aria-hidden="true">→</span>
        </RouterLink>
        <a
          v-for="link in otherLinks"
          :key="link.id"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-between rounded-2xl border border-fortu-light/70 bg-white p-4 text-fortu-dark hover:border-fortu-dark transition-colors"
          @click="trackEvent('click_outbound', { link_id: link.id, page_path: '/hubungi' })"
        >
          <span class="font-medium">{{ link.title }}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <section v-if="offices.length" class="mt-8" aria-labelledby="hubungi-offices">
        <h2 id="hubungi-offices" class="text-sm font-medium text-fortu-medium uppercase tracking-wide">Kantor</h2>
        <ul class="mt-3 space-y-3">
          <li
            v-for="(office, i) in offices"
            :key="office._key || i"
            class="rounded-2xl border border-fortu-light/70 bg-white p-4"
          >
            <p class="font-medium text-fortu-dark">{{ officeLabel(office) || office.city }}</p>
            <p v-if="office.address" class="mt-1 text-sm text-fortu-medium">{{ office.address }}</p>
            <a
              v-if="safeUrl(office.mapsUrl)"
              :href="safeUrl(office.mapsUrl)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 inline-block text-sm font-medium text-fortu-dark underline underline-offset-4"
            >
              Buka di Google Maps
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSanityQuery } from '@/composables/useSanityQuery'
import { useAnalytics } from '@/composables/useAnalytics'
import { usePageSeo } from '@/composables/usePageSeo'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/queries'
import { SALES_TEAMS, SHOP_LINKS, buildSalesWhatsAppUrl } from '@/config/contact'
import { getOffices, isListable, officeLabel, safeUrl } from '@/utils/offices'

// The page behind the Instagram / TikTok bio link and the "Hubungi Sales" button. It replaces the Linktree so the
// visit stays on fortu.co.id (GA4 and the Meta Pixel see it) and every chat goes through the CRM's tracked link.
usePageSeo('hubungi', {
  title: 'Hubungi Fortu Digital | Chat Sales via WhatsApp',
  description:
    'Chat langsung dengan tim sales Fortu Digital di Jakarta atau Medan lewat WhatsApp, lihat katalog, toko online, dan alamat kantor kami.',
})

const { trackEvent } = useAnalytics()
const { data: settings } = useSanityQuery<SiteSettings | null>(SITE_SETTINGS_QUERY, { label: 'site settings' })

const teams = computed(() =>
  SALES_TEAMS.map((team) => ({ ...team, href: buildSalesWhatsAppUrl(team, { location: `hubungi_${team.id}` }) })),
)

// Partnership chats go through the CRM's tracked link too (campaign "partnership"), so they are recorded there and
// told apart from sales enquiries.
const partnership = computed(() => ({
  whatsapp: buildSalesWhatsAppUrl(SALES_TEAMS[0], {
    location: 'hubungi_partnership',
    productSlug: 'partnership',
    text: 'Halo Fortu, saya tertarik kerja sama (partnership / kolaborasi).',
  }),
  email: settings.value?.email
    ? `mailto:${settings.value.email}?subject=${encodeURIComponent('Partnership & Kolaborasi')}`
    : null,
}))

const otherLinks = computed(() => {
  const social = settings.value?.socialMedia
  const links: { id: string; title: string; href: string }[] = []
  if (safeUrl(social?.instagram)) links.push({ id: 'instagram', title: 'Instagram', href: social!.instagram! })
  if (safeUrl(social?.tiktok)) links.push({ id: 'tiktok', title: 'TikTok', href: social!.tiktok! })
  if (safeUrl(social?.youtube)) links.push({ id: 'youtube', title: 'YouTube', href: social!.youtube! })
  return [...links, ...SHOP_LINKS]
})

const offices = computed(() => getOffices(settings.value).filter(isListable))
</script>
