#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${BASE_URL:-https://www.esgnavigator.ai}"
HTML_PATH="${HTML_PATH:-/service-map.html}"
JSON_PATH="${JSON_PATH:-/api/internal/uptime}"
TIMEOUT="${TIMEOUT:-15}"
is_tty(){ [[ -t 1 ]]; }; ok(){ is_tty && printf "\033[32m%s\033[0m\n" "$1" || echo "$1"; }; fail(){ is_tty && printf "\033[31m%s\033[0m\n" "$1" || echo "$1"; }
u(){ local b="${1%/}"; local p="$2"; printf "%s%s\n" "$b" "$p"; }
hb(){ curl -sS --fail-with-body --max-time "$TIMEOUT" --http2 -D "$1" -o "$2" "$3"; }
status(){ grep -E '^HTTP/' "$1" | tail -n1 | sed -n 's/.* \([0-9][0-9][0-9]\).*/\1/p'; }
ctype(){ grep -i '^content-type:' "$1" | tail -n1 | cut -d' ' -f2- | tr -d '\r'; }
count_final(){ grep -E '^HTTP/' "$1" | grep -Ev 'HTTP/[0-9.]+\s+103\b' | wc -l | tr -d ' '; }
html="$(u "$BASE_URL" "$HTML_PATH")"; json="$(u "$BASE_URL" "$JSON_PATH")"
H="$(mktemp)"; B="$(mktemp)"; trap "rm -f '$H' '$B'" RETURN
hb "$H" "$B" "$html" || { fail "HTML request failed"; exit 20; }
[[ "$(count_final "$H")" == "1" ]] || { fail "Expected 1 final response"; exit 21; }
[[ "$(status "$H")" == "200" ]] || { fail "HTML status != 200"; exit 22; }
CT="$(ctype "$H")"; shopt -s nocasematch; [[ "$CT" =~ ^text/html ]] || { fail "HTML CT: $CT"; exit 23; }; shopt -u nocasematch
ok "OK(HTML): $CT $html"; trap - RETURN
H="$(mktemp)"; B="$(mktemp)"; trap "rm -f '$H' '$B'" RETURN
hb "$H" "$B" "$json" || { fail "JSON request failed"; exit 30; }
[[ "$(status "$H")" == "200" ]] || { fail "JSON status != 200"; exit 31; }
CT="$(ctype "$H")"; shopt -s nocasematch; [[ "$CT" =~ ^application/json ]] || { fail "JSON CT: $CT"; exit 32; }; shopt -u nocasematch
if command -v jq >/dev/null; then jq -e '.ok == true' < "$B" >/dev/null || { cat "$B"; fail ".ok != true"; exit 33; }
else grep -q '"ok"[[:space:]]*:[[:space:]]*true' "$B" || { cat "$B"; fail "missing ok=true"; exit 34; }
fi
ok "OK(JSON): $CT $json"; trap - RETURN
from="$(u "$BASE_URL" "${JSON_PATH}.js")"
code="$(curl -sS --max-time "$TIMEOUT" -o /dev/null -w '%{http_code}' --max-redirs 0 "$from" || true)"
loc="$(curl -sS --max-time "$TIMEOUT" -D - -o /dev/null --max-redirs 0 "$from" | awk -F': ' 'tolower($1)=="location"{print $2}' | tr -d '\r')"
case "$code" in 301|302|307|308) [[ "$loc" == "$json" || "$loc" == "$JSON_PATH" ]] || { fail "Redirect Location mismatch: $loc"; exit 41; }; ok "OK(REDIRECT): $from -> $loc ($code)";; *) fail "Expected 30x from $from, got $code"; exit 40;; esac
