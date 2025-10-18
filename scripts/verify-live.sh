#!/usr/bin/env bash
set -euo pipefail

API_URL="${1:-}"
WEB_URL="${2:-https://esgnavigator-ai.vercel.app}"

err(){ printf '❌ %s\n' "$*" >&2; }
ok(){  printf '✅ %s\n' "$*"; }
warn(){ printf '⚠️  %s\n' "$*"; }

if [[ -z "${API_URL}" ]]; then err "Usage: $0 <API_URL> [WEB_URL]"; exit 2; fi
case "$API_URL" in http://*|https://*) ;; *) err "API_URL must start with http(s)://"; exit 2;; esac
if [[ "$API_URL" == *"<"* || "$API_URL" == *">"* ]]; then err "API_URL contains placeholders <...>"; exit 2; fi

echo "WEB_URL=${WEB_URL}"
echo "API_URL=${API_URL}"

# 1) Web root
code=$(curl -s -o /dev/null -w '%{http_code}' "${WEB_URL}")
[[ "$code" =~ ^2|3 ]] && ok "Web reachable (${code})" || { err "Web HTTP ${code}"; exit 1; }

# 2) API health (common paths)
health_ok=0
for p in /health /api/health /v1/health / ; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "${API_URL}${p}" || true)
  if [[ "$code" =~ ^2|3 ]]; then ok "API health ${p} (${code})"; health_ok=1; break; fi
done
[[ "$health_ok" -eq 1 ]] || { err "No working health endpoint"; exit 1; }

# 3) Sync: Vercel uptime must report the same API_URL
ujson=$(curl -fsS "${WEB_URL}/api/internal/uptime" || true)
if [[ -z "$ujson" ]]; then
  warn "/api/internal/uptime not reachable (non-fatal)"
else
  api_from_uptime=$(printf '%s' "$ujson" | sed -n 's/.*"apiUrl"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)
  if [[ -n "$api_from_uptime" ]]; then
    if [[ "${api_from_uptime%/}" == "${API_URL%/}" ]]; then
      ok "Vercel NEXT_PUBLIC_API_URL matches Railway"
    else
      err "NEXT_PUBLIC_API_URL mismatch: Vercel='${api_from_uptime}' vs Railway='${API_URL}'"
      exit 1
    fi
  else
    warn "uptime JSON missing apiUrl (non-fatal)"
  fi
fi

# 4) CORS preflight (Origin = Vercel alias)
hdrs=$(curl -s -D - -o /dev/null -X OPTIONS "${API_URL}/health" \
  -H "Origin: ${WEB_URL}" \
  -H "Access-Control-Request-Method: GET" || true)
allow=$(printf '%s' "$hdrs" | tr -d '\r' | awk -F': ' 'tolower($1)=="access-control-allow-origin"{print $2}' | tail -n1)
if [[ -n "$allow" && ( "$allow" == "$WEB_URL" || "$allow" == "*" ) ]]; then
  ok "CORS allowed (Allow-Origin: ${allow})"
else
  warn "CORS not explicit (Allow-Origin: '${allow:-<none>}'). Add ${WEB_URL} to ALLOWED_ORIGINS and redeploy API."
fi

ok "Live verification complete."
