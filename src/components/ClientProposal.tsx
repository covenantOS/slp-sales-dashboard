import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronRight,
  Mail,
  Phone,
  Sparkles,
  Tv,
  Zap,
  Award,
  Target,
  Globe,
  Search,
  Rocket,
  Loader2,
} from 'lucide-react';
import { Logo } from './Logo';
import { PRODUCTS } from '../data/products';
import type { QuoteState, ProductKey, LineTotals } from '../types';
import { computeTotals, fmt } from '../lib/calc';

interface Props {
  id: string;
}

const CATEGORY_INFO: Record<
  string,
  { icon: React.ReactNode; title: string; tagline: string }
> = {
  local_seo: {
    icon: <Target size={20} />,
    title: 'Local SEO',
    tagline: 'Dominate the map pack in your service area.',
  },
  addon: {
    icon: <Search size={20} />,
    title: 'On-Site SEO',
    tagline: 'Technical and content optimization that compounds.',
  },
  web: {
    icon: <Globe size={20} />,
    title: 'Web',
    tagline: 'Astro-stack build tuned for ranking and conversion.',
  },
  paid_media: {
    icon: <Tv size={20} />,
    title: 'Paid Media',
    tagline: 'Spectrum partnership — $0 agency fee at $5K+/mo.',
  },
};

export function ClientProposal({ id }: Props) {
  const [quote, setQuote] = useState<QuoteState | null>(null);
  const [loading, setLoading] = useState(true);
  const [interestedIn, setInterestedIn] = useState<Record<ProductKey, boolean>>(
    {} as Record<ProductKey, boolean>,
  );
  const [customAdSpend, setCustomAdSpend] = useState<
    Record<ProductKey, number>
  >({} as Record<ProductKey, number>);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [clientMsg, setClientMsg] = useState('');

  useEffect(() => {
    fetch(`/api/quotes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.quote) {
          setQuote(d.quote);
          const interested: Record<string, boolean> = {};
          const adSpends: Record<string, number> = {};
          (Object.keys(d.quote.items) as ProductKey[]).forEach((k) => {
            if (d.quote.items[k]?.included) {
              interested[k] = true;
              const p = PRODUCTS[k];
              if (p?.isAdSpend) {
                adSpends[k] =
                  d.quote.items[k]?.monthlyOverride ?? p.monthly;
              }
            }
          });
          setInterestedIn(interested as Record<ProductKey, boolean>);
          setCustomAdSpend(adSpends as Record<ProductKey, number>);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Client-side re-computation reflecting their own tweaks.
  const previewQuote = useMemo<QuoteState | null>(() => {
    if (!quote) return null;
    const next: QuoteState = JSON.parse(JSON.stringify(quote));
    (Object.keys(next.items) as ProductKey[]).forEach((k) => {
      const selected = !!interestedIn[k];
      next.items[k].included = selected;
      const p = PRODUCTS[k];
      if (p?.isAdSpend && customAdSpend[k] !== undefined) {
        next.items[k].monthlyOverride = customAdSpend[k];
      }
    });
    return next;
  }, [quote, interestedIn, customAdSpend]);

  const previewTotals = useMemo(
    () => (previewQuote ? computeTotals(previewQuote) : null),
    [previewQuote],
  );

  const sendToRep = async () => {
    if (!quote) return;
    setSending(true);
    try {
      await fetch(`/api/quotes/${id}/respond`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          interestedIn,
          customAdSpend,
          message: clientMsg,
        }),
      });
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <Loader2 className="animate-spin text-slp-500" size={32} />
      </div>
    );
  }

  if (!quote || !previewTotals || !previewQuote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
        <div className="card p-10 text-center max-w-md">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="font-display font-bold text-2xl">Proposal not found</h2>
          <p className="text-ink-500 mt-2 text-sm">
            The link may have expired. Ask your ServiceLinePro rep for a fresh
            one.
          </p>
        </div>
      </div>
    );
  }

  const included = previewTotals.lines.filter((l) => l.included);
  const months = previewQuote.rep.commitmentMonths || 12;
  const grouped = included.reduce<Record<string, typeof included>>((acc, l) => {
    const cat = PRODUCTS[l.key].category;
    (acc[cat] ||= []).push(l);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-ink-50">
      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-900 to-ink-950 text-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-slp-500/40 blur-3xl" />
          <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-slp-700/30 blur-3xl" />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 pt-6">
          <div className="flex items-center justify-between">
            <Logo inverted />
            <div className="text-xs text-ink-300 text-right">
              Prepared for
              <div className="text-white font-semibold text-sm">
                {quote.client.company || 'your team'}
              </div>
            </div>
          </div>
          <div className="mt-16 pb-16 max-w-[780px]">
            <div className="flex items-center gap-2 mb-4">
              <span className="chip bg-white/10 text-white border border-white/15">
                <Sparkles size={11} /> Custom Growth Proposal
              </span>
              <span className="chip bg-slp-500/25 text-slp-100 border border-slp-400/30">
                Valid 30 days
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-display font-extrabold leading-[1.05] tracking-tight">
              Grow{' '}
              <span className="text-slp-400">
                {quote.client.company || 'your business'}
              </span>{' '}
              with a predictable local engine.
            </h1>
            <p className="text-ink-300 text-lg mt-5 max-w-[640px] leading-relaxed">
              {quote.rep.name ? `${quote.rep.name} put this together` : 'We put this together'} for{' '}
              {quote.client.city ? `${quote.client.city}` : 'your market'} based
              on what we've seen work for {quote.client.industry || 'businesses like yours'}. Tweak what you want below — nothing is locked.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 max-w-[680px]">
              <HeroStat
                label="Monthly investment"
                value={fmt(previewTotals.monthly)}
              />
              <HeroStat
                label="Day-1 to launch"
                value={fmt(previewTotals.dayOneCash)}
              />
              <HeroStat
                label={`${months}-month value`}
                value={fmt(previewTotals.contractValue)}
                accent
              />
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <main className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-10">
          <Section
            eyebrow="What's in scope"
            title="Your growth stack"
            sub="Tap to add or remove anything. Your rep sees exactly what you picked."
          />

          {Object.entries(grouped).map(([cat, lines]) => {
            const info = CATEGORY_INFO[cat];
            return (
              <section key={cat} className="space-y-3">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-xl bg-slp-500 text-white flex items-center justify-center">
                    {info?.icon}
                  </div>
                  <div>
                    <div className="font-display font-bold text-ink-900 text-lg">
                      {info?.title}
                    </div>
                    <div className="text-xs text-ink-500">{info?.tagline}</div>
                  </div>
                </div>
                {lines.map((l) => (
                  <ProposalCard
                    key={l.key}
                    line={l}
                    interested={!!interestedIn[l.key]}
                    onToggle={() =>
                      setInterestedIn((s) => ({ ...s, [l.key]: !s[l.key] }))
                    }
                    adSpend={customAdSpend[l.key]}
                    onAdSpendChange={(v) =>
                      setCustomAdSpend((s) => ({ ...s, [l.key]: v }))
                    }
                  />
                ))}
              </section>
            );
          })}

          {/* Why this approach */}
          <section className="rounded-3xl bg-white border border-ink-100 p-8 shadow-card mt-12">
            <div className="flex items-center gap-2 mb-4">
              <Award size={16} className="text-slp-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slp-600">
                Why ServiceLinePro
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl text-ink-900 tracking-tight">
              Built for service businesses. Not a general agency.
            </h3>
            <div className="grid sm:grid-cols-2 gap-5 mt-6">
              <Pillar
                icon={<Target size={16} />}
                title="Pay-per-rank Local SEO"
                body="12-month roadmap with GBP signal stacking, citations, link building, and monthly CTR campaigns — priced the same whether you're in the top 3 or the top 30."
              />
              <Pillar
                icon={<Tv size={16} />}
                title="Spectrum partnership"
                body="$0 agency fee on Google Ads and OTT at $5K+/mo. Free video production for Central FL. You keep the margin."
              />
              <Pillar
                icon={<Rocket size={16} />}
                title="Astro web stack"
                body="Fastest-indexing stack on the market. Core Web Vitals pass automatically. Your SEO compounds faster when the site is actually built for it."
              />
              <Pillar
                icon={<Zap size={16} />}
                title="Free 10-day proof trial"
                body="We'll run a CTR boost on your Google Business Profile for 10 days so you see the map-pack lift before signing anything."
              />
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-3xl bg-ink-900 text-white p-6 shadow-soft relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-slp-500/30 blur-3xl" />
              <div className="relative">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-400">
                  Your customized plan
                </div>
                <div className="mt-1 text-4xl font-display font-extrabold num">
                  {fmt(previewTotals.monthly)}
                  <span className="text-ink-400 text-lg font-bold">/mo</span>
                </div>
                <div className="text-sm text-ink-400 mt-2">
                  {fmt(previewTotals.dayOneCash)} to launch · {fmt(previewTotals.contractValue)} over {months} months
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="space-y-2">
                  {included.length === 0 && (
                    <div className="text-sm text-ink-400">
                      Select at least one service to see pricing.
                    </div>
                  )}
                  {included.map((l) => (
                    <div
                      key={l.key}
                      className={`flex justify-between items-center text-xs transition ${
                        interestedIn[l.key]
                          ? 'text-white'
                          : 'text-ink-500 line-through'
                      }`}
                    >
                      <span className="truncate pr-2">{l.name}</span>
                      <span className="num font-semibold shrink-0">
                        {l.monthlyAfterDiscount > 0
                          ? `${fmt(l.monthlyAfterDiscount)}/mo`
                          : fmt(l.setupAfterDiscount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact rep */}
            <div className="rounded-3xl bg-white border border-ink-100 p-6 shadow-card">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500">
                Your ServiceLinePro rep
              </div>
              <div className="mt-2 font-display font-bold text-ink-900 text-xl">
                {quote.rep.name || 'Your rep'}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {quote.rep.email && (
                  <a
                    href={`mailto:${quote.rep.email}?subject=${encodeURIComponent('Re: ' + (quote.client.company || 'Proposal'))}`}
                    className="flex items-center gap-2 text-ink-700 hover:text-slp-600 transition"
                  >
                    <Mail size={14} /> {quote.rep.email}
                  </a>
                )}
                {quote.client.phone && (
                  <a
                    href={`tel:${quote.rep.email}`}
                    className="flex items-center gap-2 text-ink-700 hover:text-slp-600 transition"
                  >
                    <Phone size={14} /> Call your rep
                  </a>
                )}
              </div>
              <div className="mt-5 space-y-2">
                <label className="label block">
                  Questions or requests
                </label>
                <textarea
                  className="input min-h-[84px] resize-y"
                  placeholder="Anything you'd like to adjust, ask, or flag…"
                  value={clientMsg}
                  onChange={(e) => setClientMsg(e.target.value)}
                />
                {sent ? (
                  <div className="rounded-xl bg-slp-50 border border-slp-200 p-3 text-sm text-slp-800 flex items-center gap-2">
                    <Check size={16} className="text-slp-600" />
                    Sent to {quote.rep.name || 'your rep'} — expect a reply shortly.
                  </div>
                ) : (
                  <button
                    onClick={sendToRep}
                    disabled={sending}
                    className="btn-red w-full"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Sending…
                      </>
                    ) : (
                      <>
                        <ChevronRight size={15} /> Send my picks to my rep
                      </>
                    )}
                  </button>
                )}
                <div className="text-[11px] text-ink-400 text-center">
                  Nothing signs or charges here. Your rep takes it from this point.
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-ink-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-400">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div>
            servicelinepro.com · 2026 pricing · valid 30 days from issue
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border ${
        accent
          ? 'bg-slp-500/15 border-slp-400/40'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div
        className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
          accent ? 'text-slp-200' : 'text-ink-300'
        }`}
      >
        {label}
      </div>
      <div className="text-2xl font-display font-extrabold num mt-1">{value}</div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slp-600 mb-2">
        {eyebrow}
      </div>
      <h2 className="font-display font-extrabold text-ink-900 text-3xl tracking-tight">
        {title}
      </h2>
      <p className="text-ink-500 mt-1">{sub}</p>
    </div>
  );
}

function Pillar({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-slp-600">{icon}</span>
        <span className="font-semibold text-ink-900 text-sm">{title}</span>
      </div>
      <p className="text-xs text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function ProposalCard({
  line,
  interested,
  onToggle,
  adSpend,
  onAdSpendChange,
}: {
  line: LineTotals;
  interested: boolean;
  onToggle: () => void;
  adSpend?: number;
  onAdSpendChange: (v: number) => void;
}) {
  const p = PRODUCTS[line.key];
  return (
    <div
      className={`rounded-2xl border-2 transition-all overflow-hidden ${
        interested
          ? 'border-slp-400 bg-white shadow-red'
          : 'border-ink-100 bg-white opacity-75'
      }`}
    >
      <div className="p-5 flex items-start gap-4">
        <button
          onClick={onToggle}
          className={`shrink-0 mt-0.5 h-7 w-7 rounded-lg border-2 transition flex items-center justify-center ${
            interested
              ? 'bg-slp-500 border-slp-500 text-white'
              : 'bg-white border-ink-300 hover:border-slp-400 text-transparent'
          }`}
        >
          {interested && <Check size={16} strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-display font-bold text-ink-900 text-base">
                  {p.name}
                </h4>
                {p.spectrumPartnership && (
                  <span className="chip bg-slp-50 text-slp-700">
                    <Tv size={10} /> Spectrum
                  </span>
                )}
                {p.isOneTime && (
                  <span className="chip bg-ink-100 text-ink-600">
                    One-time
                  </span>
                )}
                {p.finiteMonths && (
                  <span className="chip bg-ink-100 text-ink-600">
                    {p.finiteMonths}-mo term
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-500 mt-1.5 leading-relaxed">
                {p.description}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {line.setupAfterDiscount > 0 && (
                <div className="text-[11px] uppercase tracking-wide text-ink-400 font-bold">
                  Setup{' '}
                  <span className="text-ink-900 font-extrabold">
                    {fmt(line.setupAfterDiscount)}
                  </span>
                </div>
              )}
              {line.monthlyAfterDiscount > 0 && (
                <div className="text-[11px] uppercase tracking-wide text-ink-400 font-bold">
                  <span className="text-ink-900 font-extrabold text-lg">
                    {fmt(line.monthlyAfterDiscount)}
                  </span>
                  <span className="text-ink-400">/mo</span>
                </div>
              )}
            </div>
          </div>

          {interested && p.isAdSpend && (
            <div className="mt-4 rounded-xl bg-ink-50 border border-ink-100 p-3">
              <label className="label block mb-2">
                Adjust your monthly ad spend
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={p.minAdSpend || 5000}
                  max={50000}
                  step={500}
                  value={adSpend ?? p.monthly}
                  onChange={(e) =>
                    onAdSpendChange(parseInt(e.target.value) || 0)
                  }
                  className="flex-1 accent-slp-500"
                />
                <div className="w-28 text-right">
                  <div className="text-lg font-display font-extrabold text-ink-900 num">
                    {fmt(adSpend ?? p.monthly)}
                  </div>
                  <div className="text-[10px] text-ink-400">/mo budget</div>
                </div>
              </div>
              <div className="text-[11px] text-ink-400 mt-1">
                Minimum {fmt(p.minAdSpend || 5000)} to keep the $0 fee benefit.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
