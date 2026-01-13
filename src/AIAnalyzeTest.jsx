import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = 'https://intellimat-repository-production-199f.up.railway.app';

export default function AIAnalyzeTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [healthData, setHealthData] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "Eskom Holdings",
    assessment_type: "ISO 14001",
    data: "Analyze ESG compliance",
  });

  useEffect(() => { checkAPIHealth(); }, []);

  const checkAPIHealth = async () => {
    try {
      const response = await fetch(API_URL + "/health");
      const data = await response.json();
      setHealthData(data);
      setApiStatus(data.status === "healthy" ? "online" : "offline");
    } catch (err) { setApiStatus("offline"); }
  };

  const testAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch(API_URL + "/api/agents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: formData.company_name }),
      });
      if (!response.ok) throw new Error("API Error " + response.status);
      const data = await response.json();
      setResult(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#111", color: "#fff", padding: 24 }}>
      <h1>AI Analysis Test</h1>
      <p style={{ color: "#888" }}>Railway API: {apiStatus.toUpperCase()}</p>
      <div style={{ background: "#1a1a1a", borderRadius: 12, padding: 24, marginTop: 20, maxWidth: 600 }}>
        <label style={{ display: "block", marginBottom: 8 }}>Company Name</label>
        <input value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff", marginBottom: 16, boxSizing: "border-box" }} />
        <label style={{ display: "block", marginBottom: 8 }}>Assessment Type</label>
        <select value={formData.assessment_type} onChange={(e) => setFormData({...formData, assessment_type: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #333", background: "#111", color: "#fff", marginBottom: 16 }}>
          <option>ISO 14001</option>
          <option>ISO 45001</option>
          <option>ISO 50001</option>
          <option>GISTM</option>
          <option>ISSB Climate</option>
        </select>
        <button onClick={testAnalyze} disabled={loading || apiStatus === "offline"} style={{ width: "100%", padding: 16, background: apiStatus === "offline" ? "#333" : "#C9A227", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          {loading ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>
      {error && <div style={{ background: "#450a0a", padding: 16, borderRadius: 8, marginTop: 20 }}>{error}</div>}
      {result && <pre style={{ background: "#052e16", padding: 16, borderRadius: 8, marginTop: 20, overflow: "auto" }}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
