/* Ping API /health to avoid cold starts; derives base from Edge status */
const WEB_ALIAS = process.env.WEB_ALIAS || 'esgnavigator-ai.vercel.app';
const WEB = `https://${WEB_ALIAS}`;

const getJSON = async (url) => {
  const r = await fetch(url, { cache:'no-store' });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
};

(async () => {
  const status = await getJSON(`${WEB}/api/internal/status`);
  const api = (status?.api?.base || '').toString().trim().replace(/\/$/,'');
  if (!api.startsWith('http')) {
    console.log('No API base set; skip keepalive.'); process.exit(0);
  }
  const u = `${api}/health`;
  const r = await fetch(u, { cache:'no-store' });
  console.log(`Keepalive ${u} -> ${r.status}`);
  if (!r.ok) process.exit(1);
})().catch(e => { console.error(e.message); process.exit(2); });
