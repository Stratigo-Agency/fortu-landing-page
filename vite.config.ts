import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Staging builds must never be indexed by Google (duplicate of fortu.co.id).
// Railway injects RAILWAY_GIT_BRANCH at build time, so only builds of the
// `staging` branch are affected; `main` (production) output is unchanged.
// VITE_NOINDEX=true forces the same behaviour for any other preview build.
const isNoIndexBuild =
  process.env.RAILWAY_GIT_BRANCH === 'staging' || process.env.VITE_NOINDEX === 'true'

function noIndexPlugin(): Plugin {
  let outDir = 'dist'
  return {
    name: 'fortu-noindex',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml() {
      if (!isNoIndexBuild) return
      return [
        {
          tag: 'meta',
          attrs: { name: 'robots', content: 'noindex, nofollow' },
          injectTo: 'head-prepend',
        },
      ]
    },
    closeBundle() {
      if (!isNoIndexBuild) return
      writeFileSync(resolve(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
    },
  }
}

export default defineConfig({
  plugins: [vue(), noIndexPlugin()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'vue-vendor': ['vue', 'vue-router'],
          'sanity-vendor': ['@sanity/client', '@sanity/image-url', 'groq'],
        },
      },
    },
    // Enable code splitting
    chunkSizeWarningLimit: 1000,
  },
})
