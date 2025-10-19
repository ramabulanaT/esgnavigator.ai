export const config = { runtime: 'edge' };

async function tryFetch(url, init) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, init);
    const ms = Date.now() - t0;
    return { ok: res.ok, status: res.status, ms, headers: Object.fromEntries(res.headers.entries()) };
  } catch (e) {
    return { ok: false, status: 0, ms: Date.now() - t0, error: String(e) };
  }
}

export default async function handler(req) {
  const webOrigin = new URL(req.url).origin;
  const apiEnv = (process.env.NEXT_PUBLIC_API_URL || '').trim().replace(/\/$/, '');
  const api = apiEnv || '';
  const result = {
    ok: false,
    web: { origin: webOrigin, ts: new Date().toISOString(), env: process.env.NODE_ENV || 'production' },
    api: { base: api, health: [], chosen: null, cors: null }
  };

  if (!api) {
    return new Response(JSON.stringify({ ...result, ok: false, reason: 'API_URL_NOT_SET' }), {
      headers: { 'content-type': 'application/json; charset=utf-8' }, status: 200
    });
  }

  // probe common health paths
  const paths = ['/health', '/api/health', '/v1/health', '/'];
  for (const p of paths) {
    const r = await tryFetch(api + p, { cache: 'no-store' });
    result.api.health.push({ path: p, ...r });
    if (!result.api.chosen && r.ok) result.api.chosen = p;
  }

  // CORS preflight (OPTIONS /health)
  const pre = await tryFetch(api + '/health', {
    method: 'OPTIONS',
    headers: {
      'Origin': webOrigin,
      'Access-Control-Request-Method': 'GET'
    }
  });
  const allow = pre.headers?.['access-control-allow-origin'] || null;
  result.api.cors = { allowOrigin: allow, preflight: pre };

  // overall ok if any health is 200 and CORS allows either * or web origin
  const healthOK = result.api.health.some(h => h.ok);
  const corsOK = !!allow && (allow === '*' || allow.includes(webOrigin));
  result.ok = healthOK && corsOK;

  return new Response(JSON.stringify(result, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  });
}
