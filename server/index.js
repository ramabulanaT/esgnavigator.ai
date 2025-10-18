/* server/index.js */
import path from "path";
import fs from "fs";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3001;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

/* ------------ auth (as before) ------------ */
const sign = (role)=> jwt.sign({ role }, JWT_SECRET, { expiresIn: "7d" });
const getRole = (req)=> { try { const t=req.cookies.token; if(!t) return null; return (jwt.verify(t, JWT_SECRET).role)||null; } catch { return null; } };

app.get("/api/auth/me",(req,res)=>{ res.json({ ok:true, role: getRole(req) || "viewer" }); });
app.post("/api/auth/role",(req,res)=>{ const role=String(req.body?.role||"viewer"); res.cookie("token", sign(role), { httpOnly:true, sameSite:"lax" }); res.json({ ok:true, role }); });

/* ------------ data helpers ------------ */
function loadJson(name, def){ const f=path.join(DATA_DIR, name); try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return def; } }
function saveJson(name, data){ const f=path.join(DATA_DIR, name); fs.writeFileSync(f, JSON.stringify(data, null, 2)); }

let assessments = loadJson("assessments.json", []);
let payments    = loadJson("payments.json", []);

function nowISO(){ return new Date().toISOString(); }
function nextId(prefix="id"){ return `${prefix}_${Math.random().toString(36).slice(2,8)}${Date.now().toString(36).slice(-4)}`; }

/* ------------ health ------------ */
const VERSION = "1.0.0";
const startedAt = Date.now();
function healthBody(){
  return {
    ok: true,
    version: VERSION,
    time: nowISO(),
    uptimeSec: Math.floor((Date.now() - startedAt)/1000),
    counts: { assessments: assessments.length, payments: payments.length }
  };
}
app.get("/api/health", (req,res)=> res.json(healthBody()));
app.get("/healthz", (req,res)=> res.json(healthBody()));

/* ------------ assessments ------------ */
app.get("/api/assessments", (req,res)=> res.json(assessments));
app.post("/api/assessments", (req,res)=>{
  const b = req.body||{};
  const rec = {
    id: b.id || b.external_id || nextId("asm"),
    external_id: b.external_id || b.id || "",
    name: b.name || "Untitled",
    status: b.status || "in-progress",
    score: Number.isFinite(+b.score) ? +b.score : null,
    updatedAt: b.updatedAt || b.updated_at || nowISO()
  };
  assessments = [rec, ...assessments.filter(r => (r.id||r.external_id)!==(rec.id))];
  saveJson("assessments.json", assessments);
  res.status(201).json(rec);
});

/* ------------ payments ------------ */
app.get("/api/payments", (req,res)=> res.json(payments));
app.post("/api/payments", (req,res)=>{
  const b = req.body||{};
  const rec = {
    id: b.id || nextId("pay"),
    ref: b.ref || `INV-${Math.floor(Math.random()*9000)+1000}`,
    company: b.company || "Acme Co",
    amount: Number(b.amount||0),
    status: b.status || "pending",
    date: b.date || nowISO()
  };
  payments = [rec, ...payments.filter(p => p.id!==rec.id)];
  saveJson("payments.json", payments);
  res.status(201).json(rec);
});

/* ------------ refresh (no-op) ------------ */
app.post("/api/refresh", (req,res)=> res.json({ ok:true, refreshedAt: nowISO() }));

/* ------------ demo seed ------------ */
app.post("/api/demo/seed", (req,res)=>{
  const force = !!req.query.force || !!req.body?.force;
  if (!assessments.length || force) {
    assessments = [
      { id:"IFRS-S1-001", external_id:"IFRS-S1", name:"IFRS S1 General Requirements", status:"completed", score:88, updatedAt:nowISO() },
      { id:"IFRS-S2-001", external_id:"IFRS-S2", name:"IFRS S2 Climate-related Disclosures", status:"in-progress", score:76, updatedAt:nowISO() },
      { id:"ISO-50001-001", external_id:"ISO-50001", name:"ISO 50001 Energy Management", status:"completed", score:90, updatedAt:nowISO() },
      { id:"ISO-14001-001", external_id:"ISO-14001", name:"ISO 14001 Environmental", status:"completed", score:84, updatedAt:nowISO() },
      { id:"ISO-45001-001", external_id:"ISO-45001", name:"ISO 45001 Health & Safety", status:"in-progress", score:73, updatedAt:nowISO() },
      { id:"ISO-27001-001", external_id:"ISO-27001", name:"ISO 27001 Information Security", status:"completed", score:92, updatedAt:nowISO() },
      { id:"GRI-001", external_id:"GRI", name:"GRI Sustainability Reporting", status:"completed", score:81, updatedAt:nowISO() },
    ];
    saveJson("assessments.json", assessments);
  }
  if (!payments.length || force) {
    payments = [
      { id: nextId("pay"), ref:"INV-1001", company:"Contoso", amount: 15500, status:"paid",    date: nowISO() },
      { id: nextId("pay"), ref:"INV-1002", company:"Fabrikam", amount:  8200, status:"overdue", date: nowISO() },
      { id: nextId("pay"), ref:"INV-1003", company:"Northwind",amount: 12999, status:"pending", date: nowISO() },
    ];
    saveJson("payments.json", payments);
  }
  res.json({ ok:true, seeded:true, counts:{ assessments:assessments.length, payments:payments.length } });
});

/* ------------ start ------------ */
app.listen(PORT, ()=> console.log(`[api] listening on ${PORT} (CORS ${ORIGIN})`));