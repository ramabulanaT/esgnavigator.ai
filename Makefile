COMPOSE := docker compose -f docker/docker-compose.local.yml --env-file ./.env.local
SHELL := /bin/bash
.PHONY: up down rebuild logs ps health seed dbshell clean demo wait test-smoke
up:; $(COMPOSE) up -d --build
down:; $(COMPOSE) down
rebuild:; $(COMPOSE) build --no-cache && $(COMPOSE) up -d
logs:; $(COMPOSE) logs -f --tail=150
ps:; $(COMPOSE) ps
health:; curl -s http://localhost:8080/api/health | jq . || curl -s http://localhost:8080/api/health
seed:; $(COMPOSE) exec -T postgres psql -U esg -d esg -f /docker-entrypoint-initdb.d/002_seed.sql
dbshell:; $(COMPOSE) exec postgres psql -U esg -d esg
clean:; $(COMPOSE) down -v
wait:; scripts/wait-for-url.sh http://localhost:8080 120
demo: up wait; BASE=http://localhost:8080 USER_NAME=admin USER_PASS=demo123 ./scripts/demo.sh
test-smoke: up wait; npx cypress install && npm run cypress:run
