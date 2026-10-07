<template>
  <div class="blog-page bg-fortu-off-white min-h-screen">
    <PageHero
      pageName="blog"
      fallbackTitle="Blog"
      fallbackSubtitle="Wawasan, berita, dan cerita dari FORTU Digital"
    />

    <!-- Loading State - matches the featured post + grid layout -->
    <SectionSkeleton v-if="loading" min-height="min-h-[80vh]" align="left" :cards="0">
      <div class="skeleton w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl mb-6"></div>
      <div class="skeleton h-8 w-2/3 rounded-lg mb-3"></div>
      <div class="skeleton h-4 w-1/3 rounded mb-12"></div>
      <div class="grid gap-8 md:grid-cols-3 w-full">
        <div v-for="n in 3" :key="n">
          <div class="skeleton aspect-[16/10] w-full rounded-2xl mb-4"></div>
          <div class="skeleton h-5 w-3/4 rounded mb-2"></div>
          <div class="skeleton h-4 w-1/2 rounded"></div>
        </div>
      </div>
    </SectionSkeleton>

    <!-- Empty State -->
    <div
      v-else-if="!posts.length"
      class="max-w-4xl mx-auto px-4 md:px-16 py-24 text-center"
    >
      <h2 class="text-2xl md:text-3xl font-medium text-fortu-dark mb-4 tracking-tight">
        Belum ada artikel
      </h2>
      <p class="text-fortu-medium text-base md:text-lg">
        Artikel baru akan segera tersedia. Pantau terus halaman ini.
      </p>
    </div>

    <!-- Posts -->
    <div v-else class="max-w-7xl mx-auto px-4 md:px-16 py-16 md:py-24">
      <!-- Featured Post -->
      <RouterLink
        v-if="featuredPost"
        :to="`/blog/${featuredPost.slug.current}`"
        class="featured-post group block mb-16 md:mb-24"
      >
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div class="overflow-hidden rounded-2xl bg-fortu-light/30 aspect-[4/3]">
            <img
              v-if="coverImageUrl(featuredPost)"
              :src="coverImageUrl(featuredPost) as string"
              :alt="featuredPost.coverImage?.alt || featuredPost.title"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="text-xs md:text-sm font-medium text-fortu-medium uppercase tracking-wider">
                Featured
              </span>
              <span class="w-1 h-1 rounded-full bg-fortu-medium"></span>
              <span class="text-xs md:text-sm text-fortu-medium">
                {{ formatDate(featuredPost.publishedAt) }}
              </span>
            </div>
            <h2 class="text-3xl md:text-5xl font-medium text-fortu-dark mb-4 tracking-tight group-hover:text-fortu-medium transition-colors">
              {{ featuredPost.title }}
            </h2>
            <p v-if="featuredPost.excerpt" class="text-fortu-medium text-base md:text-lg leading-relaxed mb-6">
              {{ featuredPost.excerpt }}
            </p>
            <span class="inline-flex items-center gap-2 text-fortu-dark font-medium">
              Baca selengkapnya
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </span>
          </div>
        </div>
      </RouterLink>

      <!-- Grid of Posts -->
      <div v-if="otherPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        <RouterLink
          v-for="post in otherPosts"
          :key="post._id"
          :to="`/blog/${post.slug.current}`"
          class="post-card group block"
        >
          <div class="overflow-hidden rounded-2xl bg-fortu-light/30 aspect-[4/3] mb-5">
            <img
              v-if="coverImageUrl(post)"
              :src="coverImageUrl(post) as string"
              :alt="post.coverImage?.alt || post.title"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="flex items-center gap-3 mb-3">
            <span v-if="post.category" class="text-xs font-medium text-fortu-medium uppercase tracking-wider">
              {{ categoryLabel(post.category) }}
            </span>
            <span v-if="post.category" class="w-1 h-1 rounded-full bg-fortu-medium"></span>
            <span class="text-xs text-fortu-medium">
              {{ formatDate(post.publishedAt) }}
            </span>
          </div>
          <h3 class="text-xl md:text-2xl font-medium text-fortu-dark mb-2 tracking-tight group-hover:text-fortu-medium transition-colors">
            {{ post.title }}
          </h3>
          <p v-if="post.excerpt" class="text-fortu-medium text-sm md:text-base leading-relaxed line-clamp-3">
            {{ post.excerpt }}
          </p>
        </RouterLink>
      </div>
    </div>

    <CTA variant="dark" />
  </div>
</template>

<script setup lang="ts">
import { usePageSeo } from '@/composables/usePageSeo'
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { client, urlFor } from '@/sanity/client'
import { BLOG_POSTS_QUERY, type BlogPostListItem } from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import PageHero from '@/components/PageHero.vue'
import CTA from '@/components/CTA.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const posts = ref<BlogPostListItem[]>([])
const loading = ref(true)

const featuredPost = computed(() =>
  posts.value.find((p) => p.featured) || posts.value[0] || null,
)

const otherPosts = computed(() =>
  featuredPost.value
    ? posts.value.filter((p) => p._id !== featuredPost.value!._id)
    : [],
)

const coverImageUrl = (post: BlogPostListItem) => {
  if (!post.coverImage?.asset) return null
  try {
    const builder = urlFor(post.coverImage).width(1200).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return null
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  try {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

const categoryLabel = (value: string) => {
  const map: Record<string, string> = {
    news: 'Berita',
    tutorial: 'Tutorial',
    product: 'Produk',
    tips: 'Tips',
    other: 'Lainnya',
  }
  return map[value] || value
}

onMounted(async () => {
  try {
    posts.value = (await client.fetch(BLOG_POSTS_QUERY)) as BlogPostListItem[]
  } catch (e) {
    console.error('Failed to fetch blog posts:', e)
  } finally {
    loading.value = false
  }
})

usePageSeo('blog', {
  title: 'Blog & Berita Digital Signage | Fortu Digital',
  description:
    'Artikel, studi kasus, dan liputan media tentang digital signage, interactive display, dan solusi visual dari Fortu Digital.',
})
</script>

<style scoped>
.featured-post,
.post-card {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.post-card {
  animation-delay: 0.2s;
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
