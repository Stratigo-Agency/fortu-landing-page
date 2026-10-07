<template>
  <section v-if="faq && !loading" class="faq-section py-16 bg-fortu-off-white">
    <div class="mx-auto px-4 md:px-16">
      <!-- Section Header -->
      <div class="text-left mb-16">
        <h2 class="text-4xl md:text-6xl font-medium text-fortu-dark mb-6 tracking-tight">
          {{ faq.heading }}
        </h2>
        <p v-if="faq.subheading" class="text-fortu-medium text-lg max-w-2xl mx-auto leading-relaxed">
          {{ faq.subheading }}
        </p>
      </div>

      <!-- FAQ Accordion -->
      <div class="">
        <div 
          v-for="(item, index) in faq.items" 
          :key="item._key || index"
          class="faq-item border-b border-fortu-light/30"
        >
          <button
            @click="toggleItem(index)"
            :aria-label="`${openItems.includes(index) ? 'Collapse' : 'Expand'} question: ${item.question}`"
            :aria-expanded="openItems.includes(index) ? 'true' : 'false'"
            class="w-full py-6 flex items-center justify-between text-left group"
          >
            <span class="text-lg font-medium text-fortu-dark group-hover:text-fortu-medium transition-colors pr-8">
              {{ item.question }}
            </span>
            <span 
              class="flex-shrink-0 w-10 h-10 rounded-full border border-fortu-light/50 flex items-center justify-center transition-all duration-300"
              :class="openItems.includes(index) ? 'bg-fortu-dark border-fortu-dark rotate-180' : 'bg-transparent'"
            >
              <svg 
                class="w-5 h-5 transition-colors duration-300"
                :class="openItems.includes(index) ? 'text-fortu-off-white' : 'text-fortu-dark'"
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
            :class="openItems.includes(index) ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'"
          >
            <p class="text-fortu-medium leading-relaxed">
              {{ item.answer }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Loading State -->
  <section v-else-if="loading" class="py-24 bg-fortu-off-white">
    <div class="container mx-auto px-4 md:px-16">
      <div class="flex justify-center">
        <div class="w-8 h-8 border-2 border-fortu-dark border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  </section>

  <SectionSkeleton v-else-if="loading" min-height="min-h-[60vh]" align="left" :cards="0" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { client } from '@/sanity/client'
import { FAQ_QUERY, type FAQ } from '@/sanity/queries'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { faqSchema } from '@/utils/structuredData'

const faq = ref<FAQ | null>(null)
const loading = ref(true)
const openItems = ref<number[]>([])

useJsonLd('faq', () => faqSchema(faq.value))

const toggleItem = (index: number) => {
  const idx = openItems.value.indexOf(index)
  if (idx === -1) {
    openItems.value.push(index)
  } else {
    openItems.value.splice(idx, 1)
  }
}

onMounted(async () => {
  try {
    faq.value = await client.fetch(FAQ_QUERY)
  } catch (e) {
    console.error('Failed to fetch FAQ:', e)
  } finally {
    loading.value = false
  }
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


