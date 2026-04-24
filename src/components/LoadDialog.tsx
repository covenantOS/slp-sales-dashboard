import { useEffect, useState } from 'react';
import { X, Search, Trash2, Clock } from 'lucide-react';
import { fmt } from '../lib/calc';

interface SavedQuote {
  id: string;
  company: string;
  contact: string;
  rep_name: string;
  contract_value: number;
  monthly: number;
  updated_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export function LoadDialog({ open, onClose, onLoad, onDelete }: Props) {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/quotes')
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes || []))
      .catch(() => setQuotes([]))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;
  const filtered = quotes.filter(
    (q) =>
      !query ||
      q.company?.toLowerCase().includes(query.toLowerCase()) ||
      q.rep_name?.toLowerCase().includes(query.toLowerCase()) ||
      q.contact?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-start justify-center p-6 overflow-auto">
      <div className="card w-full max-w-2xl mt-16">
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <div>
            <h3 className="font-display font-bold text-lg text-ink-900">
              Saved Quotes
            </h3>
            <p className="text-xs text-ink-500">
              Load, share, or delete an existing quote.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-lg hover:bg-ink-100 text-ink-400 flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 border-b border-ink-100">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              autoFocus
              className="input pl-9"
              placeholder="Search by company, rep, or contact…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="max-h-[480px] overflow-auto p-2">
          {loading ? (
            <div className="p-6 text-center text-ink-400 text-sm">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-ink-400 text-sm">
              No saved quotes yet.
            </div>
          ) : (
            filtered.map((q) => (
              <div
                key={q.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-ink-50 transition"
              >
                <button
                  onClick={() => {
                    onLoad(q.id);
                    onClose();
                  }}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="font-semibold text-ink-900 text-sm truncate">
                    {q.company || 'Untitled client'}
                  </div>
                  <div className="text-xs text-ink-500 flex items-center gap-2 mt-0.5">
                    <Clock size={11} />
                    {new Date(q.updated_at).toLocaleString()} ·{' '}
                    {q.rep_name || '—'}
                  </div>
                </button>
                <div className="text-right text-xs shrink-0">
                  <div className="font-bold text-ink-900 num">
                    {fmt(q.contract_value || 0)}
                  </div>
                  <div className="text-ink-400 num">
                    {fmt(q.monthly || 0)}/mo
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (!confirm(`Delete quote for ${q.company}?`)) return;
                    await onDelete(q.id);
                    setQuotes((list) => list.filter((x) => x.id !== q.id));
                  }}
                  className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600 text-ink-400 flex items-center justify-center transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
