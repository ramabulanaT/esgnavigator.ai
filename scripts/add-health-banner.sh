#!/usr/bin/env bash
set -euo pipefail
APP="src/App.jsx"
IMPORT_LINE="import HealthBanner from './components/HealthBanner.jsx';"

if [[ ! -f "$APP" ]]; then
  echo "ℹ️  $APP not found; skipping automatic injection."; exit 0
fi

# 1) add import at top if missing
if ! grep -q "HealthBanner" "$APP"; then
  awk -v imp="$IMPORT_LINE" 'NR==1{print imp} {print}' "$APP" > "$APP.__new" && mv "$APP.__new" "$APP"
fi

# 2) inject component after first opening container tag
if ! grep -q "<HealthBanner" "$APP"; then
  awk '
    BEGIN{ins=0}
    /<div[^>]*>|<main[^>]*>|<header[^>]*>/ && ins==0 { print; print "      <HealthBanner/>"; ins=1; next }
    { print }
  ' "$APP" > "$APP.__new" && mv "$APP.__new" "$APP"
fi

echo "✅ Injected <HealthBanner/> into $APP"
