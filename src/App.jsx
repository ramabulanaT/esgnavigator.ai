import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ExecutiveDashboardPage from "./ExecutiveDashboardPage";
import ISO50001Assessment from "./ISO50001Assessment.jsx";

export default function App() {
  return (
    <>
      <nav style={{padding:12, borderBottom:"1px solid #eee"}}>
        <Link to="/" style={{marginRight:12}}>Dashboard</Link>
        <Link to="/iso50001">ISO 50001 Assessment</Link>
      </nav>

      <Routes>
        <Route path="/" element={<ExecutiveDashboardPage />} />
        <Route path="/iso50001" element={<ISO50001Assessment />} />
      </Routes>
    </>
  );
}
