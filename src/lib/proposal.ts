import type { QuoteState, Totals } from '../types';
import { fmt } from './calc';

export const buildProposalHTML = (q: QuoteState, t: Totals): string => {
  const lines = t.lines.filter((l) => l.included);
  const rows = lines
    .map(
      (l) => `
        <tr>
          <td>${l.name}</td>
          <td class="num">${l.setupAfterDiscount ? fmt(l.setupAfterDiscount) : '—'}</td>
          <td class="num">${l.monthlyAfterDiscount ? fmt(l.monthlyAfterDiscount) + '/mo' : '—'}</td>
          <td class="num strong">${fmt(l.contractTotal)}</td>
        </tr>
      `,
    )
    .join('');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Proposal · ${q.client.company || 'ServiceLinePro'}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Inter', system-ui, sans-serif;
    color: #0b1220;
    margin: 0;
    background: #f5f7fa;
    padding: 40px 24px;
  }
  .page {
    max-width: 800px; margin: 0 auto; background: #fff;
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 10px 40px -12px rgba(11,18,32,.2);
  }
  .hero {
    background: linear-gradient(135deg, #0b1220, #1e2738);
    color: #fff; padding: 36px 40px;
  }
  .logo {
    font-weight: 800; font-size: 20px; letter-spacing: -.3px;
    margin-bottom: 24px;
  }
  .logo span { color: #4de2a8; }
  h1 {
    font-size: 32px; margin: 0 0 4px; font-weight: 700;
  }
  .sub { color: #9ca8bb; font-size: 14px; }
  .content { padding: 32px 40px 40px; }
  h2 {
    font-size: 12px; letter-spacing: .16em; text-transform: uppercase;
    color: #6b7890; margin: 32px 0 12px; font-weight: 700;
  }
  .meta { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px 24px; font-size: 14px; }
  .meta div span { color: #6b7890; display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 2px; font-weight: 600; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 8px; }
  th, td { padding: 12px 8px; text-align: left; border-bottom: 1px solid #e9edf3; }
  th { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #6b7890; font-weight: 700; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  td.strong { font-weight: 700; }
  .totals {
    margin-top: 24px; padding: 20px;
    background: #f5f7fa; border-radius: 16px;
    display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  }
  .totals .stat { text-align: center; }
  .totals .stat .k { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #6b7890; font-weight: 700; }
  .totals .stat .v { font-size: 22px; font-weight: 800; margin-top: 4px; font-variant-numeric: tabular-nums; }
  .cta { background: #08b175; color: #fff; padding: 20px 24px; border-radius: 16px; margin-top: 24px; font-size: 14px; }
  .cta strong { font-size: 16px; }
  .foot { padding: 20px 40px; font-size: 11px; color: #6b7890; border-top: 1px solid #e9edf3; }
  @media print { body { background: #fff; padding: 0; } .page { box-shadow: none; } }
</style>
</head>
<body>
  <div class="page">
    <div class="hero">
      <div class="logo">ServiceLine<span>Pro</span></div>
      <h1>${q.client.company || 'Your Growth Proposal'}</h1>
      <div class="sub">Prepared by ${q.rep.name || 'ServiceLinePro'} · ${new Date().toLocaleDateString()}</div>
    </div>
    <div class="content">
      <h2>Engagement Details</h2>
      <div class="meta">
        <div><span>Contact</span>${q.client.contact || '—'}</div>
        <div><span>Industry</span>${q.client.industry || '—'}</div>
        <div><span>Market</span>${q.client.city || '—'}</div>
        <div><span>Website</span>${q.client.website || '—'}</div>
      </div>

      <h2>Scope &amp; Investment</h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th class="num">Setup</th>
            <th class="num">Monthly</th>
            <th class="num">${q.rep.commitmentMonths || 12}-Mo Value</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <div class="stat"><div class="k">Day-1 Cash</div><div class="v">${fmt(t.dayOneCash)}</div></div>
        <div class="stat"><div class="k">Monthly</div><div class="v">${fmt(t.monthly)}</div></div>
        <div class="stat"><div class="k">Contract Value</div><div class="v">${fmt(t.contractValue)}</div></div>
      </div>

      ${
        q.client.notes
          ? `<h2>Notes</h2><p style="font-size:14px; line-height:1.55; color:#475269; white-space:pre-wrap">${q.client.notes.replace(/</g, '&lt;')}</p>`
          : ''
      }

      <div class="cta">
        <strong>Ready to grow?</strong><br />
        Setup waiver applies with a ${q.rep.commitmentMonths || 12}-month commitment. Countersign below to activate.
      </div>
    </div>
    <div class="foot">
      ServiceLinePro · 2026 Pricing · All values in USD. Pricing valid 30 days from issue date.
    </div>
  </div>
</body>
</html>`;
};
