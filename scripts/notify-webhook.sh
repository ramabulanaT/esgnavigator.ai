#!/usr/bin/env bash
# Why: generic Slack-compatible webhook; no external deps
set -euo pipefail
WEBHOOK="${1:-}"; TITLE="${2:-Notification}"; MSG="${3:-}"; COLOR="${4:-#111827}"
[ -z "$WEBHOOK" ] && { echo "usage: $0 <webhook-url> <title> <message> [color]" >&2; exit 2; }
payload=$(jq -nc --arg t "$TITLE" --arg m "$MSG" --arg c "$COLOR" '
  { attachments: [ { color: $c, blocks: [
      { type:"header", text:{ type:"plain_text", text:$t } },
      { type:"section", text:{ type:"mrkdwn", text:$m } }
  ] } ] }' 2>/dev/null || printf '{"text":"%s\n%s"}' "$TITLE" "$MSG")
curl -fsS -X POST -H 'Content-Type: application/json' --data "$payload" "$WEBHOOK" >/dev/null || true
