import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../shared/PageHeader.jsx";
import { useApi } from "../shared/useApi.jsx";
import Sparkline from "../shared/Sparkline.jsx";
import { useAuth } from "../shared/AuthContext.jsx";

function Stat({ label, value, sub }) {
  return (
    <div className="card" style={{flex:1, minWidth:180}}>
      <div style={{fontSize:12, color:"#64748b", marginBottom:6}}>{label}</div>
      <div style={{fontSize:28, fontWeight:800, color:"#111827"}}>{value}</div>
      {sub && <div style={{fontSize:12, color:"#94a3b8", marginTop:6}}>{sub}</div>}
    </div>
  );
}
const fmtDate = (t)=> t ? new Date(t).toLocaleString() : "—";
const dayKey = (d) => new Date(d).toISOString().slice(0,10);

export default function ExecutiveDashboardPage() {
  const nav = useNavigate();
  const { role } = useAuth();
  const canFinance = role === "finance" || role === "admin";

  const { data: health, loading: lH, error: eH, reload: rH } = useApi("/api/health");
  const { data: list,  loading: lL, error: eL, reload: rL } = useApi("/api/assessments");
  const loading = lH || lL;
  const [seeding, setSeeding] = useState(false);

  const arr = Array.isArray(list) ? list : [];
  const total = arr.length;
  const completed = arr.filter(a=>a.status==="completed").length;
  const inProgress = total - completed;
  const avg = total ? Math.round(arr.reduce((s,a)=>s+(+a.score||0),0)/total) : 0;
  const lastUpdateAll = total ? fmtDate(Math.max(...arr.map(a=>new Date(a.updatedAt||a.updated_at||0).getTime()))) : "—";

  const defs = [
    { id:"financial", title:"Financial Reporting", sub:"IFRS S1 & S2 Sustainability Disclosure Standards", to:"/financial",
      match:(a)=>/ifrs|issb|\bs1\b|\bs2\b|financial/i.test((a.name||"")+(a.external_id||"")), icon:"📊" },
    { id:"energy", title:"Energy Management", sub:"ISO 50001 Energy Management Systems", to:"/iso-50001",
      match:(a)=>/50001|energy/i.test((a.name||"")+(a.external_id||"")), icon:"⚡" },
    { id:"security", title:"Security & Info Security", sub:"ISO 27001 Information Security Management", to:"/assessments?contains=27001",
      match:(a)=>/27001|security/i.test((a.name||"")+(a.external_id||"")), icon:"🛡️" },
    { id:"health", title:"Health & Safety", sub:"ISO 45001 Occupational Health & Safety", to:"/iso-45001",
      match:(a)=>/45001|safety/i.test((a.name||"")+(a.external_id||"")), icon:"⛑️" },
    { id:"environment", title:"Environmental Management", sub:"ISO 14001 Environmental Management Systems", to:"/iso-14001",
      match:(a)=>/14001|environment/i.test((a.name||"")+(a.external_id||"")), icon:"🌱" },
    { id:"governance", title:"Sustainability & Governance", sub:"CDP, GRI, SASB Reporting Standards", to:"/esg",
      match:(a)=>/gri|cdp|sustain|govern/i.test((a.name||"")), icon:"🏛️" },
  ];

  function sevenDayTrend(items) {
    const today = new Date(); const days = [...Array(7)].map((_,i)=>new Date(today.getFullYear(), today.getMonth(), today.getDate()-(6-i)));
    const groups = new Map();
    items.forEach(it => {
      const k = dayKey(it.updatedAt || it.updated_at || new Date());
      const list = groups.get(k) || []; list.push(+it.score || 0); groups.set(k, list);
    });
    let lastVal = 0;
    return days.map(d => {
      const k = dayKey(d);
      const vals = groups.get(k) || [];
      const v = vals.length ? Math.round(vals.reduce((s,x)=>s+x,0)/vals.length) : lastVal;
      lastVal = v;
      return v;
    });
  }

  const modules = defs.map(m=>{
    const items = arr.filter(m.match);
    const score = items.length ? Math.round(items.reduce((s,a)=>s+(+a.score||0),0)/items.length) : 0;
    const last  = items.length ? fmtDate(Math.max(...items.map(a=>new Date(a.updatedAt||a.updated_at||0).getTime()))) : "—";
    const trend = sevenDayTrend(items);
    const locked = m.id === "financial" && !canFinance;
    const status = locked ? "Locked" : (items.length ? "Active" : "Inactive");
    return { ...m, items, count: items.length, score, last, trend, status, locked };
  });

  const onRefresh = async ()=>{ try{ await fetch("/api/refresh",{method:"POST",credentials:"include"});}catch{} rH(); rL(); };
  const onSeed = async ()=>{
    setSeeding(true);
    try {
      await fetch("/api/demo/seed",{ method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include", body: JSON.stringify({ force:true }) });
    } catch {}
    finally { setSeeding(false); }
    onRefresh();
  };

  return (
    <div className="card">
      <PageHeader title="Executive Dashboard" actions={
        <>
          <a className="btn small" href="/assessments/demo">Start Demo Assessment</a>
          <button className="btn small" onClick={onSeed} disabled={seeding} title="Seed realistic demo data">{seeding ? "Seeding…" : "Seed Demo Data"}</button>
          <button className="btn small" onClick={onRefresh}>Refresh</button>
        </>
      } />

      {loading && <div style={{color:"#64748b"}}>Loading…</div>}
      {(eH || eL) && <div style={{color:"#b91c1c",marginBottom:12}}>{eH && `Health error: ${eH.message}. `}{eL && `Data error: ${eL.message}`}</div>}

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
        <Stat label="Total Assessments" value={total} />
        <Stat label="Completed" value={completed} />
        <Stat label="In Progress" value={inProgress} />
        <Stat label="Average Score" value={`${avg||0}`} sub="Across all assessments" />
        <Stat label="API Status" value={health?.ok?"Healthy":"Unknown"} sub={health?.version?`v${health.version}`:""} />
        <Stat label="Last Update" value={lastUpdateAll} />
      </div>

      <div style={{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))"}}>
        {modules.map(m=>(
          <div
            key={m.id}
            className="module-card"
            title={m.locked ? "Requires Finance or Admin role" : ""}
            onClick={()=>nav(m.to)}
            style={m.locked ? {opacity:.85} : undefined}
          >
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:24}}>{m.icon}</div>
              <div>
                <div className="title">
                  {m.title} {m.locked && <span aria-label="locked" title="Requires Finance/Admin">🔒</span>}
                </div>
                <div className="sub">{m.sub}</div>
              </div>
            </div>
            <div className="divider-plain" />
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
              <div className="status">{m.status}</div>
              <div className="score">{String(m.score).padStart(2,"0")}/100</div>
            </div>
            <div className="meta" style={{marginTop:6}}>
              <span>{m.count} item(s)</span>
              <span>Last: {m.last}</span>
            </div>
            <div style={{marginTop:8}}>
              <Sparkline data={m.trend} width={140} height={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
