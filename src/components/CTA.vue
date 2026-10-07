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
        v-if="whatsappLink"
        :href="whatsappLink"
        target="_blank"
        :variant="variant === 'light' ? 'primary' : 'inverted'"
        size="lg"
        class="cta-button inline-flex items-center gap-3"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {{ buttonLabel }}
      </Button>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-[420px] md:min-h-[520px]" :tone="variant === 'light' ? 'light' : 'dark'" :cards="0" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  description: 'Punya pertanyaan atau ingin membeli? Hubungi kami langsung melalui WhatsApp untuk tanggapan yang cepat.',
  buttonLabel: 'Chat on WhatsApp',
  variant: 'dark'
})

const settings = ref<SiteSettings | null>(null)
const loading = ref(true)

const whatsappLink = computed(() => {
  if (!settings.value?.whatsapp) return null
  // Remove any non-numeric characters except +
  const phone = settings.value.whatsapp.replace(/[^\d+]/g, '')
  // Remove leading + if present for wa.me format
  const cleanPhone = phone.startsWith('+') ? phone.slice(1) : phone
  return `https://wa.me/${cleanPhone}`
})


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

