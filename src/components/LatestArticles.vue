<template>
  <section v-if="posts.length" class="latest-articles bg-white py-16 md:py-24" aria-labelledby="latest-articles-title">
    <div class="mx-auto px-4 md:px-16">
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
        <div>
          <p class="text-[11px] md:text-xs uppercase tracking-[0.24em] text-fortu-medium mb-3">Blog</p>
          <h2
            id="latest-articles-title"
            class="text-3xl md:text-5xl font-medium text-fortu-dark tracking-tight"
          >
            Artikel &amp; Berita
          </h2>
        </div>
        <RouterLink
          to="/blog"
          class="inline-flex items-center gap-2 text-fortu-dark font-medium group"
        >
          Lihat semua artikel
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        <RouterLink
          v-for="post in posts"
          :key="post._id"
          :to="`/blog/${post.slug.current}`"
          class="group block"
        >
          <div class="overflow-hidden rounded-2xl bg-fortu-light/30 aspect-[4/3] mb-5">
            <img
              v-if="postCoverUrl(post)"
              :src="postCoverUrl(post) as string"
              :alt="post.coverImage?.alt || post.title"
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
            <span
              v-if="postLabel(post)"
              class="text-xs font-medium uppercase tracking-wider"
              :class="post.isMediaCoverage ? 'text-fortu-dark' : 'text-fortu-medium'"
            >
              {{ postLabel(post) }}
            </span>
            <span v-if="postLabel(post)" class="w-1 h-1 rounded-full bg-fortu-medium" aria-hidden="true"></span>
            <time class="text-xs text-fortu-medium" :datetime="displayDate(post)">
              {{ formatDate(displayDate(post)) }}
            </time>
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
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { client } from '@/sanity/client'
import { BLOG_POSTS_QUERY, type BlogPostListItem } from '@/sanity/queries'
import { formatDate, displayDate, postLabel, postCoverUrl } from '@/utils/blog'

const posts = ref<BlogPostListItem[]>([])

onMounted(async () => {
  try {
    const all = (await client.fetch(BLOG_POSTS_QUERY)) as BlogPostListItem[]
    posts.value = all.slice(0, 3)
  } catch (e) {
    console.error('Failed to fetch latest articles:', e)
  }
})
</script>
