#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://localhost:8080}"
USER="${USER_NAME:-admin}"
PASS="${USER_PASS:-demo123}"
CSV_PATH="${CSV_PATH:-data/assessments.csv}"
COOKIE_FILE="$(mktemp)"; trap "rm -f $COOKIE_FILE" EXIT
echo "→ Login $USER"
curl -sS -c "$COOKIE_FILE" -H 'Content-Type: application/json' -d "{\"username\":\"$USER\",\"password\":\"$PASS\"}" "$BASE/api/auth/login" | jq .
echo "→ CSRF"
CSRF=$(curl -sS -b "$COOKIE_FILE" "$BASE/api/auth/csrf" | jq -r .csrf)
[ -n "$CSRF" ] || { echo "No CSRF"; exit 1; }
if [ -f "$CSV_PATH" ]; then
  echo "→ Upload CSV"
  curl -sS -b "$COOKIE_FILE" -H "X-CSRF-Token: $CSRF" -F "file=@${CSV_PATH}" "$BASE/api/upload" | jq .
fi
echo "→ Refresh"
curl -sS -b "$COOKIE_FILE" -H "X-CSRF-Token: $CSRF" -X POST "$BASE/api/refresh" | jq .
echo "→ Assessments"
curl -sS -b "$COOKIE_FILE" "$BASE/api/assessments" | jq 'length'
