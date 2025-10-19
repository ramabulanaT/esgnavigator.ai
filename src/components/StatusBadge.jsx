import React, { useEffect, useState } from 'react';

const dot = (color) => ({
  display: 'inline-block', width: 10, height: 10, borderRadius: 9999, background: color, marginRight: 8
});
const box = {
  display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
  border:'1px solid #e5e7eb', borderRadius:12, background:'#fff', flexWrap:'wrap'
};
const link = { textDecoration:'none', color:'#2563eb', fontSize:12 };

export default function StatusBadge() {
  const [state, setState] = useState({ ok:false, api:'', allow:'', ts:'' , loading:true, err:''});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/internal/status', { cache:'no-store' });
        const j = await r.json();
        if (!alive) return;
        const allow = j?.api?.cors?.allowOrigin || '';
        setState({
          ok: !!j?.ok,
          api: (j?.api?.base||'').toString(),
          allow,
          ts: j?.web?.ts || new Date().toISOString(),
          loading:false,
          err:''
        });
      } catch (e) {
        if (!alive) return;
        setState(s => ({ ...s, loading:false, err: e.message || String(e) }));
      }
    };
    load();
    const id = setInterval(load, 30_000); // auto-refresh
    return () => { alive = false; clearInterval(id); };
  }, []);

  const color = state.loading ? '#ca8a04' : (state.ok ? '#16a34a' : '#dc2626');
  const label = state.loading ? 'Checking…' : (state.ok ? 'Live' : 'Attention');
  return (
    <div style={box}>
      <span style={dot(color)} />
      <strong style={{fontSize:14}}>Status: {label}</strong>
      <span style={{fontSize:12,color:'#6b7280'}}>Updated {state.ts ? new Date(state.ts).toLocaleTimeString() : ''}</span>
      <span style={{fontSize:12,color:'#6b7280'}}>API: {state.api || '(unset)'}</span>
      <span style={{fontSize:12,color:'#6b7280'}}>CORS: {state.allow || '(none)'}</span>
      <span style={{marginLeft:8}}>
        <a href="/api/internal/status" target="_blank" rel="noreferrer" style={link}>/status</a> ·
        <a href="/diagnostics.html" target="_blank" rel="noreferrer" style={link}>Diagnostics</a> ·
        <a href="/service-map.html" target="_blank" rel="noreferrer" style={link}>Service Map</a>
      </span>
      {state.err && <span style={{fontSize:12,color:'#b91c1c'}}>Error: {state.err}</span>}
    </div>
  );
}
