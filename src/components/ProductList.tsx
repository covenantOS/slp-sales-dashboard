import type { LineItem, LineTotals, ProductKey, QuoteState } from '../types';
import { CATEGORY_META, PRODUCT_LIST, PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface Props {
  quote: QuoteState;
  totalsByKey: Map<ProductKey, LineTotals>;
  onItemChange: (key: ProductKey, partial: Partial<LineItem>) => void;
}

export function ProductList({ quote, totalsByKey, onItemChange }: Props) {
  const grouped = PRODUCT_LIST.reduce<Record<string, typeof PRODUCT_LIST>>(
    (acc, p) => {
      (acc[p.category] ||= []).push(p);
      return acc;
    },
    {},
  );

  const handleToggle = (key: ProductKey) => {
    const current = quote.items[key];
    const nextIncluded = !current.included;
    onItemChange(key, { included: nextIncluded });
    if (nextIncluded) {
      const p = PRODUCTS[key];
      p.mutuallyExclusiveWith?.forEach((k) => {
        if (quote.items[k]?.included) {
          onItemChange(k, { included: false });
        }
      });
    }
  };

  const checkDisabled = (key: ProductKey): { disabled: boolean; reason?: string } => {
    const p = PRODUCTS[key];
    if (p.requiresAnyOf && !quote.items[key]?.included) {
      const met = p.requiresAnyOf.some((r) => quote.items[r]?.included);
      if (!met) {
        return {
          disabled: true,
          reason: 'Requires Local SEO',
        };
      }
    }
    return { disabled: false };
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, products]) => {
        const meta = CATEGORY_META[cat];
        return (
          <section key={cat}>
            <div className="flex items-end justify-between mb-3 px-1">
              <div>
                <h3 className="font-display font-bold text-ink-900 text-lg tracking-tight">
                  {meta?.label || cat}
                </h3>
                <p className="text-xs text-ink-500">{meta?.blurb}</p>
              </div>
              <div className="text-[11px] text-ink-400 font-semibold">
                {products.filter((p) => quote.items[p.key]?.included).length}/
                {products.length} selected
              </div>
            </div>
            <div className="grid gap-3">
              {products.map((p) => {
                const item = quote.items[p.key];
                const line = totalsByKey.get(p.key)!;
                const { disabled, reason } = checkDisabled(p.key);
                return (
                  <ProductCard
                    key={p.key}
                    product={p}
                    item={item}
                    line={line}
                    disabled={disabled}
                    disabledReason={reason}
                    onToggle={() => handleToggle(p.key)}
                    onChange={(partial) => onItemChange(p.key, partial)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
