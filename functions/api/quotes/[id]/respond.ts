interface Env {
  DB: D1Database;
}

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });

export const onRequestPost: PagesFunction<Env> = async ({
  params,
  env,
  request,
}) => {
  const id = params.id as string;
  const body = await request.json();
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO responses (id, quote_id, payload, created_at)
     VALUES (?, ?, ?, ?)`,
  )
    .bind(crypto.randomUUID(), id, JSON.stringify(body), now)
    .run();
  return json({ ok: true });
};

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const id = params.id as string;
  const { results } = await env.DB.prepare(
    `SELECT id, payload, created_at FROM responses WHERE quote_id = ? ORDER BY created_at DESC`,
  )
    .bind(id)
    .all();
  return json({ responses: results });
};
