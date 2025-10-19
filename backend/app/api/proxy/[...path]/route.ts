import { NextResponse } from "next/server";
import { assertAllowedPath, buildTargetUrl, getProxyConfig, pickForwardHeaders } from "../_proxy";
export const runtime = "node";

async function handle(req: Request, ctx: { params: { path?: string[] } }) {
  const method = req.method.toUpperCase();
  const ALLOW = new Set(["GET","POST","PUT","PATCH","DELETE","OPTIONS"]);
  if (!ALLOW.has(method)) return new NextResponse("Method Not Allowed",{ status:405, headers:{ "cache-control":"no-store" }});

  const segs = ctx.params.path ?? [];
  try { assertAllowedPath(segs); } catch { return NextResponse.json({ ok:false, error:"FORBIDDEN_PATH" },{ status:400, headers:{ "cache-control":"no-store" }}); }

  let cfg; try { cfg = getProxyConfig(process.env); }
  catch (e:any) { return NextResponse.json({ ok:false, error:e?.message ?? "Bad config" },{ status:500, headers:{ "cache-control":"no-store" }}); }

  const reqUrl = new URL(req.url);
  const target = buildTargetUrl(reqUrl, segs, cfg.apiUrl);

  // SSRF guard
  const apiHost = new URL(cfg.apiUrl).host;
  if (target.host !== apiHost) return NextResponse.json({ ok:false, error:"SSRF_GUARD" },{ status:400, headers:{ "cache-control":"no-store" }});

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);

  const canBody = ["POST","PUT","PATCH","DELETE"].includes(method);
  const upstreamHeaders = pickForwardHeaders(req.headers, cfg.forwardHeaders);

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      method,
      headers: upstreamHeaders,
      body: canBody ? req.body : undefined,
      signal: controller.signal,
      cache: "no-store",
      redirect: "follow"
    });
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
export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE, handle as OPTIONS };
