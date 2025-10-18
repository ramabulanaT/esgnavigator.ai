import React from "react";
import { NavLink, Outlet } from "react-router-dom";
export default function AppLayout() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand" onClick={() => (window.location.href = "/")}>ESG Navigator</div>
        <nav className="nav">
          <NavLink to="/" end className="navlink">Home</NavLink>
          <NavLink to="/dashboard" className="navlink">Executive</NavLink>
          <NavLink to="/assessments" className="navlink">Assessments</NavLink>
        </nav>
      </header>
      <main className="main"><Outlet /></main>
      <footer className="footer">© {new Date().getFullYear()} ESG Navigator</footer>
    </div>
  );
}
