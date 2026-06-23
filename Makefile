.PHONY: dev start run build migrate test lint docker-up docker-down

# One command for local development: postgres in docker, server runs natively
dev:
	@cp -n .env.example .env 2>/dev/null || true
	docker-compose up -d db
	@echo "Waiting for postgres..."
	@until docker-compose exec -T db pg_isready -U arkhe -q; do sleep 1; done
	@echo "Postgres ready. Starting server..."
	@set -a && . ./.env && set +a && go run ./cmd/server

# One command for full docker deployment
start:
	@cp -n .env.example .env 2>/dev/null || true
	docker-compose up --build

run:
	go run ./cmd/server

build:
	go build -o bin/arkhe ./cmd/server

migrate:
	go run ./cmd/migrate

test:
	go test ./...

lint:
	golangci-lint run

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down
