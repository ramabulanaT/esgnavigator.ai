import React from "react";
import { Link, useLocation } from "react-router-dom";
const MAP = { "dashboard":"Executive","assessments":"Assessments","iso-50001":"ISO 50001","iso-14001":"ISO 14001","iso-45001":"ISO 45001","esg":"ESG","client":"Client Info" };
export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const crumbs = [{ path: "/", label: "Home" }, ...parts.map((seg,i)=>({ path:"/"+parts.slice(0,i+1).join("/"), label: MAP[seg] || seg.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()) }))];
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {crumbs.map((c,i)=>{ const last=i===crumbs.length-1; return (
        <span key={c.path} className="crumb">
          {last? <span className="crumb-current">{c.label}</span> : <Link to={c.path} className="crumb-link">{c.label}</Link>}
          {!last && <span className="crumb-sep">/</span>}
        </span>
      );})}
    </nav>
  );
}
