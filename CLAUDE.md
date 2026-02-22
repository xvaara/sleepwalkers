# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sleepwalkers ultimate frisbee club website (sleepwalkers.fi) — a Finnish sports club site built with Nuxt 4, deployed to Cloudflare Pages.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build` (uses Cloudflare Pages preset)
- **Generate static:** `pnpm generate`
- **Preview:** `pnpm preview`
- **Lint:** `pnpm lint` / `pnpm lint:fix`

## Tech Stack

- **Framework:** Nuxt 4 with SSR, Nitro preset `cloudflare_pages`
- **UI:** Nuxt UI v4 (`@nuxt/ui`) with Tailwind CSS v4
- **Content:** Nuxt Content v3 with D1 database backend
- **i18n:** `@nuxtjs/i18n` — two locales: `fi` (default), `en`; prefix strategy (`/fi/...`, `/en/...`)
- **Icons:** `unplugin-icons` with `@iconify-json/bi` (Bootstrap Icons)
- **SEO:** `@nuxtjs/robots`, `@nuxtjs/sitemap`
- **Images:** `@nuxt/image`
- **Linting:** `@antfu/eslint-config`
- **Package manager:** pnpm

## Architecture

### Content Collections (`content.config.ts`)

Three collections:
- **`content`** — pages from `content/**/*.md`, excluding `blog-arkisto/`
- **`blog`** — blog posts from `content/blog-arkisto/*.md` with schema: tags, image, date, published, alt, ogImage
- **`data`** — YAML data files (`content/**/*.yml`)

### Build Hooks (`nuxt.config.ts`)

The `build:before` hook auto-generates JSON data files into `public/data/`:
- `gallery.json` — scanned from `public/images/gallery/`
- `ig.json` — fetched via `app/utils/ig.ts` (Instagram data)
- `practices.json` — fetched via `app/utils/practices.ts` (training schedule)

### Layout

Single default layout (`app/layouts/default.vue`):
- Sticky branded header with mobile slideover menu
- Desktop: sidebar + main content grid
- Navigation built from content collection tree
- Locale switcher with fallback logic
- Color mode toggle (light/dark/auto)

### Routing

- `/` — homepage with image carousel, content, practices, Instagram feed
- `/practice` — practice schedule page
- `/blog-arkisto/[blog]` — individual blog posts
- `/blog-arkisto/` — blog archive listing
- `/[...slug]` — catch-all for content pages

### i18n

Configured in `i18n/i18n.config.ts`. All routes prefixed with locale (`/fi/`, `/en/`). Browser detection redirects on root.

### Global Components

Components suffixed `.global.vue` are auto-registered globally: `BlogImage`, `Practices`, `card`, `column`, `row`, `contacts`.

### Theming

- Primary color: `red` (configured in `app/app.config.ts`)
- Brand colors: `--color-brand: #db3931`, `--color-brand-dark: #be2323` (in `app/assets/css/main.css`)
- Custom neutral scale for lighter dark mode

## ESLint

Uses `@antfu/eslint-config`. Vue files allow `script` or `template` first (both orders accepted). `no-console` is a warning.

## Deployment

Cloudflare Pages with D1 database for Nuxt Content. Prerender crawls from `/`, `/sitemap.xml`, `/robots.txt`.
