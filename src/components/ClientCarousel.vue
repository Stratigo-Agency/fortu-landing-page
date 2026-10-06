<template>
  <section class="client-carousel-section py-6 md:py-8" aria-label="Klien Fortu Digital">
    <div class="mx-auto px-4 md:px-16 mb-4">
      <p class="text-fortu-off-white/80 text-sm uppercase tracking-wider text-center">Dipercaya Oleh</p>
    </div>
    <!-- Glass strip keeps logos readable on top of the moving hero video -->
    <div class="carousel-strip overflow-hidden border-y border-white/10 bg-black/40 backdrop-blur-md py-4">
      <div class="carousel-viewport">
        <div class="carousel-track flex w-max">
          <!-- Two identical sets give a seamless loop (track moves -50%) -->
          <div
            v-for="setIndex in 2"
            :key="setIndex"
            class="carousel-set flex flex-shrink-0 gap-4 pr-4"
            :class="{ 'carousel-set-clone': setIndex === 2 }"
            :aria-hidden="setIndex === 2 ? 'true' : undefined"
          >
            <div
              v-for="logo in clientLogos"
              :key="logo.file"
              class="carousel-card flex-shrink-0 h-20 w-44 rounded-lg overflow-hidden"
              :class="logo.tone === 'dark' ? 'bg-[#111315]' : 'bg-[#f3f4f6]'"
            >
              <img
                :src="logo.src"
                :alt="setIndex === 1 ? logo.name : ''"
                loading="lazy"
                decoding="async"
                width="176"
                height="80"
                class="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { clientLogos } from '@/data/clientLogos'
</script>

<style scoped>
.carousel-track {
  animation: scroll 60s linear infinite;
}

/* Pause while the visitor points at the strip */
.carousel-strip:hover .carousel-track {
  animation-play-state: paused;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Reduced motion: no animation, strip becomes manually scrollable */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none;
  }

  .carousel-viewport {
    overflow-x: auto;
  }

  .carousel-set-clone {
    display: none;
  }
}
</style>
