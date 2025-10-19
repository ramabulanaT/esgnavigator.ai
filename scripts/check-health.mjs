/* Why: CI gate after deploy; fails if uptime/health/CORS are not OK */
import https from 'node:https';

const WEB_ALIAS = process.env.WEB_ALIAS || 'esgnavigator-ai.vercel.app';
const WEB = `https://${WEB_ALIAS}`;
const API_FROM_ENV = process.env.API_URL || '';

function fetchJson(url, opts={}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({ ...opts, method: opts.method || 'GET', hostname: u.hostname, path: u.pathname + u.search, headers: opts.headers || {} }, res => {
      let data=''; res.on('data', c=>data+=c); res.on('end', ()=> {
        if ((res.statusCode||0) >= 400) return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
        try { resolve({ data: JSON.parse(data||'{}'), res }); } catch(e){ reject(new Error(`Bad JSON from ${url}: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

(async () => {
  console.log('→ uptime');
  const { data: up } = await fetchJson(`${WEB}/api/internal/uptime`);
  const apiUrl = (API_FROM_ENV || up.apiUrl || '').toString().trim().replace(/\/$/,'');
  if (!apiUrl.startsWith('http')) throw new Error('NEXT_PUBLIC_API_URL not set');

  console.log('→ health');
  let ok=false; for (const p of ['/health','/api/health','/v1/health','/']) {
    try { await fetchJson(`${apiUrl}${p}`); ok=true; break; } catch {}
  }
  if (!ok) throw new Error('API health failed');

  console.log('→ cors preflight');
  await new Promise((resolve, reject) => {
    const u = new URL(`${apiUrl}/health`);
    const req = https.request({
      method: 'OPTIONS', hostname: u.hostname, path: u.pathname,
      headers: { 'Origin': WEB, 'Access-Control-Request-Method': 'GET' }
    }, res => {
      const allow = res.headers['access-control-allow-origin'];
      if (allow === '*' || (allow||'').includes(WEB)) return resolve();
      reject(new Error(`CORS bad allow-origin: ${allow}`));
    });
    req.on('error', reject); req.end();
  });

  console.log('✔ all good');
})().catch(err => { console.error('✖', err.message); process.exit(1); });
