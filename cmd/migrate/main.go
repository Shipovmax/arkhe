package main

import (
	"context"
	"log/slog"
	"os"
	"path/filepath"
	"runtime"

	"arkhe/internal/infrastructure"
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	cfg := infrastructure.LoadConfig()

	ctx := context.Background()
	pool, err := infrastructure.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		slog.Error("db connect failed", "err", err)
		os.Exit(1)
	}
	defer pool.Close()

	_, filename, _, _ := runtime.Caller(0)
	rootDir := filepath.Join(filepath.Dir(filename), "..", "..")
	migrationsDir := filepath.Join(rootDir, "migrations")

	if err := infrastructure.RunMigrations(ctx, pool, migrationsDir); err != nil {
		slog.Error("migrations failed", "err", err)
		os.Exit(1)
	}

	slog.Info("migrations applied successfully")
}
