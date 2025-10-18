import React from "react";
import PageHeader from "../shared/PageHeader.jsx";
import { useApi } from "../shared/useApi.jsx";
import ProgressBar from "../shared/ProgressBar.jsx";

export default function ISO50001Assessment() {
  const { data, loading, error, reload } = useApi("/api/assessments");
  const KEY = "50001";
  const list = Array.isArray(data) ? data.filter(r => {
    const n = (r.name||"").toLowerCase();
    const x = (r.external_id||r.id||"").toLowerCase();
    return n.includes(KEY) || x.includes(KEY);
  }) : [];

  const total = list.length;
  const completed = list.filter(a => a.status === "completed").length;
  const avg = total ? Math.round(list.reduce((s,a)=>s + (+a.score||0), 0) / total) : 0;

  const onRefresh = async () => {
    try { await fetch("/api/refresh", { method:"POST", credentials:"include" }); } catch {}
    reload();
  };

  return (
    <div className="card">
      <PageHeader title="ISO 50001 — Energy Management" actions={<button className="btn small" onClick={onRefresh}>Refresh</button>} />
      {loading && <div style={{color:"#64748b"}}>Loading…</div>}
      {error && <div style={{color:"#b91c1c"}}>Failed: {error.message}</div>}

      <div style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", marginBottom:12}}>
        <div className="card">
          <div style={{fontSize:12,color:"#64748b"}}>Assessments</div>
          <div style={{fontSize:28,fontWeight:800}}>{total}</div>
        </div>
        <div className="card">
          <div style={{fontSize:12,color:"#64748b"}}>Completed</div>
          <div style={{fontSize:28,fontWeight:800}}>{completed}</div>
        </div>
        <div className="card">
          <div style={{fontSize:12,color:"#64748b"}}>Average Score</div>
          <div style={{fontSize:28,fontWeight:800, marginBottom:8}}>{avg}</div>
          <ProgressBar value={avg} />
          <div style={{fontSize:12,color:"#94a3b8",marginTop:6}}>Target ≥ 80</div>
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{color:"#64748b"}}>No matching assessments yet. Use the Demo to create one.</div>
      ) : (
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr style={{textAlign:"left", borderBottom:"1px solid #e5e7eb"}}>
                <th style={{padding:"8px"}}>Name</th>
                <th style={{padding:"8px"}}>Status</th>
                <th style={{padding:"8px"}}>Score</th>
                <th style={{padding:"8px"}}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map(a => {
                const updated = a.updatedAt || a.updated_at;
                const dt = updated ? new Date(updated).toLocaleString() : "—";
                return (
                  <tr key={a.id||a.external_id} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"8px", fontWeight:600}}>{a.name}</td>
                    <td style={{padding:"8px"}}>{a.status}</td>
                    <td style={{padding:"8px"}}>{a.score ?? "—"}</td>
                    <td style={{padding:"8px", color:"#64748b"}}>{dt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
