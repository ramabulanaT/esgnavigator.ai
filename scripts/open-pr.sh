#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-go-live-prod}"
BASE="${2:-main}"

need() { command -v "$1" >/dev/null || { echo "Install $1"; exit 2; }; }

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Run inside repo"; exit 1; }
need gh

git fetch origin --prune
if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git checkout -b "$BRANCH"
else
  git checkout "$BRANCH"
fi

# Stage banner files if changed
git add -A
if ! git diff --cached --quiet; then
  git commit -m "feat(ui): HealthBanner + go-live PR scaffolding"
fi

git push -u origin "$BRANCH"

TITLE="Go Live: ESG Navigator – health, diagnostics, CI"
gh pr create -B "$BASE" -H "$BRANCH" -t "$TITLE" -F .github/PR_GO_LIVE.md || {
  echo "gh PR creation failed. Open a PR from $BRANCH -> $BASE manually."
  exit 1
}

echo "✅ PR opened: $(gh pr view --web --json url -q .url 2>/dev/null || echo 'opened in GitHub')"
