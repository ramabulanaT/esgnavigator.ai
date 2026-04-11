import express from "express";
import cors from "cors";
import {
  resolveSite,
  listChildren,
  downloadFileStream,
  uploadSmallFile,
} from "./sharepoint.js";

const app = express();

// ─── CORS allowlist ────────────────────────────────────────────────────────────
const ALLOW = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || ALLOW.length === 0 || ALLOW.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
}));

// ─── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.text({
  type: ["text/*", "application/graphql", "application/x-www-form-urlencoded"],
  limit: "1mb"
}));

// ─── Lambda Base URL ───────────────────────────────────────────────────────────
const LAMBDA_BASE =
  process.env.LAMBDA_BASE_URL ||
  "https://cui5sohwji.execute-api.us-east-1.amazonaws.com/dev/agents";

// ─── Helper: Proxy to Lambda ───────────────────────────────────────────────────
async function proxyToLambda(lambdaPath, req, res) {
  try {
    const url = `${LAMBDA_BASE}${lambdaPath}`;
    console.log(`[PROXY] ${req.method} ${req.path} → ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-source": "intellimat-railway-proxy",
        "x-request-id": `req-${Date.now()}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log(`[PROXY] Response status: ${response.status}`);
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`[PROXY ERROR] ${req.path}:`, error.message);
    res.status(502).json({
      error: "Bad Gateway",
      message: "Lambda endpoint unreachable",
      path: req.path,
      ts: new Date().toISOString(),
    });
  }
}

// ─── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "IntelliMat ESG Navigator",
    status: "operational",
    env: process.env.NODE_ENV || "development",
    ts: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => res.redirect(307, "/health"));

// ─── Echo ──────────────────────────────────────────────────────────────────────
app.post("/api/internal/echo", (req, res) => {
  const ct = req.get("content-type") || "";
  if (ct.includes("application/json"))
    return res.json({ ok: true, body: req.body, headers: req.headers });
  return res.type("text/plain").send(req.body ?? "");
});

// ─── IntelliMat Agent Routes (Proxy → AWS Lambda) ─────────────────────────────

// Regulatory Intelligence Agent
app.post("/v1/regulatory-intelligence", async (req, res) => {
  await proxyToLambda("/regulatory-intelligence", req, res);
});

// Evidence Retrieval Agent
app.post("/v1/evidence-retrieval", async (req, res) => {
  await proxyToLambda("/evidence-retrieval", req, res);
});

// Reporting Agent
app.post("/v1/reporting", async (req, res) => {
  await proxyToLambda("/reporting", req, res);
});

// Orchestrator Agent — chains all three agents in sequence
app.post("/v1/orchestrate", async (req, res) => {
  await proxyToLambda("/orchestrate", req, res);
});

// ─── OpenAPI Spec (for WXO tool discovery) ────────────────────────────────────
app.get("/openapi.json", (_req, res) => {
  res.json({
    openapi: "3.0.0",
    info: {
      title: "IntelliMat ESG Navigator API",
      version: "1.0.0",
      description: "TIS IntelliMat multi-agent API for ESG regulatory intelligence, evidence retrieval, and reporting.",
    },
    servers: [{ url: "https://esg-agents.esgnavigator.ai" }],
    paths: {
      "/health": {
        get: {
          summary: "Health check",
          responses: { 200: { description: "Service operational" } },
        },
      },
      "/v1/regulatory-intelligence": {
        post: {
          summary: "Retrieve applicable regulatory obligations",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    sector: { type: "string" },
                    jurisdiction: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Regulatory intelligence result" } },
        },
      },
      "/v1/evidence-retrieval": {
        post: {
          summary: "Search for matching evidence",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    framework: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Evidence retrieval result" } },
        },
      },
      "/v1/reporting": {
        post: {
          summary: "Draft ESG assessment output",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    assessment_id: { type: "string" },
                    framework: { type: "string" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Report generation result" } },
        },
      },
      "/v1/orchestrate": {
        post: {
          summary: "Full compliance triage — chains all three agents",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: { type: "string" },
                    sector: { type: "string" },
                    jurisdiction: { type: "string" },
                    framework: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Orchestrated compliance result" } },
        },
      },
    },
  });
});

// ─── SharePoint (optional — only active if SP env vars are set) ────────────────
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
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH,
    });
    const path = req.query.path || "/";
    const items = await listChildren(site.id, path);
    res.json({ ok: true, items });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get("/sp/download", async (req, res) => {
  try {
    const path = req.query.path;
    if (!path)
      return res.status(400).json({ error: "query ?path=/Shared%20Documents/file.ext required" });
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH,
    });
    const stream = await downloadFileStream(site.id, path);
    const name = decodeURIComponent(path.split("/").pop() || "download.bin");
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(name)}"`);
    stream.pipe(res);
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/sp/upload", express.raw({ type: "*/*", limit: "8mb" }), async (req, res) => {
  try {
    const path = req.query.path;
    if (!path)
      return res.status(400).json({ error: "query ?path=/Shared%20Documents/file.ext required" });
    const buf = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    if (!buf.length) return res.status(400).json({ error: "empty body" });
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH,
    });
    const r = await uploadSmallFile(site.id, path, buf);
    res.json({ ok: true, id: r.id, name: r.name, size: r.size });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// ─── 404 Fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.path,
    available_routes: [
      "GET  /health",
      "GET  /openapi.json",
      "POST /v1/regulatory-intelligence",
      "POST /v1/evidence-retrieval",
      "POST /v1/reporting",
      "POST /v1/orchestrate",
      "GET  /sp/site",
      "GET  /sp/list",
      "GET  /sp/download",
      "POST /sp/upload",
    ],
  });
});

// ─── Start — bind 0.0.0.0 for Railway ─────────────────────────────────────────
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`[IntelliMat] ESG Navigator API listening on port ${port}`);
  console.log(`[IntelliMat] Lambda base: ${LAMBDA_BASE}`);
});
