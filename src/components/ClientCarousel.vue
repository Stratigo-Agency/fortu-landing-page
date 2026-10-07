<template>
  <section class="client-carousel-section bg-white py-14 md:py-24" aria-labelledby="client-carousel-title">
    <div class="mx-auto px-4 md:px-16 mb-10 md:mb-14 text-center">
      <p class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-fortu-medium mb-3">Klien kami</p>
      <h2
        id="client-carousel-title"
        class="text-2xl md:text-4xl font-medium tracking-tight text-fortu-dark"
      >
        Dipercaya oleh institusi dan perusahaan di Indonesia
      </h2>
    </div>

    <!-- Two rows moving in opposite directions; logos float on white, no boxes -->
    <div class="carousel-rows flex flex-col gap-6 md:gap-10">
      <div
        v-for="(row, rowIndex) in clientLogoRows"
        :key="rowIndex"
        class="carousel-row"
        :class="rowIndex === 1 ? 'carousel-row-reverse' : ''"
      >
        <div class="carousel-viewport">
          <div class="carousel-track flex w-max items-center">
            <!-- Two identical sets give a seamless loop (track moves 50%) -->
            <ul
              v-for="setIndex in 2"
              :key="setIndex"
              class="carousel-set flex flex-shrink-0 items-center"
              :class="{ 'carousel-set-clone': setIndex === 2 }"
              :aria-hidden="setIndex === 2 ? 'true' : undefined"
            >
              <li
                v-for="logo in row"
                :key="logo.file"
                class="carousel-card flex flex-shrink-0 items-center justify-center"
              >
                <img
                  :src="logo.src"
                  :alt="setIndex === 1 ? logo.name : ''"
                  loading="lazy"
                  decoding="async"
                  :width="logo.width"
                  :height="logo.height"
                  class="carousel-logo w-auto max-w-none select-none"
                  :style="{ '--logo-h': `${logo.displayHeight}px` }"
                  draggable="false"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { clientLogoRows } from '@/data/clientLogos'
</script>

<style scoped>
.client-carousel-section {
  --logo-scale: 1;
  --logo-gap: 6rem;
}

@media (max-width: 767px) {
  .client-carousel-section {
    --logo-scale: 0.7;
    --logo-gap: 3rem;
  }
}

/* Soft fade at both edges so logos glide in and out of the white page */
.carousel-rows {
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%);
}

.carousel-viewport {
  overflow: hidden;
}

.carousel-track {
  animation: scroll-left 90s linear infinite;
}

.carousel-row-reverse .carousel-track {
  animation-name: scroll-right;
  animation-duration: 105s;
}

/* Pause the row the visitor points at */
.carousel-row:hover .carousel-track {
  animation-play-state: paused;
}

.carousel-card {
  height: 5rem;
  padding: 0 calc(var(--logo-gap) / 2);
}

.carousel-logo {
  height: calc(var(--logo-h) * var(--logo-scale));
}

@keyframes scroll-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes scroll-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

/* Reduced motion: no animation, each row becomes manually scrollable */
@media (prefers-reduced-motion: reduce) {
  .carousel-track {
    animation: none !important;
  }

  .carousel-viewport {
    overflow-x: auto;
  }

  .carousel-set-clone {
    display: none;
  }
}
</style>
