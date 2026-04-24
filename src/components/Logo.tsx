export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 shadow-glow">
        <svg
          viewBox="0 0 28 28"
          className="h-5 w-5 text-brand-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 18 L10 12 L14 16 L24 6" />
          <path d="M18 6 L24 6 L24 12" />
          <circle cx="10" cy="12" r="1.2" fill="currentColor" />
          <circle cx="14" cy="16" r="1.2" fill="currentColor" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="font-display font-bold text-ink-900 text-[15px] tracking-tight">
          ServiceLine<span className="text-brand-500">Pro</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-ink-400 font-semibold">
          Sales Dashboard
        </div>
      </div>
    </div>
  );
}
