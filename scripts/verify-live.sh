#!/usr/bin/env bash
set -euo pipefail
API_URL="${1:-}"
WEB_URL="${2:-https://esgnavigator-ai.vercel.app}"
err(){ printf '❌ %s\n' "$*" >&2; }; ok(){ printf '✅ %s\n' "$*"; }; warn(){ printf '⚠️  %s\n' "$*"; }
trim(){ printf '%s' "${1%/}"; }
WEB_URL="$(trim "$WEB_URL")"; API_URL="$(trim "${API_URL:-}")"

# Auto-detect API from uptime if missing
if [[ -z "$API_URL" ]]; then
  if command -v jq >/dev/null 2>&1; then
    API_URL="$(curl -fsS "$WEB_URL/api/internal/uptime" | jq -r '.apiUrl // empty' || true)"
  else
    API_URL="$(curl -fsS "$WEB_URL/api/internal/uptime" 2>/dev/null | sed -n 's/.*"apiUrl"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1 || true)"
  fi
fi

[[ -z "$API_URL" ]] && { err "Could not determine API_URL. Re-run with: bash scripts/verify-live.sh https://<app>.up.railway.app"; exit 2; }
[[ "$API_URL" =~ ^https?:// ]] || { err "API_URL must start with http(s):// (got: $API_URL)"; exit 2; }
if printf '%s' "$API_URL" | grep -q '[<>]'; then err "API_URL contains placeholders <...>"; exit 2; fi
printf 'WEB_URL=%s\nAPI_URL=%s\n' "$WEB_URL" "$API_URL"

# Web
code=$(curl -s -o /dev/null -w '%{http_code}' "$WEB_URL" || true)
[[ "$code" =~ ^(2|3)[0-9][0-9]$ ]] && ok "Web reachable ($code)" || { err "Web HTTP $code at $WEB_URL"; exit 1; }

# API health
health_ok=0
for p in /health /api/health /v1/health / ; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "${API_URL}${p}" || true)
  if [[ "$code" =~ ^(2|3)[0-9][0-9]$ ]]; then ok "API health ${p} ($code)"; health_ok=1; break; fi
done
[[ "$health_ok" -eq 1 ]] || { err "No working health endpoint at $API_URL"; printf 'Hint: expose GET /health → {\"ok\":true}\n'; exit 1; }

# Sync via uptime
ujson="$(curl -fsS "$WEB_URL/api/internal/uptime" || true)"
if [[ -z "$ujson" ]]; then
  warn "No uptime at $WEB_URL/api/internal/uptime (non-fatal)."
else
  if command -v jq >/dev/null 2>&1; then api_from_uptime="$(printf '%s' "$ujson" | jq -r '.apiUrl // empty')"
  else api_from_uptime="$(printf '%s' "$ujson" | sed -n 's/.*"apiUrl"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n1)"; fi
  if [[ -n "$api_from_uptime" ]]; then
    if [[ "${api_from_uptime%/}" == "${API_URL%/}" ]]; then ok "Vercel NEXT_PUBLIC_API_URL matches Railway"
    else
      err "NEXT_PUBLIC_API_URL mismatch: Vercel='${api_from_uptime}' vs Railway='${API_URL}'"
      printf 'Fix: vercel env update NEXT_PUBLIC_API_URL production (set to %s) && vercel --yes --prod\n' "$API_URL"
      exit 1
    fi
  else
    warn "uptime JSON missing apiUrl (non-fatal)."
  fi
fi

# CORS preflight
hdrs=$(curl -s -D - -o /dev/null -X OPTIONS "${API_URL}/health" \
  -H "Origin: ${WEB_URL}" \
  -H "Access-Control-Request-Method: GET" \
  --max-time 15 || true)
allow=$(printf '%s' "$hdrs" | tr -d '\r' | awk -F': ' 'tolower($1)=="access-control-allow-origin"{print $2}' | tail -n1)
if [[ -n "$allow" && ( "$allow" == "$WEB_URL" || "$allow" == "*" ) ]]; then
  ok "CORS allowed (Access-Control-Allow-Origin: ${allow})"
else
  warn "CORS not explicit (Allow-Origin: '${allow:-<none>}')."
  printf 'Set on Railway: ALLOWED_ORIGINS=%s,https://www.esgnavigator.ai,https://esgnavigator.ai\n' "$WEB_URL"
fi

ok "Live verification complete."
