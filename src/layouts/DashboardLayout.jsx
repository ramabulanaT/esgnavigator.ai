import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Breadcrumbs from "../shared/Breadcrumbs.jsx";
import { useAuth } from "../shared/AuthContext.jsx";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const [health, setHealth] = useState({ ok: false });
  const [ts, setTs] = useState(null);

  useEffect(() => {
    let t;
    const load = async () => {
      try {
        const res = await fetch("/api/health", { credentials: "include" });
        const j = await res.json();
        setHealth(j || { ok: false });
        setTs(new Date().toLocaleTimeString());
      } catch {
        setHealth({ ok: false });
        setTs(new Date().toLocaleTimeString());
      }
    };
    load();
    t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const badgeStyle = {
    display:"inline-flex", alignItems:"center", gap:6, padding:"4px 8px",
    borderRadius:999, fontSize:12, background: health?.ok ? "#ecfdf5" : "#fef2f2",
    color: health?.ok ? "#065f46" : "#991b1b", border:`1px solid ${health?.ok ? "#a7f3d0":"#fecaca"}`
  };

  return (
    <div className="dash-wrap">
      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="side-head">
          <button className="ghost" onClick={() => setOpen(o=>!o)} aria-label="Toggle menu">☰</button>
          {open && <span className="side-title">ESG Navigator</span>}
        </div>

        <div className="side-group">
          {open && <div className="side-label">Overview</div>}
          <NavLink to="/dashboard" className="side-link">Executive</NavLink>
          <NavLink to="/assessments" className="side-link">Assessments</NavLink>
        </div>

        <div className="side-group">
          {open && <div className="side-label">Standards</div>}
          <NavLink to="/iso-50001" className="side-link">ISO 50001</NavLink>
          <NavLink to="/iso-14001" className="side-link">ISO 14001</NavLink>
          <NavLink to="/iso-45001" className="side-link">ISO 45001</NavLink>
        </div>

        <div className="side-group">
          {open && <div className="side-label">ESG & Client</div>}
          <NavLink to="/esg" className="side-link">ESG</NavLink>
          <NavLink to="/client" className="side-link">Client Info</NavLink>
        </div>

        <div style={{marginTop:"auto", padding:"10px 6px"}}>
          <div style={badgeStyle} title={ts ? `Last check ${ts}` : ""}>
            <span style={{width:8,height:8,borderRadius:"50%",background:health?.ok?"#16a34a":"#dc2626"}}></span>
            <span>{health?.ok ? "API Healthy" : "API Down"}</span>
          </div>
        </div>
        <div style={{padding:"10px 6px"}}>
    <div style={{fontSize:11, color:"#8191a8", marginBottom:6}}>Role</div>
    {(() => {
      const { role, setRole } = useAuth();
      return (
        <select value={role} onChange={(e)=>setRole(e.target.value)}
          style={{width:"100%", padding:"6px 8px", border:"1px solid #334155", background:"#0b1324", color:"#e2e8f0", borderRadius:8}}>
          <option value="viewer">viewer</option>
          <option value="analyst">analyst</option>
          <option value="finance">finance</option>
          <option value="admin">admin</option>
        </select>
        <div style={{marginTop:6, fontSize:11, color:"#94a3b8"}}>
          {(() => {
            try {
              const ok = localStorage.getItem("esg.lastSyncOk");
              const ts = Number(localStorage.getItem("esg.lastSyncTs") || 0);
              const time = ts ? new Date(ts).toLocaleTimeString() : "—";
              return (ok === "false") ? `auth: offline · ${time}` : `auth: synced · ${time}`;
            } catch { return "auth: —"; }
          })()}
        </div>
      );
    })()}
  </div>
          <NavLink to="/bi" className="side-link">Business Intelligence</NavLink>
</aside>

      <div className="dash-main">
        <header className="dash-top">
          <Breadcrumbs />
          <div className="dash-actions">
            <a className="btn small" href="/">Home</a>
          </div>
        </header>
        <main className="dash-content">
          <ApiHealthBanner />
        <Outlet />
        </main>
        <footer className="dash-foot">© {new Date().getFullYear()} ESG Navigator</footer>
      </div>
    </div>
  );
}






