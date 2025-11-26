import { NextResponse } from "next/server";
const FALLBACK_FLIP = "2025-10-26T00:00:00Z";
function computeRedirectCode(): 307 | 308 {
  const mode = (process.env.REDIRECT_MODE || "").toLowerCase();
  if (mode === "permanent") return 308;
  if (mode === "temporary") return 307;
  const flipIso = process.env.REDIRECT_FLIP_TS || FALLBACK_FLIP;
  const t = Date.parse(flipIso); const f = Number.isNaN(t) ? Date.parse(FALLBACK_FLIP) : t;
  return Date.now() >= f ? 308 : 307;
}
export const runtime = "nodejs";
export async function GET() {
  const code = computeRedirectCode();
  return NextResponse.json({
    ok: true,
    code,
    mode: code === 308 ? "permanent" : "temporary",
    nowIso: new Date().toISOString(),
    flipTs: process.env.REDIRECT_FLIP_TS || FALLBACK_FLIP,
    overrides: {
      REDIRECT_MODE: process.env.REDIRECT_MODE || null,
      REDIRECT_FLIP_TS: process.env.REDIRECT_FLIP_TS || null,
      VERCEL_ENV: process.env.VERCEL_ENV || null
    }
  }, { headers: { "cache-control": "no-store" }});
}
