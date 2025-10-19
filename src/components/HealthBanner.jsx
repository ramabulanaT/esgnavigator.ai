import React, { useEffect, useState } from 'react';

/** Why: visible only when uptime/health/CORS fail */
const styles = {
  base: { position:'sticky', top:0, zIndex:50, width:'100%', padding:'10px 14px', borderBottom:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:10 },
  red:  { background:'#fef2f2', color:'#991b1b' },
  amber:{ background:'#fffbeb', color:'#92400e' },
  link: { color:'inherit', textDecoration:'underline' },
  close:{ marginLeft:'auto', cursor:'pointer', fontWeight:600 }
};

function decideStatus(s) {
  if (!s) return { show:false };
  const apiSet = !!(s.api?.base);
  const healthOK = Array.isArray(s.api?.health) && s.api.health.some(h => h.ok);
  const allow = s?.api?.cors?.allowOrigin || '';
  const web = s?.web?.origin || '';
  const corsOK = allow === '*' || (!!allow && allow.includes(web));

  if (!apiSet) return { show:true, level:'warn', msg:'API URL is not set on Vercel (NEXT_PUBLIC_API_URL).' };
  if (!healthOK) return { show:true, level:'error', msg:'API health is failing.' };
  if (!corsOK) return { show:true, level:'warn', msg:`CORS not allowing ${web}.` };
  return { show:false };
}

export default function HealthBanner() {
  const [status, setStatus] = useState(null);
  const [hidden, setHidden] = useState(() => sessionStorage.getItem('hb.dismissed') === '1');

  useEffect(() => {
    let live = true;
    const load = async () => {
      try {
        const r = await fetch('/api/internal/status', { cache:'no-store' });
        const j = await r.json();
        if (live) setStatus(j);
      } catch { /* silent */ }
    };
    load();
    const id = setInterval(load, 30000);
    return () => { live = false; clearInterval(id); };
  }, []);

  const state = decideStatus(status);
  if (hidden || !state.show) return null;

  const style = state.level === 'error'
    ? {...styles.base, ...styles.red}
    : {...styles.base, ...styles.amber};

  return (
    <div style={style} role="alert" aria-live="polite">
      <strong>{state.level === 'error' ? 'Attention' : 'Heads up'}</strong>
      <span>{state.msg}</span>
      <span>
        · <a href="/diagnostics.html" style={styles.link}>Diagnostics</a>
        &nbsp;· <a href="/service-map.html" style={styles.link}>Service Map</a>
        &nbsp;· <a href="/api/internal/status" style={styles.link}>Status JSON</a>
      </span>
      <span
        onClick={() => { sessionStorage.setItem('hb.dismissed','1'); setHidden(true); }}
        title="Dismiss"
        style={styles.close}
        aria-label="Dismiss"
      >×</span>
    </div>
  );
}
