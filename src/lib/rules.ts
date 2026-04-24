import { PRODUCTS, isAstroProduct, isSeoProduct } from '../data/products';
import type { LineItem, ProductKey, QuoteState, Rule } from '../types';

type ItemMutator = (key: ProductKey, partial: Partial<LineItem>) => void;

export interface RuleCtx {
  setWordPressOverride: (on: boolean) => void;
  toggleItem: ItemMutator;
}

export const evaluateRules = (q: QuoteState, ctx: RuleCtx): Rule[] => {
  const rules: Rule[] = [];
  const included = (Object.keys(PRODUCTS) as ProductKey[]).filter(
    (k) => q.items[k]?.included,
  );
  const hasSeo = included.some((k) => isSeoProduct(k));
  const hasAstro = included.some((k) => isAstroProduct(k));
  const wpBricks = q.client.hasWordPressBricks;

  // Astro rebuild requirement
  if (hasSeo && !hasAstro && !wpBricks) {
    rules.push({
      id: 'astro-required',
      severity: 'error',
      title: 'Astro site build is required for SEO',
      detail:
        'Add an Astro Site Build (cash or financed) or confirm the client runs WordPress with Bricks/Elementor. You can verify that with the client override in the Client panel.',
      action: {
        label: 'Add Astro Build (Pay in Full)',
        apply: () => ctx.toggleItem('astro_build_cash', { included: true }),
      },
    });
  }
  if (hasSeo && !hasAstro && wpBricks) {
    rules.push({
      id: 'astro-recommended',
      severity: 'warn',
      title: 'Astro rebuild strongly recommended',
      detail:
        'The client uses WP + Bricks/Elementor so Astro is optional, but an Astro rebuild gives much faster rankings and pagespeed. Offer financed $250/mo for 12 months if cash is tight.',
      action: {
        label: 'Add Financed Astro ($250/mo)',
        apply: () => ctx.toggleItem('astro_build_finance', { included: true }),
      },
    });
  }

  // Required dependencies (bundled add-ons)
  included.forEach((k) => {
    const req = PRODUCTS[k].requiresAnyOf;
    if (!req) return;
    const met = req.some((r) => q.items[r]?.included);
    if (!met) {
      rules.push({
        id: `requires-${k}`,
        severity: 'error',
        title: `${PRODUCTS[k].name} requires Local SEO`,
        detail:
          'This is an add-on that can only be sold with an active Local SEO plan. Add Standard or Extreme, or switch to the standalone version.',
        action:
          k === 'site_seo_bundled'
            ? {
                label: 'Switch to Standalone',
                apply: () => {
                  ctx.toggleItem('site_seo_bundled', { included: false });
                  ctx.toggleItem('site_seo_standalone', { included: true });
                },
              }
            : {
                label: 'Add Local SEO Standard',
                apply: () =>
                  ctx.toggleItem('local_seo_standard', { included: true }),
              },
      });
    }
  });

  // Mutually exclusive pairs (should usually be handled at toggle-time, but
  // double-check)
  const seen = new Set<string>();
  included.forEach((k) => {
    const me = PRODUCTS[k].mutuallyExclusiveWith;
    if (!me) return;
    me.forEach((other) => {
      if (q.items[other]?.included) {
        const pair = [k, other].sort().join('|');
        if (seen.has(pair)) return;
        seen.add(pair);
        rules.push({
          id: `exclusive-${pair}`,
          severity: 'warn',
          title: 'Mutually exclusive selection',
          detail: `${PRODUCTS[k].name} and ${PRODUCTS[other].name} can't be on the same quote. Keep one.`,
        });
      }
    });
  });

  // Ad spend below minimum
  included.forEach((k) => {
    const p = PRODUCTS[k];
    if (!p.isAdSpend || !p.minAdSpend) return;
    const item = q.items[k];
    const current =
      item.monthlyOverride !== undefined && item.monthlyOverride !== null
        ? item.monthlyOverride
        : p.monthly;
    if (current < p.minAdSpend) {
      rules.push({
        id: `min-${k}`,
        severity: 'warn',
        title: `${p.name} ad spend below the $${p.minAdSpend.toLocaleString()} minimum`,
        detail:
          'Below the minimum, the $0 agency fee no longer applies. Confirm billing with the client before sending.',
      });
    }
  });

  // Setup waiver hint — show an info rule when commitment is 12+ and setup isn't waived
  (['local_seo_standard', 'local_seo_extreme', 'site_seo_standalone'] as ProductKey[]).forEach(
    (k) => {
      const p = PRODUCTS[k];
      const item = q.items[k];
      if (!item?.included || !p.setupWaivable || item.waiveSetup) return;
      if ((q.rep.commitmentMonths || 0) >= 12) {
        rules.push({
          id: `waive-${k}`,
          severity: 'info',
          title: `Waive ${p.name} setup?`,
          detail:
            'Client is on a 12-month commitment — the $1,500 setup can be waived as part of the standard offer.',
          action: {
            label: 'Waive setup',
            apply: () => ctx.toggleItem(k, { waiveSetup: true }),
          },
        });
      }
    },
  );

  return rules;
};
