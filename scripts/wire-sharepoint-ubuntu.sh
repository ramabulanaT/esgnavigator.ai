#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(pwd)"
API_DIR="railway-api"

echo "→ Creating/refreshing API at: $API_DIR"
mkdir -p "$API_DIR"
cd "$API_DIR"

# package.json (ESM + start script)
if [ ! -f package.json ]; then
  cat > package.json <<'JSON'
{
  "name": "esg-railway-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node index.js"
  }
}
JSON
else
  # Ensure ESM & start present
  npm pkg set type=module >/dev/null
  npm pkg set scripts.start="node index.js" >/dev/null
fi

echo "→ Installing deps…"
npm i express cors @azure/identity @microsoft/microsoft-graph-client @microsoft/microsoft-graph-client/authProviders/azureTokenCredentials >/dev/null

echo "→ Writing sharepoint.js"
cat > sharepoint.js <<'JS'
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from "@azure/identity";

// Node 18+ has fetch, but keep this guard if needed.
if (typeof fetch !== 'function') {
  global.fetch = (await import('node-fetch')).default;
}

const tenantId = process.env.TENANT_ID;
const clientId = process.env.SP_CLIENT_ID;
const clientSecret = process.env.SP_CLIENT_SECRET;

if (!tenantId || !clientId || !clientSecret) {
  console.warn("[sharepoint] Missing TENANT_ID/SP_CLIENT_ID/SP_CLIENT_SECRET");
}

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ["https://graph.microsoft.com/.default"]
});

const graph = Client.initWithMiddleware({ authProvider });

export async function resolveSite({ hostname, sitePath, search }) {
  if (hostname && sitePath) return graph.api(`/sites/${hostname}:${sitePath}`).get();
  if (search) {
    const res = await graph.api(`/sites`).query({ search }).get();
    return res.value || [];
  }
  throw new Error("Provide hostname+sitePath or ?search=term");
}

async function getSiteDriveId(siteId) {
  const drive = await graph.api(`/sites/${siteId}/drive`).get();
  return drive.id;
}

export async function listChildren(siteId, path = "/") {
  const driveId = await getSiteDriveId(siteId);
  const enc = encodeURI(path);
  const res = await graph.api(`/drives/${driveId}/root:${enc}:/children`).get();
  return res.value || [];
}

export async function downloadFileStream(siteId, path) {
  const driveId = await getSiteDriveId(siteId);
  const enc = encodeURI(path);
  return graph.api(`/drives/${driveId}/root:${enc}:/content`).getStream();
}

export async function uploadSmallFile(siteId, path, buffer) {
  const driveId = await getSiteDriveId(siteId);
  const enc = encodeURI(path);
  return graph.api(`/drives/${driveId}/root:${enc}:/content`).put(buffer);
}
JS

echo "→ Writing index.js (Express API)"
cat > index.js <<'JS'
import express from "express";
import cors from "cors";
import {
  resolveSite,
  listChildren,
  downloadFileStream,
  uploadSmallFile
} from "./sharepoint.js";

const app = express();
app.use(express.json({ limit: "10mb" }));

const ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",").map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin || ORIGINS.length === 0 || ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, false);
  }
}));

app.get("/health", (req, res) =>
  res.json({ ok: true, service: "esgnavigator-api", ts: new Date().toISOString() })
);

app.get("/sp/site", async (req, res) => {
  try {
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH,
      search: req.query.search
    });
    res.json(site);
  } catch (e) { res.status(500).json({ ok:false, error: e.message }); }
});

app.get("/sp/list", async (req, res) => {
  try {
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH
    });
    const path = req.query.path || "/";
    const items = await listChildren(site.id, path);
    res.json({ ok:true, items });
  } catch (e) { res.status(500).json({ ok:false, error: e.message }); }
});

app.get("/sp/download", async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) return res.status(400).json({ error: "path query required" });
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH
    });
    const stream = await downloadFileStream(site.id, path);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(path.split('/').pop())}"`);
    stream.pipe(res);
  } catch (e) { res.status(500).json({ ok:false, error: e.message }); }
});

app.post("/sp/upload", express.raw({ type: "*/*", limit: "8mb" }), async (req, res) => {
  try {
    const path = req.query.path;
    if (!path) return res.status(400).json({ error: "path query required" });
    const bodyBuf = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    if (!bodyBuf.length) return res.status(400).json({ error: "empty body" });
    const site = await resolveSite({
      hostname: process.env.SP_SITE_HOSTNAME,
      sitePath: process.env.SP_SITE_PATH
    });
    const r = await uploadSmallFile(site.id, path, bodyBuf);
    res.json({ ok:true, id: r.id, name: r.name, size: r.size });
  } catch (e) { res.status(500).json({ ok:false, error: e.message }); }
});

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => console.log("ESG API listening", port));
JS

cd "$REPO_ROOT"
git add "$API_DIR"
git commit -m "feat(api): SharePoint integration (Ubuntu wiring)" || true

echo "→ Done. Next:"
echo "   1) Push:      git push origin main"
echo "   2) Railway:   Root Directory = railway-api; set envs; redeploy"
echo "   3) Vercel:    NEXT_PUBLIC_API_URL = https://<your-app>.up.railway.app ; redeploy"
