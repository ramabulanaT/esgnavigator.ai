#!/usr/bin/env bash
set -euo pipefail

PROJECT="esgnavigator-ai"
WEB_ALIAS="https://${PROJECT}.vercel.app"
API_ARG="${1:-}"   # optional: pass your real Railway URL (https://<app>.up.railway.app)

err(){ printf '❌ %s\n' "$*" >&2; }
ok(){  printf '✅ %s\n' "$*"; }
warn(){ printf '⚠️  %s\n' "$*"; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { err "Run inside your git repo root"; exit 1; }
[ -f package.json ] || { err "package.json missing in $(pwd)"; exit 1; }

# --- 1) Strip UTF-8 BOM + CRLF using Node (safe even when JSON invalid due to BOM) ---
node <<'JS'
const fs = require('fs');
const files = ['package.json', 'vercel.json'];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  // Strip BOM at start, normalize CRLF to LF
  s = s.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  // Validate only package.json strictly; vercel.json may not exist
  if (f === 'package.json') {
    try { JSON.parse(s); } catch (e) {
      // Try one more time: remove any stray BOMs inside first line fragments
      s = s.replace(/\uFEFF/g, '');
      JSON.parse(s); // will throw again if truly invalid
    }
  } else {
    // best-effort cleanup for vercel.json if present
    try { JSON.parse(s); } catch { /* ignore parse errors here */ }
  }
  fs.writeFileSync(f, s, 'utf8');
}
JS

# Double-check parses now (hard fail if still bad)
node -e 'JSON.parse(require("fs").readFileSync("package.json","utf8"))' >/dev/null
[ -f vercel.json ] && node -e 'JSON.parse(require("fs").readFileSync("vercel.json","utf8"))' >/dev/null || true
ok "JSON cleaned and validated"

# --- 2) Commit & push (stay on current branch) ---
git add package.json vercel.json 2>/dev/null || true
git commit -m "chore: strip UTF-8 BOM + normalize line endings for prod deploy" >/dev/null 2>&1 || true
git push -u origin "$(git rev-parse --abbrev-ref HEAD)" >/dev/null 2>&1 || true
ok "Repo pushed"

# --- 3) Ensure Vercel linked ---
command -v vercel >/dev/null 2>&1 || { err "Install Vercel CLI: npm i -g vercel"; exit 1; }
vercel link --project "${PROJECT}" --yes >/dev/null || true

# --- 4) Decide API URL (arg > env > none) ---
API_URL=""
if [[ -n "${API_ARG}" ]] && [[ "${API_ARG}" =~ ^https?:// ]] && ! printf '%s' "$API_ARG" | grep -q '<'; then
  API_URL="${API_ARG%/}"
elif [[ -n "${RAILWAY_URL:-}" ]] && [[ "${RAILWAY_URL}" =~ ^https?:// ]] && ! printf '%s' "$RAILWAY_URL" | grep -q '<'; then
  API_URL="${RAILWAY_URL%/}"
fi

# --- 5) Update Vercel envs (no trailing newline) ---
printf '%s' "production" | vercel env add    NEXT_PUBLIC_ENV production 2>/dev/null || true
printf '%s' "production" | vercel env update NEXT_PUBLIC_ENV production --yes 2>/dev/null || true
if [[ -n "$API_URL" ]]; then
  printf '%s' "$API_URL" | vercel env add    NEXT_PUBLIC_API_URL production 2>/dev/null || true
  printf '%s' "$API_URL" | vercel env update NEXT_PUBLIC_API_URL production --yes 2>/dev/null || true
  ok "NEXT_PUBLIC_API_URL → $API_URL"
else
  warn "No real API URL provided/detected; keeping existing value (frontend still deploys)."
fi

# --- 6) Deploy prod + alias ---
vercel --yes --prod
LATEST="$(vercel ls "${PROJECT}" --prod | awk '/Ready/ {print $2; exit}' || true)"
[ -n "$LATEST" ] && vercel alias set "$LATEST" "${PROJECT}.vercel.app" >/dev/null || true
ok "Frontend live → ${WEB_ALIAS}"

# --- 7) Verify (Web always; API/CORS only if we have a real URL) ---
echo "→ HEAD ${WEB_ALIAS}"
curl -I --max-time 15 "${WEB_ALIAS}" || true

echo "→ Uptime ${WEB_ALIAS}/api/internal/uptime"
curl -s --max-time 15 "${WEB_ALIAS}/api/internal/uptime" || true
echo

if [[ -n "$API_URL" ]]; then
  echo "→ API health @ ${API_URL}"
  okCount=0
  for p in /health /api/health /v1/health /; do
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "${API_URL}${p}" || true)"
    if [[ "$code" =~ ^(2|3)[0-9][0-9]$ ]]; then
      ok "Health ${p} ($code)"; okCount=1; break
    fi
  done
  if [[ "$okCount" -eq 0 ]]; then warn "No working health endpoint detected at ${API_URL}"; fi

  echo "→ CORS preflight (Origin=${WEB_ALIAS})"
  curl -i -X OPTIONS --max-time 15 "${API_URL}/health" \
    -H "Origin: ${WEB_ALIAS}" \
    -H "Access-Control-Request-Method: GET" | sed -n '1,20p' || true
fi

echo "ALLOWED_ORIGINS=${WEB_ALIAS},https://www.esgnavigator.ai,https://esgnavigator.ai"
