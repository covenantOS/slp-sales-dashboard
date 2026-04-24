import { useEffect, useMemo, useState } from 'react';
import { Logo } from './components/Logo';
import { RepPanel } from './components/RepPanel';
import { ClientPanel } from './components/ClientPanel';
import { ProductList } from './components/ProductList';
import { TotalsSummary } from './components/TotalsSummary';
import { Toolbar } from './components/Toolbar';
import { LoadDialog } from './components/LoadDialog';
import { RulesBanner } from './components/RulesBanner';
import { ClientProposal } from './components/ClientProposal';
import { blankQuote, computeTotals } from './lib/calc';
import { evaluateRules } from './lib/rules';
import type { LineItem, ProductKey, QuoteState } from './types';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'slp_quote_draft_v2';

const loadDraft = (): QuoteState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return blankQuote();
    const parsed = JSON.parse(raw);
    const base = blankQuote();
    return {
      ...base,
      ...parsed,
      rep: { ...base.rep, ...(parsed.rep || {}) },
      client: { ...base.client, ...(parsed.client || {}) },
      items: { ...base.items, ...(parsed.items || {}) },
    };
  } catch {
    return blankQuote();
  }
};

export default function App() {
  // Path-based routing — /p/:id is the client-facing proposal view
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const proposalMatch = path.match(/^\/p\/([a-z0-9]+)\/?$/i);

  if (proposalMatch) {
    return <ClientProposal id={proposalMatch[1]} />;
  }

  return <Dashboard />;
}

function Dashboard() {
  const [quote, setQuote] = useState<QuoteState>(loadDraft);
  const [loadOpen, setLoadOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quote));
  }, [quote]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('q');
    if (id) {
      fetch(`/api/quotes/${id}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.quote) {
            setQuote({ ...d.quote, id });
            showToast('Loaded quote');
          }
        })
        .catch(() => {});
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const totals = useMemo(() => computeTotals(quote), [quote]);
  const totalsByKey = useMemo(() => {
    const m = new Map();
    totals.lines.forEach((l) => m.set(l.key, l));
    return m;
  }, [totals]);

  const updateItem = (key: ProductKey, partial: Partial<LineItem>) => {
    setQuote((q) => ({
      ...q,
      items: { ...q.items, [key]: { ...q.items[key], ...partial } },
    }));
  };

  const rules = useMemo(
    () =>
      evaluateRules(quote, {
        setWordPressOverride: (on) =>
          setQuote((q) => ({
            ...q,
            client: { ...q.client, hasWordPressBricks: on },
          })),
        toggleItem: updateItem,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quote],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        quote.id ? `/api/quotes/${quote.id}` : '/api/quotes',
        {
          method: quote.id ? 'PUT' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ quote, totals }),
        },
      );
      const data = await res.json();
      if (data?.id) {
        setQuote((q) => ({ ...q, id: data.id }));
      }
      setLastSavedAt(new Date().toLocaleTimeString());
      showToast(quote.id ? 'Quote updated' : 'Quote saved');
    } catch {
      showToast('Save failed — check connection');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Reset quote and start fresh?')) return;
    setQuote(blankQuote());
    localStorage.removeItem(STORAGE_KEY);
    window.history.replaceState(null, '', window.location.pathname);
    showToast('Quote reset');
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify({ quote, totals }, null, 2)], {
      type: 'application/json',
    });
    triggerDownload(
      blob,
      `slp-quote-${quote.client.company || 'untitled'}-${Date.now()}.json`,
    );
  };

  const handleOpenProposal = async () => {
    let id = quote.id;
    if (!id) {
      await handleSave();
      id = quote.id;
    }
    if (id) {
      window.open(`/p/${id}`, '_blank');
    } else {
      showToast('Save first to open proposal');
    }
  };

  const handleCopyLink = async () => {
    if (!quote.id) {
      showToast('Save first to copy link');
      return;
    }
    const url = `${window.location.origin}/p/${quote.id}`;
    await navigator.clipboard.writeText(url);
    showToast('Client link copied');
  };

  const handleLoadQuote = async (id: string) => {
    const res = await fetch(`/api/quotes/${id}`);
    if (!res.ok) return showToast('Could not load');
    const data = await res.json();
    if (data?.quote) {
      setQuote({ ...data.quote, id });
      window.history.replaceState(null, '', `?q=${id}`);
      showToast('Loaded quote');
    }
  };

  const handleDeleteQuote = async (id: string) => {
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    if (quote.id === id) {
      setQuote(blankQuote());
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-ink-100">
        <div className="max-w-[1440px] mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Logo />
          <Toolbar
            onSave={handleSave}
            onReset={handleReset}
            onLoad={() => setLoadOpen(true)}
            onExportJSON={handleExportJSON}
            onOpenProposal={handleOpenProposal}
            onCopyLink={handleCopyLink}
            saving={saving}
            lastSavedAt={lastSavedAt}
            quoteId={quote.id}
          />
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 pt-8 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip bg-slp-50 text-slp-700">
            <Sparkles size={11} /> 2026 Pricing
          </span>
          <span className="chip bg-ink-100 text-ink-600">
            Smart rules · Auto-saved
          </span>
          {lastSavedAt && (
            <span className="chip bg-white border border-ink-200 text-ink-500">
              Saved {lastSavedAt}
            </span>
          )}
          {quote.id && (
            <span className="chip bg-ink-900 text-white">
              ID · {quote.id}
            </span>
          )}
        </div>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900">
          Build a quote.{' '}
          <span className="text-slp-500">See your commission in real time.</span>
        </h1>
      </div>

      <main className="max-w-[1440px] mx-auto px-5 pb-24 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-4">
          <RepPanel
            rep={quote.rep}
            onChange={(rep) => setQuote((q) => ({ ...q, rep }))}
          />
          <ClientPanel
            client={quote.client}
            onChange={(client) => setQuote((q) => ({ ...q, client }))}
          />
        </div>

        <div className="col-span-12 lg:col-span-8 xl:col-span-6 space-y-4">
          <RulesBanner rules={rules} />
          <ProductList
            quote={quote}
            totalsByKey={totalsByKey}
            onItemChange={updateItem}
          />
        </div>

        <div className="col-span-12 xl:col-span-3">
          <TotalsSummary totals={totals} quote={quote} />
        </div>
      </main>

      <LoadDialog
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
        onLoad={handleLoadQuote}
        onDelete={handleDeleteQuote}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-ink-900 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-soft">
          {toast}
        </div>
      )}
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
