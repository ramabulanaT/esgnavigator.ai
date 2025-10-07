import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../shared/PageHeader.jsx";

const QUESTIONS = [
  { id:"q1", text:"Do you have an energy policy approved by top management?", choices:[
    { label:"No policy", value:0 }, { label:"Drafted but not approved", value:10 }, { label:"Approved policy exists", value:20 }
  ]},
  { id:"q2", text:"How frequently do you measure energy consumption?", choices:[
    { label:"Annually", value:5 }, { label:"Quarterly", value:10 }, { label:"Monthly", value:15 }, { label:"Weekly/Daily", value:20 }
  ]},
  { id:"q3", text:"Do you maintain an energy baseline and targets?", choices:[
    { label:"No baseline", value:0 }, { label:"Baseline only", value:10 }, { label:"Baseline + targets", value:20 }
  ]},
  { id:"q4", text:"Level of metering/sub-metering deployed?", choices:[
    { label:"Minimal", value:5 }, { label:"Partial", value:12 }, { label:"Extensive", value:20 }
  ]},
  { id:"q5", text:"Are operational controls documented for significant energy uses?", choices:[
    { label:"No", value:0 }, { label:"Some", value:10 }, { label:"Comprehensive", value:20 }
  ]},
  { id:"q6", text:"Do you have a formal internal audit program for energy management?", choices:[
    { label:"No", value:0 }, { label:"Ad-hoc", value:8 }, { label:"Annual", value:14 }, { label:"Semi-annual or better", value:20 }
  ]},
  { id:"q7", text:"Management review frequency on energy performance?", choices:[
    { label:"Rarely", value:4 }, { label:"Annually", value:12 }, { label:"Quarterly", value:20 }
  ]}
];

function exportCsv(rows) {
  const blob = new Blob([rows.join("\n")], { type:"text/csv" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = "demo_assessment.csv"; a.click(); URL.revokeObjectURL(url);
}

export default function DemoAssessment() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [company, setCompany] = useState("");
  const [framework, setFramework] = useState("50001");
  const [saving, setSaving] = useState(false);

  const allAnswered = useMemo(()=> QUESTIONS.every(q => Number.isFinite(answers[q.id])), [answers]);

  const totalScore = useMemo(()=>{
    const sum = QUESTIONS.reduce((s,q)=> s + (Number.isFinite(answers[q.id]) ? answers[q.id] : 0), 0);
    const max = QUESTIONS.reduce((s,q)=> s + Math.max(...q.choices.map(c=>c.value)), 0);
    return max ? Math.round((sum / max) * 100) : 0;
  }, [answers]);

  const onExport = () => {
    const header = ["company","framework","question","choice","value"];
    const rows = [header.join(",")].concat(
      QUESTIONS.map(q => {
        const val = answers[q.id];
        const choice = q.choices.find(c => c.value === val);
        return [company.replace(/,/g,";"), framework, q.text.replace(/,/g,";"), choice?choice.label:"", val ?? ""].join(",");
      })
    ).concat("", `Total Score,${totalScore}`);
    exportCsv(rows);
  };

  async function persist(record){
    // Try backend first
    try {
      const res = await fetch("/api/assessments", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        credentials:"include",
        body: JSON.stringify(record)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return true;
    } catch { return false; }
  }

  const onSubmit = async () => {
    if (!company || !allAnswered) return;
    setSaving(true);
    const id = `demo-${framework}-${Date.now()}`;
    const name = `${company} — Demo Assessment ISO ${framework}`;
    const rec = {
      id, external_id:id, name,
      status:"completed", score: totalScore,
      updatedAt: new Date().toISOString(),
      framework
    };
    const ok = await persist(rec);
    if (!ok) {
      // local fallback queue
      const key = "pendingAssessments";
      const list = JSON.parse(localStorage.getItem(key)||"[]");
      list.push(rec);
      localStorage.setItem(key, JSON.stringify(list));
    }
    setSaving(false);
    navigate("/assessments?pending=1");
  };

  return (
    <div className="card">
      <PageHeader title="Demo Assessment (7 Questions)" actions={
        <>
          <button className="btn small" onClick={onExport} disabled={!allAnswered}>Export CSV</button>
          <button className="btn small" onClick={onSubmit} disabled={!allAnswered || !company || saving}>
            {saving ? "Saving…" : "Submit & Save"}
          </button>
        </>
      } />

      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:12,color:"#64748b"}}>Company</div>
            <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="e.g. Acme Corp"
                   style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}} />
          </div>
          <div>
            <div style={{fontSize:12,color:"#64748b"}}>Framework</div>
            <select value={framework} onChange={e=>setFramework(e.target.value)}
                    style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}}>
              <option value="50001">ISO 50001</option>
              <option value="14001">ISO 14001</option>
              <option value="45001">ISO 45001</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:12,color:"#64748b"}}>Estimated Score</div>
            <div style={{fontSize:24,fontWeight:800}}>{totalScore} / 100</div>
          </div>
        </div>
      </div>

      <div style={{display:"grid", gap:12}}>
        {QUESTIONS.map((q,idx)=>(
          <div key={q.id} className="card" style={{padding:"12px"}}>
            <div style={{fontWeight:700, marginBottom:8}}>{idx+1}. {q.text}</div>
            <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
              {q.choices.map(c=>(
                <label key={c.label} style={{
                  display:"inline-flex", alignItems:"center", gap:6, padding:"6px 10px", border:"1px solid #e5e7eb",
                  borderRadius:8, background: (answers[q.id]===c.value) ? "#eef2ff" : "#fff", cursor:"pointer"
                }}>
                  <input type="radio" name={q.id} value={c.value} checked={answers[q.id]===c.value}
                         onChange={()=> setAnswers(a=>({...a, [q.id]: c.value}))}/>
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
