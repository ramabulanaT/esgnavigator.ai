import express from "express";
import cors from "cors";
import {
  resolveSite,
  listChildren,
  downloadFileStream,
  uploadSmallFile,
} from "./sharepoint.js";

const app = express();

// CORS allowlist
const ALLOW = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOW.length === 0 || ALLOW.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
}));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.text({ type: ["text/*","application/graphql","application/x-www-form-urlencoded"], limit: "1mb" }));

// Health
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "esgnavigator-api", env: process.env.NODE_ENV || "development", ts: new Date().toISOString() });
});
app.get("/api/health", (_req, res) => res.redirect(307, "/health"));

// Echo (IMPORTANT: route path is a STRING, not /regex/)
app.post("/api/internal/echo", (req, res) => {
  const ct = req.get("content-type") || "";
  if (ct.includes("application/json")) return res.json({ ok: true, body: req.body, headers: req.headers });
  return res.type("text/plain").send(req.body ?? "");
});

// ===== SharePoint (optional; only works if env vars are set) =====
app.get("/sp/site", async (req, res) => {
  try {
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH,
      search: req.query.search,
    });
    res.json(site);
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get("/sp/list", async (req, res) => {
  try {
    const site = await resolveSite({ hostname: process.env.SP_SITE_HOSTNAME, sitePath: process.env.SP_SITE_PATH });
    const path = req.query.path || "/";
    const items = await listChildren(site.id, path);
    res.json({ ok: true, items });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get("/sp/download", async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) return res.status(400).json({ error: "query ?path=/Shared%20Documents/file.ext required" });
    const site = await resolveSite({ hostname: process.env.SP_SITE_HOSTNAME, sitePath: process.env.SP_SITE_PATH });
    const stream = await downloadFileStream(site.id, path);
    const name = decodeURIComponent(path.split("/").pop() || "download.bin");
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(name)}"`);
    stream.pipe(res);
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/sp/upload", express.raw({ type: "*/*", limit: "8mb" }), async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) return res.status(400).json({ error: "query ?path=/Shared%20Documents/file.ext required" });
    const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    if (!buf.length) return res.status(400).json({ error: "empty body" });
    const site = await resolveSite({ hostname: process.env.SP_SITE_HOSTNAME, sitePath: process.env.SP_SITE_PATH });
    const r = await uploadSmallFile(site.id, path, buf);
    res.json({ ok: true, id: r.id, name: r.name, size: r.size });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Bind 0.0.0.0 for Railway
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => console.log(`[api] listening on ${port}`));
