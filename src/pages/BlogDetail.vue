<template>
  <!-- Loading State - article shape, full height -->
  <SectionSkeleton v-if="loading" min-height="min-h-screen" align="left" :cards="0">
    <div class="skeleton h-[40vh] w-full rounded-2xl mb-10"></div>
    <div class="max-w-3xl space-y-4 w-full">
      <div class="skeleton h-10 md:h-14 w-3/4 rounded-lg"></div>
      <div class="skeleton h-4 w-1/3 rounded mb-6"></div>
      <div v-for="n in 6" :key="n" class="skeleton h-4 rounded" :class="n % 3 === 0 ? 'w-2/3' : 'w-full'"></div>
    </div>
  </SectionSkeleton>

  <!-- Error State -->
  <div v-else-if="error || !post" class="min-h-screen flex items-center justify-center bg-fortu-off-white">
    <div class="text-center px-4">
      <h1 class="text-2xl font-medium text-fortu-dark mb-4">Artikel tidak ditemukan</h1>
      <p class="text-fortu-medium mb-8">{{ error || 'Artikel yang Anda cari tidak tersedia.' }}</p>
      <Button to="/blog" variant="primary">
        Kembali ke Blog
      </Button>
    </div>
  </div>

  <!-- Blog Detail -->
  <article v-else class="bg-fortu-off-white">
    <!-- Hero -->
    <section class="relative bg-fortu-dark">
      <div
        v-if="coverImageUrl"
        class="absolute inset-0 overflow-hidden"
      >
        <img
          :src="coverImageUrl"
          :alt="post.coverImage?.alt || post.title"
          fetchpriority="high"
          decoding="async"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-fortu-dark/70"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 md:px-16 py-32 md:py-40 text-center">
        <div class="flex items-center justify-center gap-3 mb-6">
          <span v-if="post.isMediaCoverage || post.category" class="text-xs md:text-sm font-medium text-fortu-light uppercase tracking-wider">
            {{ post.isMediaCoverage ? 'Liputan Media' : categoryLabel(post.category!) }}
          </span>
          <span v-if="post.isMediaCoverage || post.category" class="w-1 h-1 rounded-full bg-fortu-light"></span>
          <span class="text-xs md:text-sm text-fortu-light">
            {{ formatDate(post.isMediaCoverage && post.sourcePublishedAt ? post.sourcePublishedAt : post.publishedAt) }}
          </span>
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-medium text-fortu-off-white mb-6 tracking-tight hero-title">
          {{ post.title }}
        </h1>
        <p v-if="post.excerpt" class="text-lg md:text-xl text-fortu-light max-w-2xl mx-auto hero-subtitle">
          {{ post.excerpt }}
        </p>
        <p v-if="sourceLink && post.sourceName" class="mt-6 text-sm text-fortu-light hero-subtitle">
          Sumber:
          <a
            :href="sourceLink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-fortu-off-white font-medium underline underline-offset-4"
          >{{ post.sourceName }}</a>
          <template v-if="post.sourceAuthor"> · {{ post.sourceAuthor }}</template>
        </p>
        <p v-else-if="post.isMediaCoverage && post.sourceName" class="mt-6 text-sm text-fortu-light hero-subtitle">
          Sumber: <span class="text-fortu-off-white font-medium">{{ post.sourceName }}</span>
        </p>
        <div v-if="post.author" class="mt-8 text-sm text-fortu-light hero-subtitle">
          Oleh <span class="text-fortu-off-white font-medium">{{ post.author }}</span>
        </div>
      </div>
    </section>

    <!-- Body -->
    <div class="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <PortableText v-if="post.body && post.body.length" :blocks="post.body" />

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length" class="mt-12 pt-8 border-t border-fortu-light flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-3 py-1 rounded-full text-sm text-fortu-medium bg-white border border-fortu-light"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Source (media coverage): link to the original article -->
      <aside
        v-if="sourceLink"
        class="mt-12 p-6 md:p-8 rounded-2xl bg-white border border-fortu-light text-center"
      >
        <p class="text-sm text-fortu-medium mb-4">
          Ringkasan ini ditulis ulang oleh tim Fortu Digital berdasarkan liputan
          <span class="font-medium text-fortu-dark">{{ post.sourceName || 'media' }}</span>.
        </p>
        <a
          :href="sourceLink"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fortu-dark text-fortu-off-white font-medium hover:opacity-90 transition-opacity"
        >
          Baca artikel lengkap di {{ post.sourceName || 'media asli' }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      </aside>

      <!-- Back link -->
      <div class="mt-12 text-center">
        <Button to="/blog" variant="primary">
          ← Kembali ke Blog
        </Button>
      </div>
    </div>

    <!-- Related Posts -->
    <section v-if="relatedPosts.length" class="bg-white py-16 md:py-24 px-4 md:px-16">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-medium text-fortu-dark mb-10 md:mb-12 tracking-tight">
          Artikel Lainnya
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <RouterLink
            v-for="related in relatedPosts"
            :key="related._id"
            :to="`/blog/${related.slug.current}`"
            class="related-card group block"
          >
            <div class="overflow-hidden rounded-2xl bg-fortu-light/30 aspect-[4/3] mb-5">
              <img
                v-if="relatedImageUrl(related)"
                :src="relatedImageUrl(related) as string"
                :alt="related.coverImage?.alt || related.title"
                loading="lazy"
                decoding="async"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div class="flex items-center gap-3 mb-3">
              <span v-if="related.category" class="text-xs font-medium text-fortu-medium uppercase tracking-wider">
                {{ categoryLabel(related.category) }}
              </span>
              <span v-if="related.category" class="w-1 h-1 rounded-full bg-fortu-medium"></span>
              <span class="text-xs text-fortu-medium">
                {{ formatDate(related.publishedAt) }}
              </span>
            </div>
            <h3 class="text-xl md:text-2xl font-medium text-fortu-dark mb-2 tracking-tight group-hover:text-fortu-medium transition-colors">
              {{ related.title }}
            </h3>
            <p v-if="related.excerpt" class="text-fortu-medium text-sm md:text-base leading-relaxed line-clamp-3">
              {{ related.excerpt }}
            </p>
          </RouterLink>
        </div>
      </div>
    </section>

    <CTA variant="dark" />
  </article>
</template>

<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { useJsonLd } from '@/composables/useJsonLd'
import { breadcrumbs, blogPostingSchema } from '@/utils/structuredData'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { client, urlFor } from '@/sanity/client'
import {
  BLOG_POST_BY_SLUG_QUERY,
  RELATED_BLOG_POSTS_QUERY,
  type BlogPost,
  type BlogPostListItem,
} from '@/sanity/queries'
import { IMAGE_CONFIG } from '@/config/image'
import Button from '@/reusables/Button.vue'
import CTA from '@/components/CTA.vue'
import PortableText from '@/components/PortableText.vue'
import SectionSkeleton from '@/reusables/SectionSkeleton.vue'

const route = useRoute()
const post = ref<BlogPost | null>(null)
const relatedPosts = ref<BlogPostListItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const coverImageUrl = computed(() => {
  if (!post.value?.coverImage?.asset) return null
  try {
    const builder = urlFor(post.value.coverImage).width(1920).quality(IMAGE_CONFIG.quality)
    return IMAGE_CONFIG.autoFormat ? builder.auto('format').url() : builder.url()
  } catch {
    return null
  }
})

const sourceLink = computed(() => {
  const u = post.value?.sourceUrl
  return post.value?.isMediaCoverage && u && /^https?:\/\//i.test(u) ? u : null
})

const shareImageUrl = computed(() => {
  const img = post.value?.shareImage
  if (!img?.asset) return null
  try {
    return urlFor(img).width(1200).height(630).fit('crop').quality(80).url()
  } catch {
    return null
  }
})

const relatedImageUrl = (related: BlogPostListItem) => {
  if (!related.coverImage?.asset) return null
  try {
    const builder = urlFor(related.coverImage).width(800).quality(IMAGE_CONFIG.quality)
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

const fetchPost = async (slug: string) => {
  loading.value = true
  error.value = null
  post.value = null
  relatedPosts.value = []
  try {
    const data = (await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug })) as BlogPost | null
    if (!data) {
      error.value = 'Artikel yang Anda cari tidak tersedia.'
      return
    }
    post.value = data
    relatedPosts.value = (await client.fetch(RELATED_BLOG_POSTS_QUERY, {
      currentId: data._id,
    })) as BlogPostListItem[]
  } catch (e) {
    console.error('Failed to fetch blog post:', e)
    error.value = 'Gagal memuat artikel.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
  if (slug) fetchPost(slug)
})

watch(
  () => route.params.slug,
  (slug) => {
    const s = Array.isArray(slug) ? slug[0] : slug
    if (s) fetchPost(s)
  },
)

const trimTo = (text: string, max: number) =>
  text.length <= max ? text : text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'

useSeo(() => {
  const p = post.value
  return {
    title: p ? trimTo(`${p.seoTitle || p.title} | Fortu Digital`, 70) : 'Blog | Fortu Digital',
    description: p ? trimTo((p.seoDescription || p.excerpt || '').trim(), 155) || undefined : undefined,
    image: shareImageUrl.value ?? coverImageUrl.value ?? undefined,
    type: 'article',
    noindex: p?.noIndex === true || (!!error.value && !p),
  }
})

useJsonLd('blogposting', () => blogPostingSchema(post.value, coverImageUrl.value ?? undefined))
useJsonLd('breadcrumb', () =>
  post.value
    ? breadcrumbs([
        { name: 'Beranda', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.value.title, path: `/blog/${post.value.slug.current}` },
      ])
    : null,
)
</script>

<style scoped>
.hero-title {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.hero-subtitle {
  animation: fadeInUp 0.8s ease-out 0.2s forwards;
  opacity: 0;
}

.related-card {
  animation: fadeInUp 0.8s ease-out forwards;
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
