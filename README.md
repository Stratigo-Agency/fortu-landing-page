# fortu.co.id

Website Fortu Digital: Vue 3 + TypeScript + Tailwind, content from Sanity (Studio in `studio-fortu/`).
Deployment is described in [DEPLOYMENT.MD](DEPLOYMENT.MD).

## Run it

```bash
npm install
cp .env.example .env     # set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET (staging or production)
npm run dev              # http://localhost:5173 (the only local address Sanity allows by CORS)
npm run build            # type-check + production build
```

Branches: `staging` is the working branch and deploys to the staging site; `main` is production. Feature branches are
merged into `staging` by pull request and deleted afterwards.

## Where things live

| What | Where |
| --- | --- |
| Brand colours and font (one place to change them) | `src/assets/css/main.css` (`:root`) |
| Reading from Sanity | `src/sanity/fetch.ts`, `src/composables/useSanityQuery.ts`, queries in `src/sanity/queries.ts` |
| Sanity image URLs, crop and focal point | `src/utils/image.ts` |
| Section headings editors can change | Studio "Teks Judul Section", defaults in `src/config/sectionCopy.ts` |
| Page titles, descriptions, canonical, structured data | `src/composables/useSeo.ts`, `usePageSeo.ts`, `src/utils/structuredData.ts` |

## SEO rules (what editors and developers must keep true)

Every public page needs:

- **One title**, unique, at most **60 characters**. **One description**, unique, at most **160** (aim for 120-155).
- A **canonical** link in the form `https://fortu.co.id/...` equal to the page's own address.
- Exactly **one H1** (the main heading), with the main keyword of the page in it. The rest are H2/H3 in order.
- An **alt text** on every image that carries information (describe what is seen and name the product). Pure decoration uses `alt=""`.
- Valid **structured data** (JSON-LD).
- No accidental **noindex**: only the not-found page and staging builds may be hidden from Google.

Where editors set these in Studio: "SEO: Halaman" (one document per static page), the SEO fields inside each product,
article and case study, and the alt text field of every image. If a field is empty the site uses the default written in code.

## SEO check

`scripts/check-seo.mjs` opens every page listed in the sitemap in headless Chrome and **fails** when a rule above is
broken, naming the page. It also checks `sitemap.xml` (main pages listed, full addresses, no duplicates) and
`robots.txt` (points to the sitemap, does not block the site), and that unknown addresses are noindex without a canonical.

```bash
npm run check:seo:full   # builds an indexable build, then checks (about 40 seconds)
npm run check:seo        # checks the existing dist/ (must be an indexable build)
node scripts/check-seo.mjs --allow-noindex   # for a staging build
```

It needs Chrome (set `CHROME_PATH` if it is not in the usual place). GitHub runs it on every pull request
(`.github/workflows/seo-check.yml`). Warnings (for example the default share image) are listed but do not fail the check.
