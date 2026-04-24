import type {
  LineItem,
  LineTotals,
  ProductKey,
  QuoteState,
  Totals,
} from '../types';
import { PRODUCTS } from '../data/products';

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

  const commissionRate = rep.commissionRate / 100;
  const adSpendMargin = rep.adSpendMarginPct / 100;

  // Commission logic:
  //   Ad-spend products: rep rate applied to (adSpendMargin * monthly).
  //   Non-ad-spend: rep rate applied to monthly AND setup revenue.
  let monthlyCommission = 0;
  let setupCommission = 0;
  let commissionBase = '';

  if (p.isAdSpend) {
    const margin = monthlyAfter * adSpendMargin;
    monthlyCommission = margin * commissionRate;
    commissionBase = `${rep.adSpendMarginPct}% of ad spend × ${rep.commissionRate}%`;
  } else {
    monthlyCommission = monthlyAfter * commissionRate;
    setupCommission = setupAfter * commissionRate;
    commissionBase = `${rep.commissionRate}% of revenue`;
  }

  const contractTotal =
    setupAfter + monthlyAfter * (rep.commitmentMonths || 12);
  const dayOneCash = setupAfter + monthlyAfter;

  const monthsCounted = rep.recurringCommission
    ? rep.commitmentMonths || 12
    : 1;

  const totalCommissionFirstYear =
    setupCommission + monthlyCommission * monthsCounted;

  return {
    key,
    name: p.name,
    included: item.included,
    isAdSpend: !!p.isAdSpend,
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
    totalCommissionFirstYear,
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
  let totalCommissionFirstYear = 0;
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
    totalCommissionFirstYear += line.totalCommissionFirstYear;
    totalDiscount += line.setupDiscount + line.monthlyDiscount;
  });

  return {
    setup,
    monthly,
    dayOneCash,
    contractValue,
    monthlyCommission,
    setupCommission,
    totalCommissionFirstYear,
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
      commissionRate: 15,
      adSpendMarginPct: 15,
      commitmentMonths: 12,
      recurringCommission: true,
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
