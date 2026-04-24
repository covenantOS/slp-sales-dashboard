import { Building2 } from 'lucide-react';
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
        <div className="h-9 w-9 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
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
          <label className="label block mb-1.5">Notes</label>
          <textarea
            className="input min-h-[72px] resize-y"
            placeholder="Internal notes, competitive context, unique deliverables…"
            value={client.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
