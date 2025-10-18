import React, { useEffect, useMemo, useState } from "react";
import PageHeader from "../shared/PageHeader.jsx";
import { useApi } from "../shared/useApi.jsx";

function usePayments() {
  // Try API first, fallback to localStorage
  const api = useApi("/api/payments");
  const [local, setLocal] = useState([]);
  const [usingLocal, setUsingLocal] = useState(false);

  useEffect(() => {
    if (api.error) {
      try {
        const raw = localStorage.getItem("payments") || "[]";
        const arr = JSON.parse(raw);
        setLocal(arr);
        setUsingLocal(true);
      } catch { setLocal([]); setUsingLocal(true); }
    } else if (Array.isArray(api.data)) {
      setUsingLocal(false);
    }
  }, [api.data, api.error]);

  const data = usingLocal ? local : (Array.isArray(api.data) ? api.data : []);
  const reload = usingLocal ? () => {
    try { setLocal(JSON.parse(localStorage.getItem("payments") || "[]")); } catch { setLocal([]); }
  } : api.reload;

  const add = async (rec) => {
    if (usingLocal) {
      const list = JSON.parse(localStorage.getItem("payments") || "[]");
      list.unshift(rec);
      localStorage.setItem("payments", JSON.stringify(list));
      setLocal(list);
      return { ok: true, local: true };
    }
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(rec)
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      await api.reload();
      return { ok: true, local: false };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  };

  return { data, reload, add, usingLocal, loading: api.loading, error: api.error };
}

function Summary({ data }) {
  const total = data.reduce((s,p)=> s + (Number(p.amount) || 0), 0);
  const paid = data.filter(p => p.status === "paid").reduce((s,p)=> s + (Number(p.amount)||0), 0);
  const due = total - paid;
  return (
    <div style={{display:"grid", gap:12, gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", marginBottom:12}}>
      <div className="card"><div style={{fontSize:12,color:"#64748b"}}>Total Amount</div><div style={{fontSize:28,fontWeight:800}}>R {total.toFixed(2)}</div></div>
      <div className="card"><div style={{fontSize:12,color:"#64748b"}}>Paid</div><div style={{fontSize:28,fontWeight:800, color:"#16a34a"}}>R {paid.toFixed(2)}</div></div>
      <div className="card"><div style={{fontSize:12,color:"#64748b"}}>Outstanding</div><div style={{fontSize:28,fontWeight:800, color:"#dc2626"}}>R {due.toFixed(2)}</div></div>
    </div>
  );
}

export default function PaymentTracker() {
  const { data, reload, add, usingLocal, loading, error } = usePayments();
  const [form, setForm] = useState({ ref:"", company:"", amount:"", status:"due", date:"" });

  const valid = useMemo(()=> form.ref && form.company && form.amount && form.date, [form]);

  const onAdd = async () => {
    if (!valid) return;
    const rec = {
      id: "pay-" + Date.now(),
      ref: form.ref,
      company: form.company,
      amount: Number(form.amount),
      status: form.status,
      date: form.date
    };
    const res = await add(rec);
    if (!res.ok) { alert("Failed to add payment" + (res.error?": "+res.error:"")); }
    setForm({ ref:"", company:"", amount:"", status:"due", date:"" });
  };

  const onExport = () => {
    const header = ["id","ref","company","amount","status","date"];
    const lines = [header.join(",")].concat(
      data.map(p => [p.id||"", p.ref||"", p.company||"", p.amount??"", p.status||"", p.date||""].join(","))
    );
    const blob = new Blob([lines.join("\n")], { type:"text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "payments.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <PageHeader
        title="Payments"
        actions={
          <>
            <button className="btn small" onClick={onExport}>Export CSV</button>
            <button className="btn small" onClick={reload}>Refresh</button>
          </>
        }
      />
      {usingLocal && <div className="card" style={{marginBottom:12, borderColor:"#fde68a", background:"#fffbeb"}}>
        API not found; using local storage. Data will not persist on other devices.
      </div>}
      {loading && <div style={{color:"#64748b"}}>Loading…</div>}
      {error && <div style={{color:"#b91c1c"}}>Failed to load payments: {error.message}</div>}

      <Summary data={Array.isArray(data)?data:[]} />

      <div className="card" style={{marginBottom:12}}>
        <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>Add Payment</div>
        <div style={{display:"grid", gap:10, gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))"}}>
          <input placeholder="Reference" value={form.ref} onChange={e=>setForm({...form, ref:e.target.value})}
                 style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}} />
          <input placeholder="Company" value={form.company} onChange={e=>setForm({...form, company:e.target.value})}
                 style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}} />
          <input type="number" step="0.01" placeholder="Amount (R)" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})}
                 style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}} />
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}
                  style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}}>
            <option value="due">Due</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}
                 style={{padding:"8px 10px", border:"1px solid #e5e7eb", borderRadius:8}} />
          <button className="btn" onClick={onAdd} disabled={!valid}>Add</button>
        </div>
      </div>

      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{textAlign:"left", borderBottom:"1px solid #e5e7eb"}}>
              <th style={{padding:"8px"}}>Ref</th>
              <th style={{padding:"8px"}}>Company</th>
              <th style={{padding:"8px"}}>Amount (R)</th>
              <th style={{padding:"8px"}}>Status</th>
              <th style={{padding:"8px"}}>Date</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(data)?data:[]).map(p=>(
              <tr key={p.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                <td style={{padding:"8px"}}>{p.ref}</td>
                <td style={{padding:"8px"}}>{p.company}</td>
                <td style={{padding:"8px"}}>{Number(p.amount).toFixed(2)}</td>
                <td style={{padding:"8px"}}>{p.status}</td>
                <td style={{padding:"8px"}}>{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
