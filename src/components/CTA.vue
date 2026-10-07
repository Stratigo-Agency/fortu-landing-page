<template>
  <section 
    v-if="settings && !loading" 
    data-track-source="cta_section"
    class="cta-section relative py-20 md:py-32 overflow-hidden"
    :class="variant === 'light' ? 'bg-fortu-off-white' : 'bg-fortu-dark'"
  >
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>
    
    <!-- Gradient Accent -->
  
    
    <!-- Content -->
    <div class="relative z-10 px-4 md:px-16 max-w-4xl mx-auto text-center">
      <h2 
        class="text-3xl md:text-5xl lg:text-6xl font-medium mb-6 tracking-tight cta-title"
        :class="variant === 'light' ? 'text-fortu-dark' : 'text-fortu-off-white'"
      >
        {{ heading }}
      </h2>
      <p 
        class="text-lg md:text-xl mb-10 max-w-2xl mx-auto cta-description"
        :class="variant === 'light' ? 'text-fortu-medium' : 'text-fortu-light'"
      >
        {{ description }}
      </p>
      
      <Button
        :variant="variant === 'light' ? 'primary' : 'inverted'"
        size="lg"
        class="cta-button inline-flex items-center gap-3"
        @click="openChooser('cta_section')"
      >
        {{ buttonLabel }}
      </Button>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-[420px] md:min-h-[520px]" :tone="variant === 'light' ? 'light' : 'dark'" :cards="0" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useContactChooser } from '@/composables/useContactChooser'
import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY, type SiteSettings } from '@/sanity/queries'
import Button from '@/reusables/Button.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

interface Props {
  heading?: string
  description?: string
  buttonLabel?: string
  variant?: 'dark' | 'light'
}

withDefaults(defineProps<Props>(), {
  heading: 'Solusi Digital Signage bersama Kami',
  description: 'Punya pertanyaan atau ingin berdiskusi? Hubungi tim Fortu Digital untuk konsultasi kebutuhan Anda.',
  buttonLabel: 'Hubungi Kami',
  variant: 'dark'
})

const settings = ref<SiteSettings | null>(null)
const loading = ref(true)
const { openChooser } = useContactChooser()



onMounted(async () => {
  try {
    settings.value = await client.fetch(SITE_SETTINGS_QUERY)
  } catch (e) {
    console.error('Failed to fetch site settings:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.cta-title {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.cta-description {
  animation: fadeInUp 0.8s ease-out 0.15s forwards;
  opacity: 0;
}

.cta-button {
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

