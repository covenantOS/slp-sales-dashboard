interface Env {
  DB: D1Database;
}

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });

const makeId = () => {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    `SELECT id, company, contact, rep_name, rep_email, monthly, setup,
            contract_value, day_one_cash, commission, updated_at
       FROM quotes ORDER BY updated_at DESC LIMIT 200`,
  ).all();
  return json({ quotes: results });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body = (await request.json()) as { quote: any; totals: any };
  const { quote, totals } = body;
  if (!quote) return json({ error: 'missing quote' }, { status: 400 });
  const id = makeId();
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO quotes
      (id, company, contact, rep_name, rep_email,
       monthly, setup, contract_value, day_one_cash, commission,
       payload, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  )
    .bind(
      id,
      quote.client?.company || '',
      quote.client?.contact || '',
      quote.rep?.name || '',
      quote.rep?.email || '',
      totals?.monthly || 0,
      totals?.setup || 0,
      totals?.contractValue || 0,
      totals?.dayOneCash || 0,
      totals?.totalCommissionFirstYear || 0,
      JSON.stringify(quote),
      now,
      now,
    )
    .run();
  return json({ id, created_at: now });
};
