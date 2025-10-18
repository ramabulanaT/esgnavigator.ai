import React from "react";
import PageHeader from "../shared/PageHeader.jsx";
import { useApi } from "../shared/useApi.jsx";

function Stat({ t, v, s }) {
  return (
    <div className="card" style={{flex:1,minWidth:200}}>
      <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>{t}</div>
      <div style={{fontSize:28,fontWeight:800,color:"#111827"}}>{v}</div>
      {s && <div style={{fontSize:12,color:"#94a3b8",marginTop:6}}>{s}</div>}
    </div>
  );
}

export default function FinancialReportingPage() {
  const { data, loading, error, reload } = useApi("/api/assessments");
  const rowsAll = Array.isArray(data) ? data : [];
  const key = /ifrs|issb|\bs1\b|\bs2\b|financial/i;
  const rows = rowsAll.filter(r => key.test((r.name||"") + " " + (r.external_id||"")));
  const total = rows.length;
  const completed = rows.filter(a=>a.status==="completed").length;
  const avg = total ? Math.round(rows.reduce((s,a)=>s+(+a.score||0),0)/total) : 0;
  const lastUpdate = total ? new Date(Math.max(...rows.map(a => new Date(a.updatedAt||a.updated_at||0).getTime()))).toLocaleString() : "—";

  const onRefresh = async () => { try{ await fetch("/api/refresh",{method:"POST",credentials:"include"});}catch{} reload(); };
  const onExport = () => {
    const header = ["id","name","status","score","updatedAt"];
    const lines = [header.join(",")].concat(
      rows.map(r => [r.id||r.external_id||"", r.name||"", r.status||"", r.score??"", r.updatedAt||r.updated_at||""].join(","))
    );
    const blob = new Blob([lines.join("\\n")],{type:"text/csv"}); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="financial_reporting_ifrs.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <PageHeader title="Financial Reporting (IFRS S1 & S2)" actions={
        <>
          <button className="btn small" onClick={onExport}>Export CSV</button>
          <button className="btn small" onClick={onRefresh}>Refresh</button>
        </>
      } />
      {loading && <div style={{color:"#64748b"}}>Loading…</div>}
      {error && <div style={{color:"#b91c1c"}}>Failed to load: {error.message}</div>}

      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
        <Stat t="Total Reports" v={total} />
        <Stat t="Completed" v={completed} />
        <Stat t="Average Score" v={`${avg}`} s="Across IFRS S1/S2" />
        <Stat t="Last Updated" v={lastUpdate} />
      </div>

      {rows.length === 0 ? (
        <div style={{color:"#64748b"}}>No IFRS S1/S2 items yet. Create one via Demo or import CSV.</div>
      ) : (
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{textAlign:"left",borderBottom:"1px solid #e5e7eb"}}>
                <th style={{padding:"8px"}}>Name</th>
                <th style={{padding:"8px"}}>Status</th>
                <th style={{padding:"8px"}}>Score</th>
                <th style={{padding:"8px"}}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r=>{
                const dt = (r.updatedAt||r.updated_at) ? new Date(r.updatedAt||r.updated_at).toLocaleString() : "—";
                return (
                  <tr key={r.id||r.external_id} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"8px",fontWeight:600}}>{r.name}</td>
                    <td style={{padding:"8px"}}>{r.status}</td>
                    <td style={{padding:"8px"}}>{r.score ?? "—"}</td>
                    <td style={{padding:"8px",color:"#64748b"}}>{dt}</td>
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
