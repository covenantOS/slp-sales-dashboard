import { Building2, ShieldAlert } from 'lucide-react';
import type { Client } from '../types';

interface Props {
  client: Client;
  onChange: (client: Client) => void;
}

export function ClientPanel({ client, onChange }: Props) {
  const update = <K extends keyof Client>(k: K, v: Client[K]) =>
    onChange({ ...client, [k]: v });

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="section-title mb-1">Client</div>
          <div className="text-sm text-ink-500">
            Everything shown on the proposal.
          </div>
        </div>
        <div className="h-9 w-9 rounded-xl bg-ink-100 text-ink-700 flex items-center justify-center">
          <Building2 size={18} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="label block mb-1.5">Company</label>
          <input
            className="input"
            placeholder="Acme HVAC Services"
            value={client.company}
            onChange={(e) => update('company', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">Contact name</label>
          <input
            className="input"
            placeholder="John Smith"
            value={client.contact}
            onChange={(e) => update('contact', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">Industry</label>
          <input
            className="input"
            placeholder="Plumbing, HVAC, Electrical…"
            value={client.industry}
            onChange={(e) => update('industry', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">Email</label>
          <input
            className="input"
            type="email"
            placeholder="john@acmehvac.com"
            value={client.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">Phone</label>
          <input
            className="input"
            placeholder="(555) 555-5555"
            value={client.phone}
            onChange={(e) => update('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">Website</label>
          <input
            className="input"
            placeholder="acmehvac.com"
            value={client.website}
            onChange={(e) => update('website', e.target.value)}
          />
        </div>
        <div>
          <label className="label block mb-1.5">City / Market</label>
          <input
            className="input"
            placeholder="Orlando, FL"
            value={client.city}
            onChange={(e) => update('city', e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="label block mb-1.5">Notes (internal)</label>
          <textarea
            className="input min-h-[64px] resize-y"
            placeholder="Competitive context, unique deliverables…"
            value={client.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <button
            onClick={() => update('hasWordPressBricks', !client.hasWordPressBricks)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition ${
              client.hasWordPressBricks
                ? 'bg-slp-50 border-slp-200'
                : 'bg-white border-ink-200 hover:border-ink-300'
            }`}
          >
            <div
              className={`shrink-0 mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center ${
                client.hasWordPressBricks
                  ? 'bg-slp-500 border-slp-500'
                  : 'bg-white border-ink-300'
              }`}
            >
              {client.hasWordPressBricks && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 6l2.5 2.5L9.5 3.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-900 flex items-center gap-1.5">
                <ShieldAlert
                  size={13}
                  className={
                    client.hasWordPressBricks ? 'text-slp-600' : 'text-ink-400'
                  }
                />
                Client runs WordPress with Bricks or Elementor
              </div>
              <div className="text-[11px] text-ink-500 mt-0.5 leading-snug">
                Checking this removes the mandatory Astro rebuild, but we'll
                still recommend it — it materially outperforms WP for SEO.
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
