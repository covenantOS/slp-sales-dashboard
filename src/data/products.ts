import type { Product, ProductKey } from '../types';

export const PRODUCTS: Record<ProductKey, Product> = {
  local_seo_standard: {
    key: 'local_seo_standard',
    name: 'Local SEO — Standard',
    category: 'local_seo',
    setup: 1500,
    monthly: 2000,
    setupWaivable: true,
    triggersAstroRequirement: true,
    description:
      'Full GBP optimization, citations, signals, and link building on a 12-month roadmap. Setup waived with 12-month commitment.',
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
    triggersAstroRequirement: true,
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
    setup: 0,
    monthly: 2594,
    requiresAnyOf: ['local_seo_standard', 'local_seo_extreme'],
    triggersAstroRequirement: true,
    description:
      'On-site optimization, technical SEO, and content optimization. Pairs aggressively well with Map Pack work.',
    mutuallyExclusiveWith: ['site_seo_standalone'],
  },
  site_seo_standalone: {
    key: 'site_seo_standalone',
    name: 'Site SEO (standalone)',
    category: 'addon',
    setup: 1500,
    monthly: 3891,
    setupWaivable: true,
    triggersAstroRequirement: true,
    description:
      'On-site optimization without Local SEO. $1,500 setup waived with 12-month commitment.',
    mutuallyExclusiveWith: ['site_seo_bundled'],
  },
  extra_links: {
    key: 'extra_links',
    name: 'Extra Links Bundle',
    category: 'addon',
    setup: 0,
    monthly: 1500,
    requiresAnyOf: ['local_seo_standard', 'local_seo_extreme'],
    description:
      '(5) Targeted Niche Edits OR (2) 1000+ RD Links · (1) 1k Traffic Guest Post OR (1) DR30+ Link · (1) Niche Edit OR (1) 50–200 RD Links · (1) Google News Link. Add-on only.',
  },
  astro_build_cash: {
    key: 'astro_build_cash',
    name: 'Astro Site Build — Pay in Full',
    category: 'web',
    setup: 2500,
    monthly: 0,
    isOneTime: true,
    isAstro: true,
    description:
      'One-time $2,500 on the Astro stack. Best value. Satisfies the SEO Astro requirement.',
    badge: 'Best Value',
    mutuallyExclusiveWith: ['astro_build_finance'],
  },
  astro_build_finance: {
    key: 'astro_build_finance',
    name: 'Astro Site Build — Financed (12 mo)',
    category: 'web',
    setup: 0,
    monthly: 250,
    finiteMonths: 12,
    isAstro: true,
    description:
      '$250/mo for 12 months ($3,000 total). Term ends at month 12 — commission ends with it. Satisfies the SEO Astro requirement.',
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
    spectrumPartnership: true,
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
    spectrumPartnership: true,
    description:
      'Spectrum partnership. No agency management fee on top of ad spend at $5K+/mo.',
    badge: 'Spectrum',
  },
};

export const PRODUCT_LIST: Product[] = Object.values(PRODUCTS);

export const CATEGORY_META: Record<
  string,
  { label: string; blurb: string }
> = {
  local_seo: {
    label: 'Local SEO',
    blurb: 'GBP-focused programs — the core offer.',
  },
  addon: {
    label: 'SEO Add-Ons',
    blurb: 'Bolt-ons that multiply Local SEO results.',
  },
  web: {
    label: 'Web Design (Astro)',
    blurb: 'Required for SEO unless client runs WordPress with Bricks/Elementor.',
  },
  paid_media: {
    label: 'Paid Media',
    blurb: 'Spectrum partnership — ad spend with 15% margin.',
  },
};

export const isSeoProduct = (key: ProductKey) =>
  PRODUCTS[key]?.triggersAstroRequirement === true;

export const isAstroProduct = (key: ProductKey) =>
  PRODUCTS[key]?.isAstro === true;
