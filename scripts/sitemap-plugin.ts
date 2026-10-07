import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadEnv, type Plugin } from 'vite'

const SITE_URL = 'https://www.fortu.co.id'
const STATIC_PATHS: Record<string, string> = {
  home: '/',
  products: '/products',
  about: '/about',
  contact: '/contact',
  blog: '/blog',
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

interface Entry {
  loc: string
  lastmod?: string
}

async function fetchSanityEntries(
  env: Record<string, string>,
): Promise<{ entries: Entry[]; hiddenPages: string[] }> {
  const projectId = env.VITE_SANITY_PROJECT_ID
  const dataset = env.VITE_SANITY_DATASET
  const version = env.VITE_SANITY_API_VERSION || '2024-01-01'
  if (!projectId || !dataset) throw new Error('VITE_SANITY_PROJECT_ID / VITE_SANITY_DATASET not set')
  const query = `{
    "products": *[_type == "product" && status == "active" && defined(slug.current) && noIndex != true]{ "slug": slug.current, _updatedAt },
    "posts": *[_type == "blogPost" && isActive == true && defined(slug.current) && noIndex != true]{ "slug": slug.current, _updatedAt },
    "hiddenPages": *[_type == "pageSeo" && noIndex == true].page
  }`
  const url = `https://${projectId}.apicdn.sanity.io/v${version}/data/query/${dataset}?query=${encodeURIComponent(query)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity responded ${res.status}`)
  const { result } = (await res.json()) as {
    result: {
      products: { slug: string; _updatedAt: string }[]
      posts: { slug: string; _updatedAt: string }[]
      hiddenPages: string[]
    }
  }
  return {
    entries: [
      ...result.products.map((p) => ({ loc: `/products/${encodeURIComponent(p.slug)}`, lastmod: p._updatedAt })),
      ...result.posts.map((p) => ({ loc: `/blog/${encodeURIComponent(p.slug)}`, lastmod: p._updatedAt })),
    ],
    hiddenPages: result.hiddenPages || [],
  }
}

/**
 * Writes dist/sitemap.xml at build time: static pages + active products + published articles
 * (lastmod from Sanity _updatedAt). If Sanity cannot be reached the static pages are still
 * written and the build continues. Skipped for noindex (staging) builds.
 */
export function sitemapPlugin(skip: boolean): Plugin {
  let outDir = 'dist'
  let env: Record<string, string> = {}
  return {
    name: 'fortu-sitemap',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
      env = { ...loadEnv(config.mode, config.root, 'VITE_'), ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith('VITE_')) as [string, string][]) }
    },
    async closeBundle() {
      if (skip) return
      let dynamic: Entry[] = []
      let hidden: string[] = []
      try {
        const r = await fetchSanityEntries(env)
        dynamic = r.entries
        hidden = r.hiddenPages
      } catch (e) {
        console.warn('[sitemap] could not read Sanity, writing static pages only:', (e as Error).message)
      }
      const statics = Object.entries(STATIC_PATHS)
        .filter(([key]) => !hidden.includes(key))
        .map(([, loc]) => ({ loc }))
      const entries: Entry[] = [...statics, ...dynamic]
      const body = entries
        .map(
          (e) =>
            `  <url>\n    <loc>${esc(SITE_URL + (e.loc === '/' ? '/' : e.loc))}</loc>` +
            (e.lastmod ? `\n    <lastmod>${esc(e.lastmod)}</lastmod>` : '') +
            `\n  </url>`,
        )
        .join('\n')
      writeFileSync(
        resolve(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
      )
      console.log(`[sitemap] wrote ${entries.length} URLs`)
    },
  }
}
