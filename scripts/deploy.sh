#!/usr/bin/env bash
set -euo pipefail
ROOT="/opt/esg"
STACK="$ROOT/docker/docker-compose.deploy.yml"
ENV_BASE="$ROOT/.env.prod"
ENV_CUR="$ROOT/.env.deploy"
ENV_PREV="$ROOT/.env.deploy.prev"
RELFILE="$ROOT/release.json"
need(){ command -v "$1" >/dev/null 2>&1 || { echo "Missing $1"; exit 1; }; }
need docker; need jq
if ! command -v cosign >/dev/null 2>&1; then
  curl -sSL -o /usr/local/bin/cosign https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64 && chmod +x /usr/local/bin/cosign
fi
[ -f "$RELFILE" ] || { echo "release.json missing"; exit 1; }
API_TAG=$(jq -r '.apiTag' "$RELFILE"); WEB_TAG=$(jq -r '.webTag' "$RELFILE")
export COSIGN_EXPERIMENTAL=1
for IMG in "$API_TAG" "$WEB_TAG"; do
  cosign verify --certificate-identity-regexp "https://github.com/.*/actions/runs/.*" \
    --certificate-oidc-issuer "https://token.actions.githubusercontent.com" "$IMG"
done
cp -f "$ENV_CUR" "$ENV_PREV" 2>/dev/null || true
echo "IMAGE_API=$API_TAG" > "$ENV_CUR"; echo "IMAGE_WEB=$WEB_TAG" >> "$ENV_CUR"
docker compose -f "$STACK" --env-file "$ENV_BASE" --env-file "$ENV_CUR" pull
docker compose -f "$STACK" --env-file "$ENV_BASE" --env-file "$ENV_CUR" up -d
DOMAIN=$( [ -f "$ROOT/docker/.domain" ] && cat "$ROOT/docker/.domain" || echo "localhost" )
PROTO=$(echo "$DOMAIN" | grep -q "localhost" && echo "http" || echo "https")
for i in {1..30}; do curl -fsS "$PROTO://$DOMAIN/api/health" >/dev/null 2>&1 && exit 0; sleep 3; done
if [ -f "$ENV_PREV" ]; then
  docker compose -f "$STACK" --env-file "$ENV_BASE" --env-file "$ENV_PREV" up -d
  echo "Rolled back."; exit 1
else
  echo "No rollback available."; exit 2
fi
