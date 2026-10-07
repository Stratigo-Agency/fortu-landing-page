<template>
  <section class="client-carousel-section pt-6 pb-4 md:pt-8 md:pb-6" aria-label="Klien Fortu Digital">
    <!-- Label row: aligned with the hero content grid -->
    <div class="carousel-label mx-auto px-4 md:px-16 mb-4 md:mb-5 flex items-center gap-4">
      <p class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-white/60 whitespace-nowrap">
        Dipercaya oleh
      </p>
      <span class="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" aria-hidden="true"></span>
    </div>

    <!-- Glass band: logos float directly on it, no boxes around them -->
    <div class="carousel-strip relative">
      <div class="carousel-viewport">
        <div class="carousel-track flex w-max items-center">
          <!-- Two identical sets give a seamless loop (track moves -50%) -->
          <ul
            v-for="setIndex in 2"
            :key="setIndex"
            class="carousel-set flex flex-shrink-0 items-center"
            :class="{ 'carousel-set-clone': setIndex === 2 }"
            :aria-hidden="setIndex === 2 ? 'true' : undefined"
          >
            <li
              v-for="logo in clientLogos"
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
  </section>
</template>

<script setup lang="ts">
import { clientLogos } from '@/data/clientLogos'
</script>

<style scoped>
.client-carousel-section {
  --logo-scale: 1;
  --logo-gap: 4.5rem;
}

@media (max-width: 767px) {
  .client-carousel-section {
    --logo-scale: 0.78;
    --logo-gap: 3rem;
  }
}

/* Frosted glass (brand: navy / blue-black tint) fading out toward both edges */
.carousel-strip {
  padding: 1.1rem 0;
  background: linear-gradient(
    180deg,
    rgba(14, 22, 42, 0.5) 0%,
    rgba(10, 16, 32, 0.32) 100%
  );
  backdrop-filter: blur(14px) saturate(120%);
  -webkit-backdrop-filter: blur(14px) saturate(120%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0, #000 9%, #000 91%, transparent 100%);
}

.carousel-viewport {
  overflow: hidden;
}

.carousel-track {
  animation: scroll 80s linear infinite;
}

/* Pause while the visitor points at the strip */
.carousel-strip:hover .carousel-track {
  animation-play-state: paused;
}

.carousel-card {
  height: 4rem;
  padding: 0 calc(var(--logo-gap) / 2);
}

.carousel-logo {
  height: calc(var(--logo-h) * var(--logo-scale));
  opacity: 0.72;
  transition: opacity 0.3s ease;
}

.carousel-card:hover .carousel-logo {
  opacity: 1;
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
