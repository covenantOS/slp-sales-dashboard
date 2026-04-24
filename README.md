# ServiceLinePro Sales Dashboard

A dynamic, branded sales-quoting dashboard for the ServiceLinePro team.
Build quotes, apply discounts, customize ad spend, and see your commission in real time.

## Features

- **Live commission engine** — flat % on non-ad-spend, configurable margin × rep rate on ad spend
- **Product picker** — Local SEO (Standard/Extreme/Trial), SEO Add-Ons, Paid Media, Astro web builds
- **Customizable** — per-line monthly override, %/$ discounts, setup waiver toggle
- **Client capture** — company, contact, industry, notes
- **Totals** — day-1 cash, monthly, 12-month contract value, commission over contract
- **Save / share / export** — save to Cloudflare D1, shareable `?q=id` link, JSON + HTML proposal export
- **Auto-save** — local draft persists across reloads

## Stack

- React 19 + Vite 8 + TypeScript
- Tailwind 3 (custom `brand` / `ink` / `accent` palette)
- Cloudflare Pages (static SPA) + Pages Functions (API) + D1 (SQLite)

## Local development

```bash
npm install
npm run dev
npx wrangler pages dev dist --d1 DB=slp-sales-dashboard
```

## Deploy

Deploys happen automatically via the connected GitHub repo on every push to `main`.
Manual deploy:

```bash
npm run build
npx wrangler pages deploy dist --project-name slp-sales-dashboard
```

## D1 schema

```bash
npx wrangler d1 execute slp-sales-dashboard --remote --file=./schema.sql
```

## Commission math

- **Non-ad-spend line**: `rep_rate × (monthly_after_discount)` + `rep_rate × setup_after_discount`
- **Ad-spend line**: `rep_rate × (ad_spend_margin_pct × monthly_after_discount)`

Defaults: rep rate **15%**, ad-spend margin **15%** (both editable per rep).
