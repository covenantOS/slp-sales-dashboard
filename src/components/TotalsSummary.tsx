import {
  Banknote,
  PiggyBank,
  TrendingUp,
  CalendarRange,
  BadgeDollarSign,
  BadgePercent,
} from 'lucide-react';
import type { Totals, QuoteState } from '../types';
import { fmt, fmtCents } from '../lib/calc';

interface Props {
  totals: Totals;
  quote: QuoteState;
}

export function TotalsSummary({ totals, quote }: Props) {
  const included = totals.lines.filter((l) => l.included);
  const months = quote.rep.commitmentMonths || 12;

  return (
    <div className="space-y-4 sticky top-6">
      {/* Hero totals */}
      <div className="rounded-2xl bg-ink-900 text-white p-5 shadow-soft overflow-hidden relative">
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="relative">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-300">
            Contract Value · {months} mo
          </div>
          <div className="mt-1 text-4xl font-display font-bold num">
            {fmt(totals.contractValue)}
          </div>
          <div className="text-xs text-ink-400 mt-1">
            {included.length} product{included.length === 1 ? '' : 's'} ·{' '}
            {totals.totalDiscount > 0 && (
              <>{fmt(totals.totalDiscount)} in discounts · </>
            )}
            {fmt(totals.monthly)}/mo recurring
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-300">
                <Banknote size={12} /> Day-1 Cash
              </div>
              <div className="text-xl font-display font-bold num mt-1">
                {fmt(totals.dayOneCash)}
              </div>
              <div className="text-[10px] text-ink-400 mt-0.5">
                Setup + first month
              </div>
            </div>
            <div className="rounded-xl bg-brand-500/15 border border-brand-400/30 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-300">
                <TrendingUp size={12} /> Your Commission
              </div>
              <div className="text-xl font-display font-bold num mt-1 text-brand-200">
                {fmt(totals.totalCommissionFirstYear)}
              </div>
              <div className="text-[10px] text-brand-300/80 mt-0.5">
                Over {months} mo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="card p-5">
        <div className="section-title flex items-center gap-1.5">
          <BadgeDollarSign size={12} /> Breakdown
        </div>
        <Row icon={<Banknote size={14} />} label="Setup" value={fmt(totals.setup)} />
        <Row
          icon={<CalendarRange size={14} />}
          label="Monthly recurring"
          value={`${fmt(totals.monthly)}/mo`}
        />
        <Row
          icon={<PiggyBank size={14} />}
          label="12-mo contract"
          value={fmt(totals.contractValue)}
        />
        <Row
          icon={<BadgePercent size={14} />}
          label="Total discount"
          value={fmt(totals.totalDiscount)}
          muted
        />
        <div className="h-px bg-ink-100 my-3" />
        <Row
          icon={<TrendingUp size={14} />}
          label="Commission / mo"
          value={fmtCents(totals.monthlyCommission)}
          highlight
        />
        <Row
          icon={<BadgeDollarSign size={14} />}
          label="Commission (setup)"
          value={fmtCents(totals.setupCommission)}
          highlight
        />
        <Row
          icon={<TrendingUp size={14} />}
          label={`Commission · ${months} mo`}
          value={fmtCents(totals.totalCommissionFirstYear)}
          bold
        />
      </div>

      {/* Per-line table */}
      {included.length > 0 && (
        <div className="card p-5">
          <div className="section-title">Line Items</div>
          <div className="space-y-2">
            {included.map((l) => (
              <div
                key={l.key}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink-800 truncate">
                    {l.name}
                  </div>
                  <div className="text-[10px] text-ink-400">
                    {l.commissionBase}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="num font-semibold text-ink-900">
                    {fmt(l.monthlyAfterDiscount)}/mo
                  </div>
                  <div className="num text-[10px] text-brand-600 font-semibold">
                    +{fmtCents(l.monthlyCommission)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  muted,
  highlight,
  bold,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div
        className={`flex items-center gap-2 text-xs ${
          muted ? 'text-ink-400' : 'text-ink-500'
        }`}
      >
        <span className="text-ink-400">{icon}</span>
        {label}
      </div>
      <div
        className={`num text-sm ${
          highlight
            ? 'text-brand-600 font-bold'
            : bold
              ? 'text-ink-900 font-bold'
              : 'text-ink-900 font-semibold'
        } ${muted ? '!text-ink-400 !font-medium' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
