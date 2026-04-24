export type Category =
  | 'local_seo'
  | 'addon'
  | 'web'
  | 'paid_media'
  | 'discount';

export type ProductKey =
  | 'local_seo_standard'
  | 'local_seo_extreme'
  | 'local_seo_trial'
  | 'site_seo_bundled'
  | 'site_seo_standalone'
  | 'extra_links'
  | 'astro_rebuild'
  | 'astro_build_cash'
  | 'astro_build_finance'
  | 'ott_spectrum'
  | 'google_ads';

export interface Product {
  key: ProductKey;
  name: string;
  category: Category;
  setup: number;
  monthly: number;
  isAdSpend?: boolean;
  minAdSpend?: number;
  adSpendMarginPct?: number;
  setupWaivable?: boolean;
  requiresSeo?: boolean;
  description: string;
  badge?: string;
  mutuallyExclusiveWith?: ProductKey[];
}

export interface LineItem {
  productKey: ProductKey;
  included: boolean;
  monthlyOverride?: number;
  discountType: 'none' | 'percent' | 'amount';
  discountValue: number;
  qty: number;
  waiveSetup?: boolean;
}

export interface Client {
  company: string;
  contact: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  industry: string;
  notes: string;
}

export interface RepConfig {
  name: string;
  email: string;
  commissionRate: number;
  adSpendMarginPct: number;
  commitmentMonths: number;
  recurringCommission: boolean;
}

export interface QuoteState {
  id?: string;
  rep: RepConfig;
  client: Client;
  items: Record<ProductKey, LineItem>;
  createdAt?: string;
}

export interface LineTotals {
  key: ProductKey;
  name: string;
  included: boolean;
  isAdSpend: boolean;
  setup: number;
  monthly: number;
  setupAfterDiscount: number;
  monthlyAfterDiscount: number;
  setupDiscount: number;
  monthlyDiscount: number;
  contractTotal: number;
  dayOneCash: number;
  monthlyCommission: number;
  setupCommission: number;
  totalCommissionFirstYear: number;
  commissionBase: string;
}

export interface Totals {
  setup: number;
  monthly: number;
  dayOneCash: number;
  contractValue: number;
  monthlyCommission: number;
  setupCommission: number;
  totalCommissionFirstYear: number;
  totalDiscount: number;
  lines: LineTotals[];
}
