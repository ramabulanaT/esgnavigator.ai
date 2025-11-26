import { NextResponse } from "next/server";
import { assertAllowedPath, buildTargetUrl, getProxyConfig, pickForwardHeaders } from "../_proxy";
export const runtime = "nodejs";

async function proxy(req: Request, context: { params: { path: string[] } }) {
  const method = req.method.toUpperCase();
  const ALLOW = new Set(["GET","POST","PUT","PATCH","DELETE","OPTIONS"]);
  if (!ALLOW.has(method)) return new NextResponse("Method Not Allowed",{ status:405, headers:{ "cache-control":"no-store" }});

  const segs = Array.isArray(context?.params?.path) ? context.params.path : [];
  try { assertAllowedPath(segs); } catch { return NextResponse.json({ ok:false, error:"FORBIDDEN_PATH" },{ status:400, headers:{ "cache-control":"no-store" }}); }

  let cfg;
  try { cfg = getProxyConfig(process.env); } catch (e:any) { return NextResponse.json({ ok:false, error:e?.message ?? "Bad config" },{ status:500, headers:{ "cache-control":"no-store" }}); }

  const reqUrl = new URL(req.url);
  const target = buildTargetUrl(reqUrl, segs, cfg.apiUrl);
  const apiHost = new URL(cfg.apiUrl).host;
  if (target.host !== apiHost) return NextResponse.json({ ok:false, error:"SSRF_GUARD" },{ status:400, headers:{ "cache-control":"no-store" }});

  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
  const canBody = ["POST","PUT","PATCH","DELETE"].includes(method);
  const upstreamHeaders = pickForwardHeaders(req.headers, cfg.forwardHeaders);

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), { method, headers: upstreamHeaders, body: canBody ? req.body : undefined, signal: controller.signal, cache: "no-store", redirect: "follow" });
  } catch (err:any) {
    clearTimeout(timer);
    const code = err?.name === "AbortError" ? "UPSTREAM_TIMEOUT" : "UPSTREAM_ERROR";
    return NextResponse.json({ ok:false, error:code },{ status:504, headers:{ "cache-control":"no-store" }});
  } finally { clearTimeout(timer); }

  const respHeaders = new Headers();
  const ct = upstream.headers.get("content-type"); if (ct) respHeaders.set("content-type", ct);
  const cl = upstream.headers.get("content-length"); if (cl) respHeaders.set("content-length", cl);
  respHeaders.set("cache-control", "no-store");
  return new NextResponse(upstream.body, { status: upstream.status, headers: respHeaders });
}

export async function GET(req: Request, ctx: { params: { path: string[] } }) { return proxy(req, ctx); }
export async function POST(req: Request, ctx: { params: { path: string[] } }) { return proxy(req, ctx); }
export async function PUT(req: Request, ctx: { params: { path: string[] } }) { return proxy(req, ctx); }
export async function PATCH(req: Request, ctx: { params: { path: string[] } }) { return proxy(req, ctx); }
export async function DELETE(req: Request, ctx: { params: { path: string[] } }) { return proxy(req, ctx); }
export async function OPTIONS(req: Request, ctx: { params: { path: string[] } }) { return proxy(req, ctx); }
