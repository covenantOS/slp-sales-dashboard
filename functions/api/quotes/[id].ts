interface Env {
  DB: D1Database;
}

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  const row = await env.DB.prepare(
    `SELECT payload, created_at, updated_at FROM quotes WHERE id = ?`,
  )
    .bind(id)
    .first<{ payload: string; created_at: string; updated_at: string }>();
  if (!row) return json({ error: 'not found' }, { status: 404 });
  return json({
    quote: JSON.parse(row.payload),
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
};

export const onRequestPut: PagesFunction<Env> = async ({
  params,
  env,
  request,
}) => {
  const id = params.id as string;
  const body = (await request.json()) as { quote: any; totals: any };
  const { quote, totals } = body;
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `UPDATE quotes SET
       company = ?, contact = ?, rep_name = ?, rep_email = ?,
       monthly = ?, setup = ?, contract_value = ?, day_one_cash = ?,
       commission = ?, payload = ?, updated_at = ?
     WHERE id = ?`,
  )
    .bind(
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
      id,
    )
    .run();
  if (result.meta.changes === 0)
    return json({ error: 'not found' }, { status: 404 });
  return json({ id, updated_at: now });
};

export const onRequestDelete: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  await env.DB.prepare(`DELETE FROM quotes WHERE id = ?`).bind(id).run();
  return json({ ok: true });
};
