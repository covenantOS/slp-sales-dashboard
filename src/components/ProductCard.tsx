import {
  Check,
  Plus,
  Sparkles,
  ShieldCheck,
  Tag,
  DollarSign,
  Lock,
  Tv,
} from 'lucide-react';
import type { LineItem, LineTotals, Product } from '../types';
import { fmt } from '../lib/calc';

interface Props {
  product: Product;
  item: LineItem;
  line: LineTotals;
  disabled?: boolean;
  disabledReason?: string;
  onToggle: () => void;
  onChange: (partial: Partial<LineItem>) => void;
}

export function ProductCard({
  product,
  item,
  line,
  disabled,
  disabledReason,
  onToggle,
  onChange,
}: Props) {
  const included = item.included;
  const hasMonthlyOverride =
    item.monthlyOverride !== undefined && item.monthlyOverride !== null;

  return (
    <div
      className={`rounded-2xl border transition-all relative ${
        disabled
          ? 'border-ink-100 bg-ink-50/50 opacity-70'
          : included
            ? 'border-slp-300 bg-white shadow-red'
            : 'border-ink-100 bg-white shadow-card hover:border-ink-200'
      }`}
    >
      <div className="p-4 flex items-start gap-3">
        <button
          onClick={onToggle}
          disabled={disabled && !included}
          className={`shrink-0 mt-0.5 h-6 w-6 rounded-lg border transition flex items-center justify-center ${
            included
              ? 'bg-slp-500 border-slp-500 text-white'
              : disabled
                ? 'bg-ink-100 border-ink-200 text-ink-300 cursor-not-allowed'
                : 'bg-white border-ink-300 hover:border-slp-400 text-transparent'
          }`}
          aria-label={included ? 'Remove from quote' : 'Add to quote'}
        >
          {included ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-ink-900 text-[15px]">
                  {product.name}
                </h4>
                {product.badge && (
                  <span className="chip bg-slp-50 text-slp-700">
                    {product.spectrumPartnership ? (
                      <Tv size={10} />
                    ) : (
                      <Sparkles size={10} />
                    )}{' '}
                    {product.badge}
                  </span>
                )}
                {product.isAdSpend && (
                  <span className="chip bg-ink-100 text-ink-700">Ad Spend</span>
                )}
                {product.finiteMonths && (
                  <span className="chip bg-ink-100 text-ink-600">
                    {product.finiteMonths}-mo term
                  </span>
                )}
                {product.isOneTime && (
                  <span className="chip bg-ink-100 text-ink-600">
                    One-time
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                {product.description}
              </p>
              {disabled && disabledReason && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] bg-ink-100 text-ink-600 rounded-md px-2 py-1 font-semibold">
                  <Lock size={11} /> {disabledReason}
                </div>
              )}
            </div>
            <div className="shrink-0 text-right">
              {product.setup > 0 && (
                <div className="text-[10px] uppercase tracking-wide text-ink-400 font-bold">
                  Setup{' '}
                  <span className="text-ink-900 font-extrabold">
                    {fmt(product.setup)}
                  </span>
                </div>
              )}
              {product.monthly > 0 && (
                <div className="text-[10px] uppercase tracking-wide text-ink-400 font-bold">
                  Monthly{' '}
                  <span className="text-ink-900 font-extrabold">
                    {fmt(product.monthly)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {included && (
        <div className="border-t border-ink-100 p-4 pt-3 grid grid-cols-12 gap-3 bg-ink-50/40 rounded-b-2xl">
          {product.isAdSpend && (
            <div className="col-span-12 sm:col-span-6">
              <label className="label flex items-center gap-1 mb-1.5">
                <DollarSign size={11} /> Ad Spend (monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">
                  $
                </span>
                <input
                  className="input pl-7 num"
                  type="number"
                  min={product.minAdSpend || 0}
                  step={100}
                  value={
                    hasMonthlyOverride
                      ? (item.monthlyOverride as number)
                      : product.monthly
                  }
                  onChange={(e) =>
                    onChange({
                      monthlyOverride: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              {product.minAdSpend && (
                <div className="stat-sub">
                  Minimum {fmt(product.minAdSpend)}/mo for $0 fee
                </div>
              )}
            </div>
          )}

          {!product.isAdSpend && product.monthly > 0 && (
            <div className="col-span-12 sm:col-span-6">
              <label className="label flex items-center gap-1 mb-1.5">
                <DollarSign size={11} /> Monthly (override)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">
                  $
                </span>
                <input
                  className="input pl-7 num"
                  type="number"
                  min={0}
                  step={50}
                  value={
                    hasMonthlyOverride
                      ? (item.monthlyOverride as number)
                      : product.monthly
                  }
                  onChange={(e) =>
                    onChange({
                      monthlyOverride: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          )}

          <div className="col-span-7 sm:col-span-4">
            <label className="label flex items-center gap-1 mb-1.5">
              <Tag size={11} /> Discount
            </label>
            <div className="flex gap-2">
              <select
                className="input !py-2 !px-2 w-[86px]"
                value={item.discountType}
                onChange={(e) =>
                  onChange({
                    discountType: e.target.value as LineItem['discountType'],
                  })
                }
              >
                <option value="none">None</option>
                <option value="percent">%</option>
                <option value="amount">$</option>
              </select>
              <input
                className="input num"
                type="number"
                min={0}
                step={1}
                disabled={item.discountType === 'none'}
                value={item.discountValue}
                onChange={(e) =>
                  onChange({
                    discountValue: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          {product.setupWaivable && (
            <div className="col-span-5 sm:col-span-2">
              <label className="label flex items-center gap-1 mb-1.5">
                <ShieldCheck size={11} /> Waive Setup
              </label>
              <button
                onClick={() => onChange({ waiveSetup: !item.waiveSetup })}
                className={`w-full h-[42px] rounded-xl text-sm font-semibold transition ${
                  item.waiveSetup
                    ? 'bg-slp-500 text-white shadow-red'
                    : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-300'
                }`}
              >
                {item.waiveSetup ? 'Waived' : 'Apply'}
              </button>
            </div>
          )}

          <div className="col-span-12 mt-1 pt-3 border-t border-dashed border-ink-200 grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-ink-400 font-bold">
                Setup
              </div>
              <div className="text-sm font-extrabold text-ink-900 num">
                {fmt(line.setupAfterDiscount)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-ink-400 font-bold">
                Monthly
              </div>
              <div className="text-sm font-extrabold text-ink-900 num">
                {fmt(line.monthlyAfterDiscount)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-ink-400 font-bold">
                Commission
              </div>
              <div className="text-sm font-extrabold text-slp-600 num">
                {fmt(line.totalCommission)}
              </div>
              <div className="text-[10px] text-ink-400">
                {line.commissionBase}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
