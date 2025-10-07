/* src/pages/BusinessIntelligence.jsx */
import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../shared/PageHeader.jsx";
import { useApi } from "../shared/useApi.jsx";
import { buildIndex, search } from "../shared/SemanticSearch.js";
import { LineChart, BarChart } from "../shared/Charts.jsx";
import Sparkline from "../shared/Sparkline.jsx";

function Stat({ t, v, s }) {
  return (
    <div className="card" style={{flex:1,minWidth:220}}>
      <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>{t}</div>
      <div style={{fontSize:28,fontWeight:800,color:"#111827"}}>{v}</div>
      {s && <div style={{fontSize:12,color:"#94a3b8",marginTop:6}}>{s}</div>}
    </div>
  );
}

function dayKey(d){ return new Date(d).toISOString().slice(0,10); }
function lastNDays(n=30){
  const today = new Date(); return [...Array(n)].map((_,i)=> new Date(today.getFullYear(),today.getMonth(),today.getDate()-(n-1-i)));
}

export default function BusinessIntelligence(){
  const { data: assess, loading: lA, error: eA, reload: rA } = useApi("/api/assessments");
  const { data: pays,   loading: lP, error: eP, reload: rP } = useApi("/api/payments");

  const pending = useMemo(()=>{
    try { return JSON.parse(localStorage.getItem("pendingAssessments")||"[]"); } catch { return []; }
  },[]);
  const assessments = useMemo(()=> (Array.isArray(assess)?assess:[]).concat(pending), [assess,pending]);
  const payments    = useMemo(()=> Array.isArray(pays)?pays:[], [pays]);

  const [q, setQ] = useState("");
  const [scope, setScope] = useState("all"); // all|assessments|payments
  const [minScore, setMinScore] = useState(1);

  // Build search indices
  const idxAssess = useMemo(()=> buildIndex(assessments, ["name","external_id","status"]), [assessments]);
  const idxPays   = useMemo(()=> buildIndex(payments, ["ref","company","status"]), [payments]);

  const results = useMemo(()=>{
    if(!q.trim()) return { assessments: [], payments: [] };
    const base = { minScore };
    const a = (scope==="all"||scope==="assessments") ? search(idxAssess, q, base) : [];
    const p = (scope==="all"||scope==="payments")    ? search(idxPays, q, base) : [];
    return { assessments: a, payments: p };
  }, [q, scope, minScore, idxAssess, idxPays]);

  // KPIs
  const totalAssess = assessments.length;
  const completed   = assessments.filter(a=>a.status==="completed").length;
  const avgScore    = totalAssess ? Math.round(assessments.reduce((s,a)=>s + (+a.score||0), 0)/totalAssess) : 0;
  const overduePays = payments.filter(p => p.status==="overdue").length;

  // 30-day trend (by avg score/day)
  const days = lastNDays(30);
  const avgByDay = useMemo(()=>{
    const g = new Map();
    assessments.forEach(a=>{
      const k = dayKey(a.updatedAt || a.updated_at || Date.now());
      const arr = g.get(k)||[]; arr.push(+a.score||0); g.set(k,arr);
    });
    let last = 0;
    return days.map(d=>{
      const k = dayKey(d); const arr = g.get(k)||[];
      const v = arr.length ? Math.round(arr.reduce((s,x)=>s+x,0)/arr.length) : last;
      last = v; return v;
    });
  }, [assessments]);

  // Status distribution (completed / in-progress / other)
  const statusDist = useMemo(()=>{
    const c = completed;
    const ip = assessments.filter(a=>a.status==="in-progress").length;
    const o = totalAssess - c - ip;
    return [c, ip, o];
  }, [assessments, completed, totalAssess]);

  const suggestions = [
    { q:"iso 50001 high score", hint:"Energy assessments with good performance" },
    { q:"iso 14001 progress",   hint:"Environmental items in-progress" },
    { q:"ifrs s1 completed",    hint:"Financial reporting completed" },
    { q:"overdue payments",     hint:"Follow up on late invoices" },
    { q:"45001 low score",      hint:"Safety items needing attention" },
  ];

  const onRefresh = async ()=>{
    try { await fetch("/api/refresh",{ method:"POST", credentials:"include" }); } catch {}
    rA(); rP();
  };

  const ResSection = ({ title, items, render }) => (
    <div className="card" style={{padding:"12px"}}>
      <div style={{fontWeight:800, marginBottom:6}}>{title} <span style={{color:"#94a3b8"}}>({items.length})</span></div>
      {items.length===0 ? <div style={{color:"#64748b"}}>No matches.</div> :
        <div style={{display:"grid", gap:8}}>
          {items.slice(0,50).map(render)}
        </div>
      }
    </div>
  );

  return (
    <div className="card">
      <PageHeader title="Business Intelligence" actions={
        <>
          <button className="btn small" onClick={onRefresh}>Refresh</button>
        </>
      } />

      {(lA||lP) && <div style={{color:"#64748b"}}>Loading…</div>}
      {(eA||eP) && <div style={{color:"#b91c1c"}}>Failed to load data.</div>}

      {/* Search controls */}
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask anything, e.g. 'ifrs completed', 'overdue payments', 'iso 50001 low score'"
                 style={{flex:"1 1 420px", padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}} />
          <select value={scope} onChange={e=>setScope(e.target.value)}
                  style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}}>
            <option value="all">All</option>
            <option value="assessments">Assessments</option>
            <option value="payments">Payments</option>
          </select>
          <select value={minScore} onChange={e=>setMinScore(+e.target.value)}
                  style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}}>
            <option value="1">Match ≥ 1</option>
            <option value="2">Match ≥ 2</option>
            <option value="3">Match ≥ 3</option>
          </select>
        </div>

        <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:10}}>
          {suggestions.map(s=>(
            <button key={s.q} className="btn small" title={s.hint} onClick={()=>setQ(s.q)}>{s.q}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:"flex", gap:12, flexWrap:"wrap", marginBottom:12}}>
        <Stat t="Assessments" v={totalAssess} />
        <Stat t="Completed" v={completed} />
        <Stat t="Average Score" v={`${avgScore}`} s="All frameworks" />
        <Stat t="Overdue Payments" v={overduePays} />
      </div>

      {/* Analytics */}
      <div style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", marginBottom:12}}>
        <div className="card">
          <div style={{fontWeight:800, marginBottom:6}}>30-day Score Trend</div>
          <LineChart data={avgByDay} />
        </div>
        <div className="card">
          <div style={{fontWeight:800, marginBottom:6}}>Status Distribution</div>
          <BarChart data={statusDist} />
          <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"#64748b", marginTop:6}}>
            <span>Completed</span><span>In-Progress</span><span>Other</span>
          </div>
        </div>
        <div className="card">
          <div style={{fontWeight:800, marginBottom:6}}>Recent Activity</div>
          <Sparkline data={avgByDay.slice(-7)} width={320} height={40} />
          <div style={{fontSize:12, color:"#64748b", marginTop:6}}>7-day mini trend</div>
        </div>
      </div>

      {/* Results */}
      {q.trim() ? (
        <div style={{display:"grid", gap:12}}>
          <ResSection title="Assessments" items={results.assessments} render={(a)=>(
            <div key={a.id||a.external_id} className="card" style={{padding:"10px"}}>
              <div style={{display:"flex", justifyContent:"space-between", gap:8, alignItems:"center"}}>
                <div style={{fontWeight:700}}>{a.name}</div>
                <div style={{fontSize:12, color:"#64748b"}}>{new Date(a.updatedAt||a.updated_at||Date.now()).toLocaleString()}</div>
              </div>
              <div style={{fontSize:12, color:"#64748b", marginTop:4}}>Status: <strong>{a.status||"—"}</strong> · Score: <strong>{a.score??"—"}</strong></div>
              <div style={{marginTop:6}}>
                <a className="btn small" href={
                  /50001/.test((a.name||"")+(a.external_id||"")) ? "/iso-50001" :
                  /14001/.test((a.name||"")+(a.external_id||"")) ? "/iso-14001" :
                  /45001/.test((a.name||"")+(a.external_id||"")) ? "/iso-45001" :
                  /ifrs|issb|s1|s2|financial/i.test((a.name||"")+(a.external_id||"")) ? "/financial" : "/assessments"
                }>Open module</a>
              </div>
            </div>
          )} />
          <ResSection title="Payments" items={results.payments} render={(p)=>(
            <div key={p.id} className="card" style={{padding:"10px"}}>
              <div style={{display:"flex", justifyContent:"space-between", gap:8, alignItems:"center"}}>
                <div style={{fontWeight:700}}>{p.ref} — {p.company}</div>
                <div style={{fontSize:12, color:"#64748b"}}>{p.date||"—"}</div>
              </div>
              <div style={{fontSize:12, color:"#64748b", marginTop:4}}>R {Number(p.amount||0).toFixed(2)} · <strong>{p.status}</strong></div>
              <div style={{marginTop:6}}>
                <a className="btn small" href="/payments">Open payments</a>
              </div>
            </div>
          )} />
        </div>
      ) : (
        <div className="card" style={{color:"#64748b"}}>Type a query to see semantic matches and analytics.</div>
      )}
    </div>
  );
}
