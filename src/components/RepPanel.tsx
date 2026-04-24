import { User, Percent, CalendarClock, Repeat } from 'lucide-react';
import type { RepConfig } from '../types';

interface Props {
  rep: RepConfig;
  onChange: (rep: RepConfig) => void;
}

export function RepPanel({ rep, onChange }: Props) {
  const update = <K extends keyof RepConfig>(k: K, v: RepConfig[K]) =>
    onChange({ ...rep, [k]: v });

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title mb-1">Sales Rep</div>
          <div className="text-sm text-ink-500">
            Configure commission and contract terms.
          </div>
        </div>
        <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
          <User size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="label block mb-1.5">Rep name</label>
          <input
            className="input"
            placeholder="e.g. Taylor Rivera"
            value={rep.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="label block mb-1.5">Rep email</label>
          <input
            className="input"
            type="email"
            placeholder="taylor@servicelinepro.com"
            value={rep.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label flex items-center gap-1.5 mb-1.5">
            <Percent size={12} /> Commission %
          </label>
          <div className="relative">
            <input
              className="input pr-9"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={rep.commissionRate}
              onChange={(e) =>
                update('commissionRate', parseFloat(e.target.value) || 0)
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">
              %
            </span>
          </div>
          <div className="stat-sub">Applies to revenue on non-ad-spend items.</div>
        </div>

        <div>
          <label className="label flex items-center gap-1.5 mb-1.5">
            <Percent size={12} /> Ad-Spend Margin
          </label>
          <div className="relative">
            <input
              className="input pr-9"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={rep.adSpendMarginPct}
              onChange={(e) =>
                update('adSpendMarginPct', parseFloat(e.target.value) || 0)
              }
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">
              %
            </span>
          </div>
          <div className="stat-sub">
            Your cut is {rep.commissionRate}% of this margin.
          </div>
        </div>

        <div>
          <label className="label flex items-center gap-1.5 mb-1.5">
            <CalendarClock size={12} /> Commitment (months)
          </label>
          <input
            className="input"
            type="number"
            min={1}
            max={60}
            step={1}
            value={rep.commitmentMonths}
            onChange={(e) =>
              update('commitmentMonths', parseInt(e.target.value) || 12)
            }
          />
          <div className="stat-sub">Used for contract value & recurring commission.</div>
        </div>

        <div>
          <label className="label flex items-center gap-1.5 mb-1.5">
            <Repeat size={12} /> Commission type
          </label>
          <div className="flex rounded-xl border border-ink-200 p-0.5 bg-ink-50/60">
            <button
              onClick={() => update('recurringCommission', true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                rep.recurringCommission
                  ? 'bg-white shadow-sm text-ink-900'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              Recurring
            </button>
            <button
              onClick={() => update('recurringCommission', false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                !rep.recurringCommission
                  ? 'bg-white shadow-sm text-ink-900'
                  : 'text-ink-500 hover:text-ink-700'
              }`}
            >
              First Month
            </button>
          </div>
          <div className="stat-sub">How monthly commission accrues.</div>
        </div>
      </div>
    </div>
  );
}
