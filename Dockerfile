FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o bin/arkhe ./cmd/server

FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app
COPY --from=builder /app/bin/arkhe .
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/web ./web
EXPOSE 8080
CMD ["./arkhe"]
