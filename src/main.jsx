import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const UseHash = import.meta.env.VITE_USE_HASH === "true";
const Router = UseHash ? HashRouter : BrowserRouter;

const root = document.getElementById("root");
if (!root) throw new Error("#root not found");

createRoot(root).render(
  <Router>
    <App />
  </Router>
);
