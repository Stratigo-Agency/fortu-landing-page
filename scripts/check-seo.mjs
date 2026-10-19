#!/usr/bin/env node
/**
 * SEO guard (MAR-51). Opens every public page of the BUILT site (dist/) in headless Chrome, the way
 * Google renders it, and fails when something that hurts ranking is wrong.
 *
 *   npm run build && npm run check:seo          (build must be an indexable build, see README)
 *   node scripts/check-seo.mjs --allow-noindex  (staging build: skips the "must be indexable" checks)
 *
 * Needs Chrome: set CHROME_PATH, or it looks in the usual install locations (GitHub runners have it).
 * Sanity requests are fetched by this script itself, so no CORS setting is needed.
 */
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const SITE = 'https://fortu.co.id'
const DIST = resolve(process.cwd(), 'dist')
const allowNoindex = process.argv.includes('--allow-noindex')
const MAX_TITLE = 60
const MAX_DESC = 160
const GENERIC_ALT = /^(image|images|gambar|photo|foto|picture|product image( \d+)?|use case image|slide image)$/i

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean)

const errors = [] // { page, rule, detail }
const warnings = []
const fail = (page, rule, detail) => errors.push({ page, rule, detail })
const warn = (page, rule, detail) => warnings.push({ page, rule, detail })

// ---------- static server for dist/ (SPA fallback, like the real host) ----------
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' }
function serve() {
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    let file = join(DIST, path)
    if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html')
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' })
    res.end(readFileSync(file))
  })
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)))
}

// ---------- sitemap + robots ----------
function readSitemap() {
  const file = join(DIST, 'sitemap.xml')
  if (!existsSync(file)) {
    if (!allowNoindex) fail('sitemap.xml', 'sitemap', 'dist/sitemap.xml is missing (was this an indexable build?)')
    return []
  }
  const locs = [...readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  if (new Set(locs).size !== locs.length) fail('sitemap.xml', 'sitemap', 'contains duplicate addresses')
  for (const l of locs) if (!l.startsWith(SITE + '/')) fail('sitemap.xml', 'sitemap', `address is not a full ${SITE}/... URL: ${l}`)
  for (const p of ['/', '/products', '/about', '/contact', '/blog', '/studi-kasus']) {
    if (!locs.includes(SITE + p)) fail('sitemap.xml', 'sitemap', `main page ${p} is not listed`)
  }
  return locs
}
function checkRobots() {
  const file = join(DIST, 'robots.txt')
  if (!existsSync(file)) return fail('robots.txt', 'robots', 'dist/robots.txt is missing')
  const txt = readFileSync(file, 'utf8')
  if (!allowNoindex) {
    if (!txt.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots.txt', 'robots', `does not point to ${SITE}/sitemap.xml`)
    if (/^\s*Disallow:\s*\/\s*$/m.test(txt)) fail('robots.txt', 'robots', 'blocks the whole site (Disallow: /)')
  }
}

// ---------- one page ----------
async function inspect(browser, base, path, isNotFound = false) {
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', async (req) => {
    const url = req.url()
    if (/\.sanity\.io\//.test(url) && /apicdn|api\.sanity/.test(url)) {
      try {
        const r = await fetch(url)
        return req.respond({ status: r.status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: await r.text() })
      } catch {
        return req.abort()
      }
    }
    if (['image', 'media', 'font'].includes(req.resourceType()) || /cdn\.sanity\.io|googletagmanager|google-analytics|connect\.facebook|maps\.google/.test(url)) return req.abort()
    return req.continue()
  })
  await page.goto(base + path, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise((r) => setTimeout(r, 600))
  const d = await page.evaluate(() => {
    const meta = (sel) => document.querySelector(sel)?.getAttribute('content') ?? null
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
      try { return { ok: true, json: JSON.parse(s.textContent || '') } } catch (e) { return { ok: false, err: String(e) } }
    })
    return {
      title: document.title,
      description: meta('meta[name="description"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      robots: meta('meta[name="robots"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogImage: meta('meta[property="og:image"]'),
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      noAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).map((i) => (i.getAttribute('src') || '').slice(0, 80)),
      genericAlt: [...document.querySelectorAll('img[alt]')].map((i) => i.getAttribute('alt')).filter(Boolean),
      ld,
    }
  })
  await page.close()
  const name = path || '/'
  const noindex = /noindex/i.test(d.robots || '')

  if (isNotFound) {
    if (!noindex) fail(name, 'not-found', 'unknown addresses must be noindex')
    if (d.canonical) fail(name, 'not-found', 'the not-found page must not have a canonical link')
    return d
  }

  if (!d.title.trim()) fail(name, 'title', 'title is empty')
  else if (d.title.length > MAX_TITLE) fail(name, 'title', `title is ${d.title.length} characters (max ${MAX_TITLE}): "${d.title}"`)
  if (!d.description?.trim()) fail(name, 'description', 'description is missing')
  else if (d.description.length > MAX_DESC) fail(name, 'description', `description is ${d.description.length} characters (max ${MAX_DESC})`)
  const expected = SITE + (path === '/' ? '/' : path)
  if (!d.canonical) fail(name, 'canonical', 'canonical link is missing')
  else if (!d.canonical.startsWith(SITE + '/')) fail(name, 'canonical', `canonical is not a full ${SITE}/... URL: ${d.canonical}`)
  else if (d.canonical !== expected) fail(name, 'canonical', `canonical ${d.canonical} differs from the page address ${expected}`)
  if (d.h1.length !== 1) fail(name, 'h1', `${d.h1.length} H1 headings (must be exactly 1)${d.h1.length ? ': ' + d.h1.map((t) => `"${t.slice(0, 40)}"`).join(', ') : ''}`)
  if (d.noAlt.length) fail(name, 'alt', `${d.noAlt.length} image(s) without an alt attribute (use alt="" only for decoration): ${d.noAlt.slice(0, 3).join(' | ')}`)
  const generic = d.genericAlt.filter((a) => GENERIC_ALT.test(a.trim()))
  if (generic.length) fail(name, 'alt', `generic alt text: ${[...new Set(generic)].join(', ')}`)
  if (noindex && !allowNoindex) fail(name, 'noindex', 'page is marked noindex but is a public page')
  if (!d.ogTitle) warn(name, 'social', 'og:title missing')
  if (d.ogImage && /\/logo\.png$/.test(d.ogImage)) warn(name, 'social', 'share image is the default logo (add a 1200x630 image)')
  for (const j of d.ld) {
    if (!j.ok) { fail(name, 'structured-data', `invalid JSON-LD: ${j.err}`); continue }
    const nodes = j.json['@graph'] || [j.json]
    if (!/schema\.org/.test(String(j.json['@context'] || ''))) fail(name, 'structured-data', 'JSON-LD without a schema.org @context')
    for (const n of nodes) {
      if (!n['@type']) fail(name, 'structured-data', 'a JSON-LD node has no @type')
      if (n['@type'] === 'Product' && !n.name) fail(name, 'structured-data', 'Product without a name')
      if (/^(BlogPosting|Article|NewsArticle)$/.test(n['@type']) && !n.headline) fail(name, 'structured-data', `${n['@type']} without a headline`)
      if (n['@type'] === 'BreadcrumbList' && !(n.itemListElement || []).length) fail(name, 'structured-data', 'BreadcrumbList is empty')
    }
  }
  return d
}

// ---------- main ----------
const started = Date.now()
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ not found. Run "npm run build" first.')
  process.exit(2)
}
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!chrome) {
  console.error('Chrome not found. Install it or set CHROME_PATH.')
  process.exit(2)
}

const sitemap = readSitemap()
checkRobots()
const paths = sitemap.length
  ? sitemap.map((l) => l.replace(SITE, '') || '/')
  : ['/', '/products', '/about', '/contact', '/blog', '/studi-kasus'] // staging build: no sitemap, check the main pages

const server = await serve()
const base = `http://127.0.0.1:${server.address().port}`
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] })
const results = []
try {
  for (const p of paths) results.push({ p, d: await inspect(browser, base, p) })
  await inspect(browser, base, '/halaman-yang-tidak-ada-cek-seo', true)
} finally {
  await browser.close()
  server.close()
}

// duplicates across pages
for (const key of ['title', 'description']) {
  const seen = new Map()
  for (const { p, d } of results) {
    const v = (d[key] || '').trim()
    if (!v) continue
    if (seen.has(v)) fail(p, `duplicate-${key}`, `same ${key} as ${seen.get(v)}: "${v.slice(0, 60)}"`)
    else seen.set(v, p)
  }
}

const secs = ((Date.now() - started) / 1000).toFixed(1)
for (const w of warnings) console.log(`warn  ${w.page}  [${w.rule}] ${w.detail}`)
for (const e of errors) console.log(`FAIL  ${e.page}  [${e.rule}] ${e.detail}`)
console.log(`\nChecked ${results.length} pages + sitemap + robots.txt in ${secs}s: ${errors.length} error(s), ${warnings.length} warning(s).`)
process.exit(errors.length ? 1 : 0)
