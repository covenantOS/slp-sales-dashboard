import type { Product, ProductKey } from '../types';

export const PRODUCTS: Record<ProductKey, Product> = {
  local_seo_standard: {
    key: 'local_seo_standard',
    name: 'Local SEO — Standard',
    category: 'local_seo',
    setup: 1500,
    monthly: 2000,
    setupWaivable: true,
    description:
      'Full GBP optimization, citations, signals, link building on a 12-month roadmap. Setup waived with 12-month commitment.',
    badge: 'Most Popular',
    mutuallyExclusiveWith: ['local_seo_extreme'],
  },
  local_seo_extreme: {
    key: 'local_seo_extreme',
    name: 'Local SEO — Extreme',
    category: 'local_seo',
    setup: 1500,
    monthly: 2500,
    setupWaivable: true,
    description:
      'For competitive markets. Heavy Advanced Local Link Building and signal stacking. Setup waived with 12-month commitment.',
    badge: 'Aggressive',
    mutuallyExclusiveWith: ['local_seo_standard'],
  },
  local_seo_trial: {
    key: 'local_seo_trial',
    name: 'Local SEO — Free Trial',
    category: 'local_seo',
    setup: 0,
    monthly: 0,
    description:
      '10-day GBP CTR boost trial. Requires physical-address GBP. Demonstrates map-pack lift before commitment.',
    badge: 'Free',
  },
  site_seo_bundled: {
    key: 'site_seo_bundled',
    name: 'Site SEO (bundled with Local SEO)',
    category: 'addon',
    setup: 2594,
    monthly: 0,
    description:
      'On-site optimization, technical SEO, and content optimization. Pairs aggressively well with Map Pack work.',
    mutuallyExclusiveWith: ['site_seo_standalone'],
  },
  site_seo_standalone: {
    key: 'site_seo_standalone',
    name: 'Site SEO (standalone)',
    category: 'addon',
    setup: 3891,
    monthly: 0,
    description:
      'Available without Local SEO if client only wants on-site work.',
    mutuallyExclusiveWith: ['site_seo_bundled'],
  },
  extra_links: {
    key: 'extra_links',
    name: 'Extra Links Bundle',
    category: 'addon',
    setup: 0,
    monthly: 1500,
    description:
      '(5) Targeted Niche Edits OR (2) 1000+ RD Links · (1) 1k Traffic Guest Post OR (1) DR30+ Link · (1) Niche Edit OR (1) 50–200 RD Links · (1) Google News Link. Add-on only.',
  },
  astro_rebuild: {
    key: 'astro_rebuild',
    name: 'Astro Site Rebuild (SEO requirement)',
    category: 'addon',
    setup: 0,
    monthly: 250,
    requiresSeo: true,
    description:
      '$250/mo for 12 months ($3,000 total). Required for SEO unless client is already on WordPress.',
  },
  astro_build_cash: {
    key: 'astro_build_cash',
    name: 'Astro Site Build — Pay in Full',
    category: 'web',
    setup: 2500,
    monthly: 0,
    description:
      'One-time payment on Astro stack. Best value option.',
    badge: 'Best Value',
    mutuallyExclusiveWith: ['astro_build_finance'],
  },
  astro_build_finance: {
    key: 'astro_build_finance',
    name: 'Astro Site Build — Financed (12mo)',
    category: 'web',
    setup: 0,
    monthly: 250,
    description: '$250/mo for 12 months ($3,000 total). Same build, financed.',
    mutuallyExclusiveWith: ['astro_build_cash'],
  },
  ott_spectrum: {
    key: 'ott_spectrum',
    name: 'Streaming OTT / Connected TV',
    category: 'paid_media',
    setup: 0,
    monthly: 5000,
    isAdSpend: true,
    minAdSpend: 5000,
    description:
      'Spectrum partnership. FREE video production included for Central FL clients. No agency fee on $5K+/mo.',
    badge: 'Spectrum',
  },
  google_ads: {
    key: 'google_ads',
    name: 'Google Ads (PPC)',
    category: 'paid_media',
    setup: 0,
    monthly: 5000,
    isAdSpend: true,
    minAdSpend: 5000,
    description:
      'No agency management fee on top of ad spend at $5K+/mo.',
  },
};

export const PRODUCT_LIST: Product[] = Object.values(PRODUCTS);

export const CATEGORY_META: Record<
  string,
  { label: string; blurb: string; accent: string }
> = {
  local_seo: {
    label: 'Local SEO',
    blurb: 'GBP-focused programs — the core offer.',
    accent: 'brand',
  },
  addon: {
    label: 'SEO Add-Ons',
    blurb: 'Bolt-ons that multiply Local SEO results.',
    accent: 'accent',
  },
  web: {
    label: 'Web Design',
    blurb: 'Astro-stack builds, cash or financed.',
    accent: 'ink',
  },
  paid_media: {
    label: 'Paid Media',
    blurb: 'Ad spend products — commission off 15% margin.',
    accent: 'accent',
  },
};
