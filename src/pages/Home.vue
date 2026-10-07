<template>
  <div>
    <!-- Hero Section -->
    <Hero />

    <!-- Client logos (own section, white background) -->
    <ClientCarousel />

    <!-- Product Slides -->
    <BannerSlides />

    <!-- Product Compare Section (directly below the product slides) -->
    <Compare />

    <!-- CMS Demo Section -->
    <CMSDemo />
    <Service />

    <!-- Use Case Section -->
    <UseCaseSection />

    <!-- FAQ Section -->
    <FAQ />
    <CTA variant="light" />
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
// Lazy load below-the-fold components
import Hero from '@/components/Hero.vue'
import ClientCarousel from '@/components/ClientCarousel.vue'
import { defineAsyncComponent } from 'vue'

// Defer non-critical components until needed
const CMSDemo = defineAsyncComponent({
  loader: () => import('@/components/CMSDemo.vue'),
  delay: 200, // Delay loading by 200ms
  timeout: 3000,
})
const UseCaseSection = defineAsyncComponent({
  loader: () => import('@/components/UseCaseSection.vue'),
  delay: 200,
  timeout: 3000,
})
const BannerSlides = defineAsyncComponent({
  loader: () => import('@/components/BannerSlides.vue'),
  delay: 200,
  timeout: 3000,
})
const FAQ = defineAsyncComponent({
  loader: () => import('@/components/FAQ.vue'),
  delay: 200,
  timeout: 3000,
})
const Compare = defineAsyncComponent({
  loader: () => import('@/components/Compare.vue'),
  delay: 200,
  timeout: 3000,
})
const CTA = defineAsyncComponent({
  loader: () => import('@/components/CTA.vue'),
  delay: 200,
  timeout: 3000,
})
const Service = defineAsyncComponent({
  loader: () => import('@/components/Service.vue'),
  delay: 200,
  timeout: 3000,
})

usePageSeo('home', {
  title: 'Digital Signage Indonesia | Fortu Digital',
  description:
    'Perangkat digital signage, interactive display, CMS cloud Marien, dan instalasi untuk bisnis dan institusi di Indonesia. Konsultasikan kebutuhan Anda.',
  path: '/',
})
</script>

<style scoped>
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
</style>

