export function Logo({
  className = '',
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  const dark = inverted ? '#ffffff' : '#0e0e12';
  const red = '#cf312b';
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-9 w-9"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="40" height="40" rx="9" fill={inverted ? '#ffffff' : '#0e0e12'} />
        <text
          x="10"
          y="26"
          fontFamily='"DM Sans", Inter, system-ui, sans-serif'
          fontSize="18"
          fontWeight="800"
          fill={inverted ? '#0e0e12' : '#ffffff'}
        >
          S
        </text>
        <text
          x="22"
          y="26"
          fontFamily='"DM Sans", Inter, system-ui, sans-serif'
          fontSize="18"
          fontWeight="800"
          fill={red}
        >
          L
        </text>
        <rect x="6" y="30" width="28" height="2.5" rx="1.25" fill={red} />
      </svg>
      <div className="leading-tight">
        <div
          className="font-display font-extrabold tracking-tight text-[16px]"
          style={{ color: dark }}
        >
          ServiceLine<span style={{ color: red }}>Pro</span>
        </div>
        <div
          className="text-[10px] uppercase tracking-[0.18em] font-bold"
          style={{ color: inverted ? '#adadb5' : '#7c7c85' }}
        >
          Sales Dashboard
        </div>
      </div>
    </div>
  );
}
