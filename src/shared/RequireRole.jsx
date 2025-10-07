import React from "react";
import { useAuth } from "./AuthContext.jsx";

export default function RequireRole({ roles = [], children }) {
  const { role, setRole } = useAuth();
  const allowed = roles.length === 0 || roles.includes(role);
  if (allowed) return children;
  return (
    <div className="card" style={{borderColor:"#fecaca", background:"#fff1f2"}}>
      <h3 style={{marginTop:0}}>Access denied</h3>
      <div style={{color:"#991b1b", marginBottom:8}}>
        This page requires role: <strong>{roles.join(" or ")}</strong>. Current role: <strong>{role}</strong>.
      </div>
      <div style={{display:"flex", gap:8}}>
        <button className="btn small" onClick={()=>setRole("finance")}>Switch to Finance</button>
        <a className="btn small" href="/dashboard">Go to Executive</a>
      </div>
    </div>
  );
}
