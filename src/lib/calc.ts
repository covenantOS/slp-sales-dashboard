import type {
  LineItem,
  LineTotals,
  ProductKey,
  QuoteState,
  Totals,
} from '../types';
import { COMMISSION_LIMITS } from '../types';
import { PRODUCTS } from '../data/products';

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const applyDiscount = (
  amount: number,
  type: LineItem['discountType'],
  value: number,
): { after: number; discount: number } => {
  if (!amount || type === 'none' || !value) {
    return { after: amount, discount: 0 };
  }
  if (type === 'percent') {
    const d = Math.min(amount, amount * (value / 100));
    return { after: amount - d, discount: d };
  }
  const d = Math.min(amount, value);
  return { after: amount - d, discount: d };
};

export const computeLine = (
  key: ProductKey,
  item: LineItem,
  rep: QuoteState['rep'],
): LineTotals => {
  const p = PRODUCTS[key];
  const qty = item.qty > 0 ? item.qty : 1;
  const rawMonthly =
    item.monthlyOverride !== undefined && item.monthlyOverride !== null
      ? item.monthlyOverride
      : p.monthly;
  const rawSetup = item.waiveSetup ? 0 : p.setup;

  const monthlyGross = rawMonthly * qty;
  const setupGross = rawSetup * qty;

  const mAfter = applyDiscount(monthlyGross, item.discountType, item.discountValue);
  const sAfter = applyDiscount(setupGross, item.discountType, item.discountValue);

  const monthlyAfter = mAfter.after;
  const setupAfter = sAfter.after;

  const nonAdRate =
    clamp(
      rep.nonAdCommissionRate,
      COMMISSION_LIMITS.nonAd.min,
      COMMISSION_LIMITS.nonAd.max,
    ) / 100;
  const adRate =
    clamp(rep.adCommissionRate, COMMISSION_LIMITS.ad.min, COMMISSION_LIMITS.ad.max) /
    100;
  const adMargin = COMMISSION_LIMITS.adSpendMargin / 100;

  // Number of months commission accrues for the monthly line.
  // - Finite-term products (Astro financed): capped at their finiteMonths.
  // - Everything else: commitmentMonths.
  const commissionMonths = p.finiteMonths
    ? Math.min(p.finiteMonths, rep.commitmentMonths || p.finiteMonths)
    : rep.commitmentMonths || 12;

  let monthlyCommission = 0;
  let setupCommission = 0;
  let commissionBase = '';

  if (p.isAdSpend) {
    const margin = monthlyAfter * adMargin;
    monthlyCommission = margin * adRate;
    commissionBase = `${rep.adCommissionRate}% × 15% margin`;
  } else {
    monthlyCommission = monthlyAfter * nonAdRate;
    setupCommission = setupAfter * nonAdRate;
    commissionBase = `${rep.nonAdCommissionRate}% of revenue`;
  }

  const contractMonths = p.finiteMonths
    ? Math.min(p.finiteMonths, rep.commitmentMonths || p.finiteMonths)
    : rep.commitmentMonths || 12;
  const contractTotal = setupAfter + monthlyAfter * contractMonths;
  const dayOneCash = setupAfter + monthlyAfter;

  const totalCommission =
    setupCommission + monthlyCommission * commissionMonths;

  return {
    key,
    name: p.name,
    included: item.included,
    isAdSpend: !!p.isAdSpend,
    isOneTime: !!p.isOneTime,
    commissionMonths,
    setup: setupGross,
    monthly: monthlyGross,
    setupAfterDiscount: setupAfter,
    monthlyAfterDiscount: monthlyAfter,
    setupDiscount: sAfter.discount,
    monthlyDiscount: mAfter.discount,
    contractTotal,
    dayOneCash,
    monthlyCommission,
    setupCommission,
    totalCommission,
    commissionBase,
  };
};

export const computeTotals = (q: QuoteState): Totals => {
  const lines: LineTotals[] = [];
  let setup = 0;
  let monthly = 0;
  let dayOneCash = 0;
  let contractValue = 0;
  let monthlyCommission = 0;
  let setupCommission = 0;
  let totalCommission = 0;
  let totalDiscount = 0;

  (Object.keys(PRODUCTS) as ProductKey[]).forEach((key) => {
    const item = q.items[key];
    if (!item) return;
    const line = computeLine(key, item, q.rep);
    lines.push(line);
    if (!item.included) return;
    setup += line.setupAfterDiscount;
    monthly += line.monthlyAfterDiscount;
    dayOneCash += line.dayOneCash;
    contractValue += line.contractTotal;
    monthlyCommission += line.monthlyCommission;
    setupCommission += line.setupCommission;
    totalCommission += line.totalCommission;
    totalDiscount += line.setupDiscount + line.monthlyDiscount;
  });

  return {
    setup,
    monthly,
    dayOneCash,
    contractValue,
    monthlyCommission,
    setupCommission,
    totalCommission,
    totalDiscount,
    lines,
  };
};

export const defaultLineItem = (): LineItem => ({
  productKey: 'local_seo_standard',
  included: false,
  discountType: 'none',
  discountValue: 0,
  qty: 1,
  waiveSetup: false,
});

export const blankQuote = (): QuoteState => {
  const items = {} as Record<ProductKey, LineItem>;
  (Object.keys(PRODUCTS) as ProductKey[]).forEach((k) => {
    items[k] = { ...defaultLineItem(), productKey: k };
  });
  return {
    rep: {
      name: '',
      email: '',
      nonAdCommissionRate: 15,
      adCommissionRate: 15,
      commitmentMonths: 12,
    },
    client: {
      company: '',
      contact: '',
      email: '',
      phone: '',
      website: '',
      city: '',
      industry: '',
      notes: '',
      hasWordPressBricks: false,
    },
    items,
  };
};

export const fmt = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export const fmtCents = (n: number) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
