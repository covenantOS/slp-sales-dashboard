import {
  Banknote,
  PiggyBank,
  TrendingUp,
  CalendarRange,
  BadgeDollarSign,
  BadgePercent,
  Percent,
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
  const adLines = included.filter((l) => l.isAdSpend);
  const nonAdLines = included.filter((l) => !l.isAdSpend);
  const adCommission = adLines.reduce(
    (sum, l) => sum + l.totalCommission,
    0,
  );
  const nonAdCommission = nonAdLines.reduce(
    (sum, l) => sum + l.totalCommission,
    0,
  );

  return (
    <div className="space-y-4 sticky top-[72px]">
      {/* Hero totals */}
      <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-ink-950 text-white p-5 shadow-soft overflow-hidden relative">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-slp-500/30 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-slp-700/30 blur-3xl" />
        <div className="relative">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-300">
            Contract Value · {months} mo
          </div>
          <div className="mt-1 text-[40px] leading-none font-display font-extrabold num">
            {fmt(totals.contractValue)}
          </div>
          <div className="text-xs text-ink-400 mt-2">
            {included.length} product{included.length === 1 ? '' : 's'}
            {totals.totalDiscount > 0 && (
              <> · {fmt(totals.totalDiscount)} discount</>
            )}{' '}
            · {fmt(totals.monthly)}/mo
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
            <div className="rounded-xl bg-slp-500/15 border border-slp-400/30 p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slp-200">
                <TrendingUp size={12} /> Your Commission
              </div>
              <div className="text-xl font-display font-bold num mt-1 text-white">
                {fmt(totals.totalCommission)}
              </div>
              <div className="text-[10px] text-slp-200/80 mt-0.5">
                Over contract
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commission breakdown */}
      <div className="card p-5">
        <div className="section-title flex items-center gap-1.5">
          <Percent size={11} /> Commission Breakdown
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div>
              <div className="font-semibold text-ink-800">Non-ad-spend</div>
              <div className="text-[11px] text-ink-400">
                {quote.rep.nonAdCommissionRate}% × revenue
              </div>
            </div>
            <div className="num font-bold text-ink-900">
              {fmt(nonAdCommission)}
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div>
              <div className="font-semibold text-ink-800">Ad-spend</div>
              <div className="text-[11px] text-ink-400">
                {quote.rep.adCommissionRate}% × 15% margin
              </div>
            </div>
            <div className="num font-bold text-ink-900">
              {fmt(adCommission)}
            </div>
          </div>
          <div className="h-px bg-ink-100 my-2" />
          <div className="flex justify-between items-center text-sm">
            <div className="font-bold text-slp-600">Total commission</div>
            <div className="num font-extrabold text-slp-600 text-lg">
              {fmt(totals.totalCommission)}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs pt-1">
            <div className="text-ink-500">Monthly run-rate</div>
            <div className="num font-semibold text-ink-700">
              {fmtCents(totals.monthlyCommission)}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="card p-5">
        <div className="section-title flex items-center gap-1.5">
          <BadgeDollarSign size={12} /> Totals
        </div>
        <Row icon={<Banknote size={14} />} label="Setup" value={fmt(totals.setup)} />
        <Row
          icon={<CalendarRange size={14} />}
          label="Monthly recurring"
          value={`${fmt(totals.monthly)}/mo`}
        />
        <Row
          icon={<PiggyBank size={14} />}
          label={`${months}-mo contract`}
          value={fmt(totals.contractValue)}
        />
        <Row
          icon={<BadgePercent size={14} />}
          label="Total discount"
          value={fmt(totals.totalDiscount)}
          muted
        />
      </div>

      {/* Per-line */}
      {included.length > 0 && (
        <div className="card p-5">
          <div className="section-title">Line Items</div>
          <div className="space-y-2.5">
            {included.map((l) => (
              <div
                key={l.key}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink-800 truncate">
                    {l.name}
                  </div>
                  <div className="text-[10px] text-ink-400 mt-0.5">
                    {l.isOneTime
                      ? 'One-time'
                      : `${l.commissionMonths} mo commission`}
                    {' · '}
                    {l.commissionBase}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="num font-semibold text-ink-900">
                    {l.monthlyAfterDiscount > 0
                      ? `${fmt(l.monthlyAfterDiscount)}/mo`
                      : fmt(l.setupAfterDiscount)}
                  </div>
                  <div className="num text-[10px] text-slp-600 font-semibold">
                    +{fmt(l.totalCommission)}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
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
        className={`num text-sm font-semibold text-ink-900 ${
          muted ? '!text-ink-400 !font-medium' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}
