# Deployment Guide

This guide covers deploying both the Vue frontend and Sanity Studio.

## Prerequisites

- Node.js 18+
- Sanity CLI installed globally: `npm install -g @sanity/cli`
- Git repository (recommended)

---

## 1. Deploy Sanity Studio

### Option A: Deploy to Sanity (Recommended)

```bash
cd studio-fortu
npm install
npx sanity deploy
```

You'll be prompted to choose a hostname (e.g., `fortu`).
Your studio will be available at `https://fortu.sanity.studio`.

### Option B: Self-host on Railway/Netlify

```bash
cd studio-fortu
npm run build
```

Deploy the `dist` folder to your hosting platform.

---

## 2. Configure CORS

Go to [sanity.io/manage](https://sanity.io/manage) > Your Project > API > CORS Origins.

Add these origins:
- `http://localhost:5173` (local development)
- `https://your-production-domain.com` (production)
- `https://your-app.up.railway.app` (if using the Railway-generated domain)

Enable "Allow credentials" for each.

---

## 3. Deploy Frontend (Vue App)

### Environment Variables

Create a `.env` file locally (already gitignored):

```
VITE_SANITY_PROJECT_ID=mb1o2t9p
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2024-01-01
```

### Build for Production

```bash
npm install
npm run build
```

Output will be in the `dist` folder.

### Deploy to Railway

1. Push code to GitHub
2. Create a project at [railway.com/new](https://railway.com/new) > Deploy from GitHub repo (root directory `/`)
3. Add environment variables in the service's Variables tab **before the first build** (Vite inlines them at build time; changing them requires a redeploy):
   - `VITE_SANITY_PROJECT_ID` = `mb1o2t9p`
   - `VITE_SANITY_DATASET` = `production`
   - `VITE_SANITY_API_VERSION` = `2024-01-01`
4. Deploy. Railway detects Vite, runs `npm run build`, and serves `dist` with its built-in Caddy server (SPA fallback to `index.html` included, no start script needed)
5. Settings > Networking: generate a domain and/or add a custom domain

---

### Deploy to Netlify

1. Push code to GitHub/GitLab
2. Import project at [app.netlify.com](https://app.netlify.com)
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in Site settings > Environment variables
5. Deploy

For SPA routing, create `public/_redirects`:
```
/*    /index.html   200
```

---

## Staging Environment

The `staging` branch deploys to its own Railway environment
(`https://fortu-landing-page-staging.up.railway.app`). Production (`main`, fortu.co.id) is a separate environment and is not affected by staging deploys.

Workflow: create a branch from `staging`, open a PR **into `staging`**, and only merge to `main` after approval.

Staging must never be indexed by Google. `vite.config.ts` handles this at build time:

- When `RAILWAY_GIT_BRANCH=staging` (set automatically by Railway) or `VITE_NOINDEX=true`, the build adds `<meta name="robots" content="noindex, nofollow">` and replaces `robots.txt` with `Disallow: /`.
- Builds from `main` are unchanged.

Checklist for a new staging domain: add it to Sanity CORS origins (sanity.io/manage > API > CORS Origins) and set the same `VITE_SANITY_*` variables as production.

---

## Fortu CRM link (`VITE_CRM_URL`) and lead tracking

Every WhatsApp button goes through the Fortu CRM's tracked link (`{CRM}/go/wa?line=…`), which records the click
and opens WhatsApp with a short click code. Which CRM the links point to is fixed at build time:

| Railway environment | Branch | `VITE_CRM_URL` | CRM used |
| --- | --- | --- | --- |
| production (fortu.co.id) | `main` | `https://fortu-crm-production.up.railway.app` (recommended to set; also the default) | production CRM |
| staging | `staging` | `https://soothing-manifestation-staging.up.railway.app` (recommended to set; also the default) | staging CRM |
| local (`npm run dev`), tests | any | unset | staging CRM |

When `VITE_CRM_URL` is unset, `vite.config.ts` picks the production CRM only for a production build of a branch other
than `staging` (`RAILWAY_GIT_BRANCH`); everything else uses the staging CRM, so test clicks never reach production.
Like every `VITE_*` variable it is inlined at build time: change it, then redeploy.

The labels the site sends must exist as active lines in that CRM (Pengaturan → WhatsApp lines), or `/go/wa` answers
404. They are listed in `src/config/contact.ts`: `SALES_TEAMS` (Jakarta-1 … Jakarta-4, Medan-5) and
`OFFICE_WHATSAPP_LINES` (Kantor-Jakarta, Kantor-Bali: the office WhatsApp numbers shown on /kontak).

Lead form (MAR-232): a plain click on any of those links first opens a short form (name, WhatsApp number, optional
organisation and need). It posts to `{CRM}/go/wa/lead`, which records the click, creates the lead and answers with the
WhatsApp chat to open; if the CRM does not answer, the visitor still goes to the tracked `/go/wa` link. The CRM only
accepts the form from fortu.co.id, www.fortu.co.id and `fortu-landing-page-staging.up.railway.app` (CRM variable
`WA_LEAD_ORIGINS` overrides the list). To test against the staging CRM from `npm run dev`, set
`WA_LEAD_ALLOW_LOCALHOST=true` on the staging CRM.

Analytics (GA4 `G-0BP7NTVTPH`, Meta Pixel; both only after cookie consent): each phone or email click, and each sent lead form, sends
`go_to_whatsapp` / `click_phone` / `click_email` plus GA4's `generate_lead` (`method`, `lead_source`, `whatsapp_line`);
WhatsApp clicks also send the Pixel `Contact` event. Mark `generate_lead` as a Key event in GA4 (Admin → Events).

---

## 4. Redeploying After Changes

### Frontend Changes

If using Railway/Netlify with Git integration:
```bash
git add .
git commit -m "your changes"
git push
```
Auto-deploys on push.

Manual deploy:
```bash
npm run build
# Upload dist folder or trigger deploy in dashboard
```

### Sanity Studio Changes (schema, config)

```bash
cd studio-fortu
npx sanity deploy
```

### Content Changes

No redeployment needed. Content updates in Sanity Studio appear automatically on the frontend (uses CDN with fast propagation).

---

## 5. Post-Deployment Checklist

- [ ] Sanity Studio deployed and accessible
- [ ] CORS origins configured for production domain
- [ ] Environment variables set in hosting platform
- [ ] Test all pages load correctly
- [ ] Test Sanity content appears on frontend
- [ ] Test 404 page works for invalid routes

---

## Quick Reference

| Service | URL |
|---------|-----|
| Sanity Manage | https://sanity.io/manage |
| Sanity Studio | https://fortu.sanity.studio (after deploy) |
| Project ID | mb1o2t9p |
| Dataset | production |


---

## Versioning and releases

Versions follow semantic versioning and are bumped automatically by [release-please](https://github.com/googleapis/release-please) (`.github/workflows/release-please.yml`).

1. Write commit messages and PR titles as Conventional Commits:
   - `fix: ...` raises the patch version (1.0.1 → 1.0.2)
   - `feat: ...` raises the minor version (1.0.1 → 1.1.0)
   - `feat!: ...` or a `BREAKING CHANGE:` footer raises the major version (1.0.1 → 2.0.0)
   - `chore:`, `docs:`, `ci:`, `refactor:` do not raise the version
2. After a merge to `main`, release-please opens or updates a single "Release PR" with the new version in `package.json` / `package-lock.json` and an updated `CHANGELOG.md`.
3. Merging that Release PR creates the git tag and GitHub release.

Content-only changes in Sanity do not change the version. The repository setting "Allow GitHub Actions to create and approve pull requests" must be enabled (Settings → Actions → General).
