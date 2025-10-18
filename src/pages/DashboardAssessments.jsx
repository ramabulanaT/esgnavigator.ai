import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageHeader from "../shared/PageHeader.jsx";
import { useApi } from "../shared/useApi.jsx";

function Badge({ status }) {
  const map = {
    completed: { bg:"#ecfdf5", fg:"#065f46", text:"Completed" },
    "in-progress": { bg:"#fff7ed", fg:"#9a3412", text:"In Progress" },
    "pending-sync": { bg:"#fef3c7", fg:"#92400e", text:"Pending Sync" }
  };
  const { bg, fg, text } = map[status] || { bg:"#eef2ff", fg:"#3730a3", text: status || "Unknown" };
  return <span style={{background:bg, color:fg, padding:"2px 8px", borderRadius:999, fontSize:12}}>{text}</span>;
}

export default function DashboardAssessments() {
  const nav = useNavigate();
  const { data, loading, error, reload } = useApi("/api/assessments");
  const [params, setParams] = useSearchParams();
  const [syncing, setSyncing] = useState(false);

  const q = (params.get("contains") || "").toLowerCase().trim();

  const localPendings = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("pendingAssessments")||"[]"); } catch { return []; }
  }, [params]);

  const server = Array.isArray(data) ? data : [];
  const pending = localPendings.map(p => ({ ...p, status:"pending-sync" }));
  const merged = useMemo(() => {
    const byId = new Map();
    [...pending, ...server].forEach(x => byId.set(x.id || x.external_id, x));
    let list = Array.from(byId.values());
    if (q) {
      list = list.filter(r => ((r.name||"")+(r.external_id||"")).toLowerCase().includes(q));
    }
    return list;
  }, [server, pending, q]);

  const trySync = async () => {
    const queue = JSON.parse(localStorage.getItem("pendingAssessments")||"[]");
    if (!queue.length) return;
    setSyncing(true);
    const kept = [];
    for (const rec of queue) {
      try {
        const res = await fetch("/api/assessments", {
          method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include",
          body: JSON.stringify(rec)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
      } catch {
        kept.push(rec);
      }
    }
    localStorage.setItem("pendingAssessments", JSON.stringify(kept));
    setSyncing(false);
    reload();
  };

  const onRefresh = async () => {
    try { await fetch("/api/refresh", { method:"POST", credentials:"include" }); } catch {}
    reload();
  };

  const onExport = () => {
    const rows = merged;
    const header = ["id","name","status","score","updatedAt"];
    const lines = [header.join(",")].concat(
      rows.map(r => [r.id || r.external_id || "", r.name || "", r.status || "", r.score ?? "", r.updatedAt || r.updated_at || ""].join(","))
    );
    const blob = new Blob([lines.join("\n")], { type:"text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "assessments.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => { if (params.get("pending") === "1") { trySync(); } }, []); // on entry

  const clearFilter = () => { params.delete("contains"); setParams(params, { replace:true }); };

  return (
    <div className="card">
      <PageHeader title="ESG Assessments" actions={
        <>
          <a className="btn small" href="/assessments/demo">Start Demo Assessment</a>
          <button className="btn small" onClick={onExport}>Export CSV</button>
          <button className="btn small" onClick={onRefresh}>Refresh</button>
        </>
      } />

      {q && (
        <div className="card" style={{marginBottom:12, display:"flex", alignItems:"center", gap:8}}>
          <span style={{fontSize:12, color:"#64748b"}}>Filter:</span>
          <span style={{background:"#eef2ff", color:"#3730a3", padding:"2px 10px", borderRadius:999, fontSize:12}}>{q}</span>
          <button className="btn small" onClick={clearFilter}>Clear</button>
        </div>
      )}

      {localPendings.length > 0 && (
        <div className="card" style={{marginBottom:12, borderColor:"#fde68a", background:"#fffbeb"}}>
          <strong>{localPendings.length}</strong> assessment(s) pending sync.
          <button className="btn small" onClick={trySync} disabled={syncing} style={{marginLeft:8}}>
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </div>
      )}

      {loading && <div style={{color:"#64748b"}}>Loading…</div>}
      {error && <div style={{color:"#b91c1c"}}>Failed to load: {error.message}</div>}
      {!loading && Array.isArray(merged) && merged.length === 0 && (
        <div style={{color:"#64748b"}}>No assessments found.</div>
      )}

      {Array.isArray(merged) && merged.length > 0 && (
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
              {merged.map((a) => {
                const updated = a.updatedAt || a.updated_at;
                const dt = updated ? new Date(updated).toLocaleString() : "—";
                return (
                  <tr key={a.id || a.external_id} style={{borderBottom:"1px solid #f1f5f9"}}>
                    <td style={{padding:"8px", fontWeight:600, cursor:"pointer"}} onClick={()=>nav(`/assessments?contains=${encodeURIComponent(a.external_id||a.name||"")}`)}>{a.name}</td>
                    <td style={{padding:"8px"}}><Badge status={a.status} /></td>
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

