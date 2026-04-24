import { AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import type { Rule } from '../types';

interface Props {
  rules: Rule[];
}

const META: Record<
  Rule['severity'],
  { icon: React.ReactNode; className: string; iconCls: string; label: string }
> = {
  error: {
    icon: <AlertCircle size={16} />,
    className: 'bg-slp-50 border-slp-200 text-slp-900',
    iconCls: 'bg-slp-500 text-white',
    label: 'Required',
  },
  warn: {
    icon: <AlertTriangle size={16} />,
    className: 'bg-amber-50 border-amber-200 text-amber-900',
    iconCls: 'bg-amber-500 text-white',
    label: 'Heads up',
  },
  info: {
    icon: <Lightbulb size={16} />,
    className: 'bg-ink-50 border-ink-200 text-ink-800',
    iconCls: 'bg-ink-700 text-white',
    label: 'Tip',
  },
};

export function RulesBanner({ rules }: Props) {
  if (rules.length === 0) return null;
  return (
    <div className="space-y-2.5">
      {rules.map((r) => {
        const m = META[r.severity];
        return (
          <div
            key={r.id}
            className={`rounded-2xl border p-3.5 flex items-start gap-3 ${m.className}`}
          >
            <div
              className={`shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${m.iconCls}`}
            >
              {m.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {m.label}
                </span>
                <span className="font-semibold text-sm">{r.title}</span>
              </div>
              <div className="text-xs opacity-85 mt-0.5 leading-relaxed">
                {r.detail}
              </div>
            </div>
            {r.action && (
              <button
                onClick={r.action.apply}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  r.severity === 'error'
                    ? 'bg-slp-500 text-white hover:bg-slp-600'
                    : r.severity === 'warn'
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-ink-900 text-white hover:bg-ink-800'
                }`}
              >
                {r.action.label}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
