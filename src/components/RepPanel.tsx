import { User, Percent, CalendarClock, Lock } from 'lucide-react';
import type { RepConfig } from '../types';
import { COMMISSION_LIMITS } from '../types';

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
            Set your agreement tier — all commission is recurring.
          </div>
        </div>
        <div className="h-9 w-9 rounded-xl bg-slp-50 text-slp-600 flex items-center justify-center">
          <User size={18} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="label block mb-1.5">Rep name</label>
          <input
            className="input"
            placeholder="Taylor Rivera"
            value={rep.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">Rep email</label>
          <input
            className="input"
            type="email"
            placeholder="taylor@slp.com"
            value={rep.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <RangeInput
          label="Non-Ad Commission"
          value={rep.nonAdCommissionRate}
          min={COMMISSION_LIMITS.nonAd.min}
          max={COMMISSION_LIMITS.nonAd.max}
          onChange={(v) => update('nonAdCommissionRate', v)}
          hint={`Range ${COMMISSION_LIMITS.nonAd.min}–${COMMISSION_LIMITS.nonAd.max}% per your agreement`}
        />
        <RangeInput
          label="Ad-Spend Commission"
          value={rep.adCommissionRate}
          min={COMMISSION_LIMITS.ad.min}
          max={COMMISSION_LIMITS.ad.max}
          onChange={(v) => update('adCommissionRate', v)}
          hint={`Range ${COMMISSION_LIMITS.ad.min}–${COMMISSION_LIMITS.ad.max}% of the 15% margin`}
        />

        <div>
          <label className="label flex items-center gap-1.5 mb-1.5">
            <CalendarClock size={11} /> Commitment (months)
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
          <div className="stat-sub">12-mo unlocks setup waiver.</div>
        </div>

        <div>
          <label className="label flex items-center gap-1.5 mb-1.5">
            <Lock size={11} /> Ad-Spend Margin
          </label>
          <div className="relative">
            <input
              className="input pr-9 bg-ink-50 text-ink-500"
              value="15"
              disabled
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">
              %
            </span>
          </div>
          <div className="stat-sub">Locked. SLP margin on all ad spend.</div>
        </div>
      </div>
    </div>
  );
}

function RangeInput({
  label,
  value,
  min,
  max,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  const outOfRange = value < min || value > max;
  return (
    <div>
      <label className="label flex items-center gap-1.5 mb-1.5">
        <Percent size={11} /> {label}
      </label>
      <div className="relative">
        <input
          className={`input pr-9 ${outOfRange ? 'border-slp-400 ring-2 ring-slp-100' : ''}`}
          type="number"
          min={min}
          max={max}
          step={0.5}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 text-sm">
          %
        </span>
      </div>
      <div className={`stat-sub ${outOfRange ? 'text-slp-600 font-semibold' : ''}`}>
        {outOfRange ? `Outside ${min}–${max}% range — confirm with ops` : hint}
      </div>
    </div>
  );
}
