import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
const AuthCtx = createContext(null);
const API = "/api/auth"; // via Vite proxy

async function getServerRole() {
  try {
    const res = await fetch(`${API}/me`, { credentials: "include" });
    if (!res.ok) return null;
    const j = await res.json();
    return j?.role || null;
  } catch { return null; }
}
async function setServerRole(role) {
  try {
    const res = await fetch(`${API}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role }),
    });
    return res.ok;
  } catch { return false; }
}

function setSyncLS(ok){
  try {
    localStorage.setItem("esg.lastSyncOk", String(!!ok));
    localStorage.setItem("esg.lastSyncTs", String(Date.now()));
  } catch {}
}

export function AuthProvider({ children }) {
  const [role, setRoleState] = useState(() => localStorage.getItem("esg.role") || "viewer");

  // Bootstrap: pull role from server (best-effort)
  useEffect(() => {
    let abort = false;
    (async () => {
      const srv = await getServerRole();
      if (!abort) {
        if (srv) { setRoleState(srv); localStorage.setItem("esg.role", srv); setSyncLS(true); }
        else { setSyncLS(false); }
      }
    })();
    return () => { abort = true; };
  }, []);

  const setRole = async (r) => {
    setRoleState(r);
    localStorage.setItem("esg.role", r);
    const ok = await setServerRole(r);
    setSyncLS(ok);
  };

  const value = useMemo(() => ({ role, setRole, user: { name: "Demo User", role } }), [role]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(){ const v = useContext(AuthCtx); if(!v) throw new Error("useAuth outside provider"); return v; }
