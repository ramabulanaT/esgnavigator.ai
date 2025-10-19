const BASE_URL = process.env.BASE_URL || 'https://www.esgnavigator.ai';
const TIMEOUT_MS = Number.parseInt(process.env.TIMEOUT_MS || '10000', 10);
const STRICT_REDIRECT = (process.env.STRICT_REDIRECT ?? 'true').toLowerCase() === 'true';
const paths = { proxyHealth: '/api/proxy/api/healthz', uptime: '/api/internal/uptime', uptimeJs: '/api/internal/uptime.js' };
const ok = (m)=>console.log(`OK  ${m}`); const ko=(m)=>console.error(`FAIL ${m}`); const info=(m)=>console.log(`INFO ${m}`);
const join=(b,p)=> (b.endsWith('/')?b.slice(0,-1):b)+p;
const withTimeout=(fn,ms,lab)=>{const ac=new AbortController();const t=setTimeout(()=>ac.abort(),ms);return fn(ac.signal).finally(()=>clearTimeout(t));}
const rawGet=(url,{follow='manual'}={})=> withTimeout(s=>fetch(url,{redirect:follow,signal:s}), TIMEOUT_MS, `GET ${url}`);
async function getJson(url){const r=await rawGet(url,{follow:'manual'});const ct=(r.headers.get('content-type')||'').toLowerCase(); if(!ct.startsWith('application/json')) throw new Error(`content-type '${ct}'`); return { r, body: await r.json()};}
async function checkProxyHealth(){const u=join(BASE_URL,paths.proxyHealth); const {r,body}=await getJson(u); if(r.status!==200) throw new Error(`healthz status ${r.status}`); if(!body?.ok) throw new Error('healthz ok!=true'); ok(`proxy healthz: 200 JSON ok=true (${u})`);}
async function checkUptime(){const u=join(BASE_URL,paths.uptime); const {r,body}=await getJson(u); if(r.status!==200) throw new Error(`uptime status ${r.status}`); if(!body?.ok) throw new Error('uptime ok!=true'); ok(`uptime: 200 JSON ok=true (${u})`);}
async function checkUptimeRedirect(){const u=join(BASE_URL,paths.uptimeJs); const r=await rawGet(u,{follow:'manual'}); if(!STRICT_REDIRECT && r.status===200){info(`uptime.js 200 allowed`); return;} const codes=new Set([301,302,307,308]); if(!codes.has(r.status)) throw new Error(`uptime.js expected 30x, got ${r.status}`); const loc=r.headers.get('location')||''; const canon=join(BASE_URL,paths.uptime); if(!(loc===canon || loc===paths.uptime)) throw new Error(`Location '${loc}'`); ok(`uptime.js redirect: ${r.status} -> ${loc}`);}
(async()=>{let f=false; try{await checkProxyHealth();}catch(e){f=true;ko(e.message);} try{await checkUptime();}catch(e){f=true;ko(e.message);} try{await checkUptimeRedirect();}catch(e){f=true;ko(e.message);} process.exitCode=f?1:0; if(!f) console.log('E2E smoke: all green ✅');})();
