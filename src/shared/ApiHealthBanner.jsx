import React, { useEffect, useMemo, useRef, useState } from "react";

/* Why: keep a client-side ring buffer so teams can quickly diagnose API blips without extra backend state. */
export default function ApiHealthBanner({ intervalMs = 15000 }) {
  const [down, setDown] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef(null);

  const readHistory = () => {
    try { return JSON.parse(localStorage.getItem("esg.healthHistory") || "[]"); } catch { return []; }
  };
  const writeHistory = (arr) => {
    try { localStorage.setItem("esg.healthHistory", JSON.stringify(arr.slice(-10))); } catch {}
  };

  async function ping() {
    let ok = false, text = "API offline";
    try {
      const r = await fetch("/api/health", { credentials: "include" });
      const j = await r.json().catch(()=> ({}));
      ok = r.ok && j && j.ok !== false;
      text = ok ? `API ok · v${j.version || "?"} · asm:${j.counts?.assessments ?? "-"} pay:${j.counts?.payments ?? "-"}` : "API offline";
    } catch {
      ok = false; text = "API offline";
    }
    setDown(!ok);
    setMsg(text);
    const rec = { ts: Date.now(), ok, text };
    const hist = readHistory(); hist.push(rec); writeHistory(hist);
    setTick(t => t+1); // re-render
  }

  useEffect(() => {
    ping();
    timer.current = setInterval(ping, intervalMs);
    return () => clearInterval(timer.current);
  }, []);

  const history = useMemo(() => {
    const arr = readHistory();
    return arr.slice(-10).reverse();
  }, [tick]);

  const retry = async () => { await ping(); };

  const HistoryPanel = () => (
    <div style={{marginTop:6, border:"1px solid #e5e7eb", borderRadius:8, padding:"8px", background:"#fff"}}>
      {history.length === 0 ? (
        <div style={{fontSize:12, color:"#94a3b8"}}>No history.</div>
      ) : (
        <div style={{display:"grid", gap:6}}>
          {history.map((h,i)=>(
            <div key={i} style={{display:"flex", justifyContent:"space-between", fontSize:12}}>
              <span style={{color: h.ok ? "#111827" : "#7f1d1d"}}>{h.ok ? "OK" : "DOWN"}</span>
              <span style={{color:"#64748b"}}>{new Date(h.ts).toLocaleString()}</span>
              <span style={{color:"#64748b"}}>{h.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!down) {
    return (
      <div style={{display:"flex", alignItems:"center", gap:8, margin:"0 0 8px 0"}}>
        <span style={{fontSize:11, color:"#94a3b8"}} role="status" aria-live="polite">{msg || "API ok"}</span>
        <button className="btn small" onClick={retry} title="Ping /api/health">Retry</button>
        <button className="btn small" onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-controls="health-history">History</button>
        {open && <div id="health-history" style={{flexBasis:"100%"}}><HistoryPanel /></div>}
      </div>
    );
  }
  return (
    <div style={{background:"#fee2e2", border:"1px solid #fecaca", color:"#7f1d1d", padding:"6px 10px", borderRadius:8, margin:"0 0 8px 0"}}>
      <div style={{display:"flex", alignItems:"center", gap:8}}>
        <span>{msg}. Retrying…</span>
        <button className="btn small" onClick={retry} title="Ping /api/health">Retry</button>
        <button className="btn small" onClick={()=>setOpen(o=>!o)} aria-expanded={open} aria-controls="health-history">History</button>
      </div>
      {open && <div id="health-history"><HistoryPanel /></div>}
    </div>
  );
}
