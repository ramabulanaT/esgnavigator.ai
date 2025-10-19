#!/usr/bin/env bash
set -euo pipefail
APP="src/App.jsx"
COMP_IMPORT="import StatusBadge from './components/StatusBadge.jsx';"
if [ ! -f "$APP" ]; then
  echo "ℹ️  $APP not found; skipping patch (app still builds)."; exit 0;
fi

# Add import if missing
if ! grep -q "StatusBadge" "$APP"; then
  awk -v imp="$COMP_IMPORT" '
    NR==1{print imp} {print}
  ' "$APP" > "$APP.__new" && mv "$APP.__new" "$APP"
fi

# Insert component near top of default export render
# Heuristic: after first <div or <main tag
if ! grep -q "<StatusBadge" "$APP"; then
  awk '
    BEGIN{ins=0}
    /<div[^>]*>|<main[^>]*>/ && ins==0 { print; print "      <StatusBadge/>"; ins=1; next }
    { print }
  ' "$APP" > "$APP.__new" && mv "$APP.__new" "$APP"
fi

echo "✅ Patched $APP with StatusBadge"
