import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
function Overlay() {
  const [apiUrl, setApiUrl] = useState('');
  const [status, setStatus] = useState('checking'); // ok | fail | checking
  const color = status==='ok' ? '#16a34a' : status==='fail' ? '#dc2626' : '#6b7280';
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const up = await fetch('/api/internal/uptime', { cache: 'no-store' }).then(r => r.json());
        const url = String(up?.apiUrl || '').trim();
        if (!alive) return;
        setApiUrl(url);
        if (!url || !/^https?:\/\//.test(url)) { setStatus('fail'); return; }
        const paths = ['/health','/api/health','/v1/health','/'];
        let ok = false;
        for (const p of paths) {
          const res = await fetch(url.replace(/\/$/,'') + p, { method: 'GET' }).catch(() => null);
          if (res && res.ok) { ok = true; break; }
        }
        if (!alive) return;
        setStatus(ok ? 'ok' : 'fail');
      } catch { if (!alive) return; setStatus('fail'); }
    })();
    return () => { alive = false; };
  }, []);
  const border = `1px solid ${status==='ok' ? '#bbf7d0' : status==='fail' ? '#fecaca' : '#e5e7eb'}`;
  return (
    <div style={{position:'fixed', right:12, bottom:12, zIndex:99999, background:'#fff', border, borderRadius:12, padding:'10px 12px', boxShadow:'0 8px 30px rgba(0,0,0,.10)', font:'12px/1.4 ui-sans-serif,system-ui'}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{display:'inline-block',width:10,height:10,borderRadius:'50%',background:color}}/>
        <strong>Live Health</strong>
      </div>
      <div style={{marginTop:6, maxWidth:280, wordBreak:'break-word'}}>
        <div>API: {apiUrl || <em>not set</em>}</div>
        <div>Status: <b style={{color}}>{status}</b></div>
      </div>
      <div style={{marginTop:6,display:'flex',gap:8}}>
        <a href="/api/internal/uptime" target="_blank" rel="noreferrer">uptime</a>
        {apiUrl ? <a href={apiUrl} target="_blank" rel="noreferrer">api</a> : null}
      </div>
    </div>
  );
}
export function mountHealthOverlay() {
  if (typeof document === 'undefined') return;
  if (document.getElementById('esg-health-overlay')) return;
  const el = document.createElement('div'); el.id = 'esg-health-overlay'; document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<Overlay />);
}
