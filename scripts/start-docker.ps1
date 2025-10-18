$ErrorActionPreference="Stop"
docker compose -f docker/docker-compose.local.yml --env-file ./.env.local up -d --build
Start-Process "http://localhost:8080"
