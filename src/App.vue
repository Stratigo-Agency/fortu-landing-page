<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/queries'
import { useContactTracking } from '@/composables/useContactTracking'
import { useJsonLd } from '@/composables/useJsonLd'
import { organizationGraph } from '@/utils/structuredData'

const siteSettings = ref<SiteSettings | null>(null)
useContactTracking()

useJsonLd('organization', () => organizationGraph(siteSettings.value))

// Format WhatsApp number for link (remove spaces, dashes, etc.)
const whatsappLink = computed(() => {
  if (!siteSettings.value?.whatsapp) return null
  const number = siteSettings.value.whatsapp.replace(/[^0-9+]/g, '')
  return `https://wa.me/${number.replace('+', '')}`
})

onMounted(async () => {
  try {
    siteSettings.value = await client.fetch(SITE_SETTINGS_QUERY)
  } catch (e) {
    console.error('Failed to fetch site settings:', e)
  }
})
</script>

<template>
  <Navbar />
  <main>
    <RouterView />
  </main>
  <Footer />
  
  <!-- Cookie Banner -->
  <CookieBanner />
  
  <!-- WhatsApp Floating Button -->
  <a 
    v-if="whatsappLink"
    :href="whatsappLink"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-button"
    aria-label="Chat on WhatsApp"
    data-track-source="floating_button"
  >
    <svg viewBox="0 0 24 24" fill="currentColor" class="whatsapp-icon">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
</template>

<style>
:root {
  --bg: #1A1A1A;
  --fg: #fafafa;
  --accent: #f43f5e;
  --muted: #71717a;
  --card: #1a1a1a;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  background: var(--bg);
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--fg);
  min-height: 100vh;
  opacity: 0;
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.container {
  max-width: 640px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
}

.loading, .error, .empty {
  padding: 2rem;
  text-align: center;
  color: var(--muted);
  background: var(--card);
  border-radius: 8px;
}

.error {
  color: var(--accent);
}

.posts {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post {
  padding: 1.5rem;
  background: var(--card);
  border-radius: 8px;
  border: 1px solid transparent;
  transition: border-color 0.2s;
}

.post:hover {
  border-color: var(--accent);
}

.post h2 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.slug {
  font-size: 0.875rem;
  color: var(--muted);
  font-family: monospace;
}

/* WhatsApp Floating Button */
.whatsapp-button {
  position: fixed;
  bottom: calc(24px + var(--cookie-banner-height, 0px));
  right: 24px;
  width: 56px;
  height: 56px;
  background-color: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  z-index: 1000;
  cursor: pointer;
}

.whatsapp-button:hover {
  background-color: #20BD5A;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
}

.whatsapp-button:active {
  transform: scale(1.05);
}

.whatsapp-icon {
  width: 28px;
  height: 28px;
  color: white;
}

@media (max-width: 768px) {
  .whatsapp-button {
    bottom: calc(16px + var(--cookie-banner-height, 0px));
    right: 16px;
    width: 50px;
    height: 50px;
  }
  
  .whatsapp-icon {
    width: 24px;
    height: 24px;
  }
}
</style>

