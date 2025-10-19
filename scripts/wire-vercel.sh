#!/usr/bin/env bash
set -euo pipefail
PROJECT="esgnavigator-ai"
WEB_ALIAS="${PROJECT}.vercel.app"
API_URL="${1:-}"; API_URL="${API_URL%/}"
if [[ -z "$API_URL" || ! "$API_URL" =~ ^https?:// ]]; then
  echo "Usage: $0 https://<your-railway>.up.railway.app" >&2; exit 1;
fi
command -v vercel >/dev/null || { echo "Install vercel: npm i -g vercel" >&2; exit 1; }
vercel link --project "$PROJECT" --yes >/dev/null || true
# remove bad value then set exact value without newline
vercel env rm NEXT_PUBLIC_API_URL production --yes >/dev/null 2>&1 || true
printf '%s' "$API_URL" | vercel env add NEXT_PUBLIC_API_URL production >/dev/null 2>&1 || true
printf '%s' "$API_URL" | vercel env update NEXT_PUBLIC_API_URL production --yes >/dev/null
printf '%s' "production" | vercel env add NEXT_PUBLIC_ENV production >/dev/null 2>&1 || true
printf '%s' "production" | vercel env update NEXT_PUBLIC_ENV production --yes >/dev/null
vercel --yes --prod >/dev/null || true
LATEST="$(vercel ls "$PROJECT" --prod | awk '/Ready/ {print $2; exit}')"
[[ -n "$LATEST" ]] && vercel alias set "$LATEST" "$WEB_ALIAS" >/dev/null 2>&1 || true
echo "→ Uptime:" && curl -s "https://${WEB_ALIAS}/api/internal/uptime" && echo
echo "→ Diagnostics: https://${WEB_ALIAS}/diagnostics.html"
