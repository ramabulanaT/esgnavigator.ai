export type ProxyConfig = { apiUrl: string; timeoutMs: number; forwardHeaders: string[]; };

export function getProxyConfig(env = process.env): ProxyConfig {
  const apiUrl = env.API_URL;
  if (!apiUrl) throw new Error("API_URL is required");
  const timeoutMs = Number.parseInt(env.PROXY_TIMEOUT_MS ?? "10000", 10);
  const forwardHeaders = (env.PROXY_FORWARD_HEADERS ?? "authorization")
    .split(",").map(h => h.trim().toLowerCase()).filter(Boolean);
  return { apiUrl, timeoutMs, forwardHeaders };
}

// why: restrict to backend API surface only
export function assertAllowedPath(segs: string[]): void {
  if (!segs.length || segs[0] !== "api") throw new Error("FORBIDDEN_PATH");
}

export function buildTargetUrl(reqUrl: URL, segs: string[], apiBase: string): URL {
  const base = new URL(apiBase.endsWith("/") ? apiBase : apiBase + "/");
  const p = segs.join("/").replace(/^\/+/, "");
  const out = new URL(p, base);
  out.search = reqUrl.search;
  return out;
}

// why: forward minimal/safe headers; never forward cookies
export function pickForwardHeaders(incoming: Headers, allow: string[]): Headers {
  const out = new Headers();
  for (const [k, v] of incoming.entries()) {
    const lk = k.toLowerCase();
    if (lk === "cookie" || lk === "host" || lk === "connection" || lk === "transfer-encoding") continue;
    if (allow.includes(lk)) out.set(k, v);
    if (lk === "content-type" || lk === "accept" || lk === "accept-encoding") out.set(k, v);
  }
  out.set("x-forwarded-proto", "https");
  return out;
}
