import React from "react";
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="hero">
      <div>
        <h1>ESG Navigator</h1>
        <p>Comprehensive Energy Management & ESG Compliance Platform</p>
        <div className="cta">
          <button className="btn primary" onClick={()=>navigate("/assessments")}>Start Free Assessment</button>
          <button className="btn" onClick={()=>navigate("/dashboard")}>View Demo</button>
        </div>
      </div>
    </div>
  );
}
