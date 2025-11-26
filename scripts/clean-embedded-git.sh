#!/usr/bin/env bash
set -euo pipefail

DRY=0; DO_COMMIT=0; QUIET=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY=1; shift ;;
    --commit) DO_COMMIT=1; shift ;;
    --quiet) QUIET=1; shift ;;
    -h|--help) cat <<'H'; exit 0
Find and untrack embedded git repos inside this repo (keep files); append to .gitignore.

Usage: scripts/clean-embedded-git.sh [--dry-run] [--commit] [--quiet]
H
    ;;
    *) echo "Unknown arg: $1" >&2; exit 64;;
  esac
done

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { echo "Not a git repo."; exit 2; }
tmp="$(mktemp)"; trap 'rm -f "$tmp"' EXIT

# collect nested .git dirs excluding the root .git
find . -type d -name .git -not -path "./.git" -print0 \
  | xargs -0 -n1 dirname \
  | sed 's|^\./||' \
  | sort -u > "$tmp"

if [[ ! -s "$tmp" ]]; then
  [[ "$QUIET" = "1" ]] || echo "No embedded git repos found."
  exit 0
fi

[[ "$DRY" = "1" ]] && { echo "Would untrack these paths:"; cat "$tmp"; exit 0; }

# append to .gitignore (once)
touch .gitignore
{
  echo "# embedded git dirs (auto-added)"
  while IFS= read -r p; do printf "%s/\n" "$p"; done < "$tmp"
} >> .gitignore

# untrack from index (keep working tree)
xargs -a "$tmp" -I{} git rm -r --cached "{}"

if [[ "$DO_COMMIT" = "1" ]]; then
  git add .gitignore
  git commit -m "chore: untrack embedded git dirs and ignore them" || true
fi

[[ "$QUIET" = "1" ]] || echo "Done. Consider: git commit -m 'chore: untrack embedded git dirs' && git push"
