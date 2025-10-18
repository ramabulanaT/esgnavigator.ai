#!/usr/bin/env bash
set -euo pipefail
URL="${1:-http://localhost:8080}"; TIMEOUT="${2:-120}"
for i in $(seq 1 "$TIMEOUT"); do curl -fsS "$URL" >/dev/null 2>&1 && exit 0; sleep 1; done
echo "timeout waiting for $URL"; exit 1
