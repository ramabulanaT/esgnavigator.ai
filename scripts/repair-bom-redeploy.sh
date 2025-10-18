#!/usr/bin/env bash
set -euo pipefail

PROJECT="esgnavigator-ai"
WEB_ALIAS="https://${PROJECT}.vercel.app"
API_ARG="${1:-}"   # optional: pass real Railway URL

err(){ printf '❌ %s\n' "$*" >&2; }
ok(){  printf '✅ %s\n' "$*"; }
warn(){ printf '⚠️  %s\n' "$*"; }

# Guards
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { err "Run inside your repo root"; exit 1; }
[ -f package.json ] || { err "package.json missing in $(pwd)"; exit 1; }

# 2) Strip UTF-8 BOM and CRLF on critical files
fix_file(){ f="$1"; [ -f "$f" ] || return 0
  # Remove BOM only if on very first byte
  perl -i -0777 -pe 's/^\x{FEFF}//;' "$f"
  # Normalize CRLF -> LF safely
  sed -i 's/\r$//' "$f"
}
fix_file package.json
fix_file vercel.json
fix_file package-lock.json

# 3) Validate JSON parses
node -e 'JSON.parse(require("fs").readFileSync("package.json","utf8"))' || { err "package.json invalid after cleanup"; exit 1; }
[ -f vercel.json ] && node -e 'JSON.parse(require("fs").readFileSync("vercel.json","utf8"))' >/dev/null 2>&1 || true
ok "JSON validated"

# 4) Commit cleanup (safe)
git add package.json vercel.json package-lock.json 2>/dev/null || true
git commit -m "chore: strip UTF-8 BOM + CRLF; fix prod deploy" >/dev/null 2>&1 || true
git push origin HEAD >/dev/null 2>&1 || true

# 5) Ensure Vercel linked
command -v vercel >/dev/null 2>&1 || { err "Install Vercel CLI: npm i -g vercel"; exit 1; }
vercel link --project "${PROJECT}" --yes >/dev/null || true

# 6) Decide API URL (prefer arg, then env, else skip)
API_URL=""
if [[ -n "${API_ARG}" ]] && [[ "${API_ARG}" =~ ^https?:// ]] && ! printf '%s' "$API_ARG" | grep -q '<'; then
  API_URL="${API_ARG%/}"
elif [[ -n "${RAILWAY_URL:-}" ]] && [[ "${RAILWAY_URL}" =~ ^https?:// ]] && ! printf '%s' "$RAILWAY_URL" | grep -q '<'; then
  API_URL="${RAILWAY_URL%/}"
fi

# 7) Update Vercel envs (no trailing newline)
printf '%s' "production" | vercel env add    NEXT_PUBLIC_ENV production 2>/dev/null || true
printf '%s' "production" | vercel env update NEXT_PUBLIC_ENV production --yes 2>/dev/null || true
if [[ -n "$API_URL" ]]; then
  printf '%s' "$API_URL" | vercel env add    NEXT_PUBLIC_API_URL production 2>/dev/null || true
  printf '%s' "$API_URL" | vercel env update NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
  ok "NEXT_PUBLIC_API_URL → $API_URL"
else
  warn "No real API URL provided/detected; keeping existing value (frontend still deploys)."
fi

# 8) Deploy & alias
vercel --yes --prod
LATEST="$(vercel ls "${PROJECT}" --prod | awk '/Ready/ {print $2; exit}' || true)"
[ -n "$LATEST" ] && vercel alias set "$LATEST" "${PROJECT}.vercel.app" >/dev/null || true
ok "Frontend live → ${WEB_ALIAS}"

# 9) Verify (web + api if known)
echo "→ HEAD ${WEB_ALIAS}"
curl -I --max-time 15 "${WEB_ALIAS}" || true

echo "→ Uptime ${WEB_ALIAS}/api/internal/uptime"
curl -s --max-time 15 "${WEB_ALIAS}/api/internal/uptime" || true
echo

if [[ -n "$API_URL" ]]; then
  echo "→ API health @ ${API_URL}"
  for p in /health /api/health /v1/health /; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "${API_URL}${p}" || true)"
    if [[ "$code" =~ ^(2|3)[0-9][0-9]$ ]]; then
      ok "Health ${p} ($code)"; break
    fi
  done

  echo "→ CORS preflight (Origin=${WEB_ALIAS})"
  curl -i -X OPTIONS --max-time 15 "${API_URL}/health" \
    -H "Origin: ${WEB_ALIAS}" \
    -H "Access-Control-Request-Method: GET" | sed -n '1,20p' || true
fi

echo "ALLOWED_ORIGINS=${WEB_ALIAS},https://www.esgnavigator.ai,https://esgnavigator.ai"
