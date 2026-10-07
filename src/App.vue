<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import CookieBanner from '@/components/CookieBanner.vue'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/queries'
import { useContactTracking } from '@/composables/useContactTracking'
import { useContactChooser } from '@/composables/useContactChooser'
import ContactChooser from '@/components/ContactChooser.vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { organizationGraph } from '@/utils/structuredData'

const siteSettings = ref<SiteSettings | null>(null)
useContactTracking()
const { openChooser } = useContactChooser()

useJsonLd('organization', () => organizationGraph(siteSettings.value))

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
  
  <!-- Floating "Hubungi Kami" button -> opens the Sales / Partnership chooser -->
  <button type="button" class="contact-fab" aria-haspopup="dialog" @click="openChooser('floating_button')">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="contact-fab-icon" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M8 10h8M8 14h5m-9 6l2.6-3H18a3 3 0 003-3V7a3 3 0 00-3-3H6a3 3 0 00-3 3v13z" />
    </svg>
    <span class="contact-fab-label">Hubungi Kami</span>
  </button>

  <ContactChooser />
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

/* Floating contact button (Hubungi Kami) */
.contact-fab {
  position: fixed;
  bottom: calc(24px + var(--cookie-banner-height, 0px));
  right: 24px;
  height: 56px;
  padding: 0 22px 0 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--fg);
  color: #101111;
  border: 0;
  border-radius: 9999px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.01em;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.28);
  transition: all 0.3s ease;
  z-index: 1000;
  cursor: pointer;
}

.contact-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.34);
}

.contact-fab:active {
  transform: translateY(0);
}

.contact-fab:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
  box-shadow: 0 0 0 5px rgba(16, 17, 17, 0.9);
}

.contact-fab-icon {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .contact-fab {
    bottom: calc(16px + var(--cookie-banner-height, 0px));
    right: 16px;
    width: 52px;
    height: 52px;
    padding: 0;
    justify-content: center;
  }

  .contact-fab-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
}
</style>

