package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	adapterhttp "arkhe/internal/adapter/http"
	"arkhe/internal/adapter/http/handler"
	"arkhe/internal/adapter/postgres"
	"arkhe/internal/infrastructure"
	"arkhe/internal/usecase"
)

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	cfg := infrastructure.LoadConfig()
	if cfg.JWTSecret == "" {
		slog.Error("JWT_SECRET is required")
		os.Exit(1)
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

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

	// Repositories
	userRepo := postgres.NewUserRepo(pool)
	charRepo := postgres.NewCharacterRepo(pool)
	statRepo := postgres.NewStatRepo(pool)
	activityRepo := postgres.NewActivityRepo(pool)
	streakRepo := postgres.NewStreakRepo(pool)
	achievementRepo := postgres.NewAchievementRepo(pool)

	// Usecases
	authUC := usecase.NewAuthUsecase(userRepo, charRepo, cfg.JWTSecret, cfg.JWTTTLHours)
	characterUC := usecase.NewCharacterUsecase(charRepo, statRepo)
	statUC := usecase.NewStatUsecase(statRepo, charRepo)
	streakUC := usecase.NewStreakUsecase(streakRepo, statRepo)
	achievementUC := usecase.NewAchievementUsecase(achievementRepo, activityRepo, charRepo, streakRepo)
	activityUC := usecase.NewActivityUsecase(activityRepo, statRepo, charRepo, streakUC, achievementUC)

	// Handlers
	analyticsH := handler.NewAnalyticsHandler(activityRepo, charRepo, streakRepo)
	achievementH := handler.NewAchievementHandler(achievementRepo)

	webDir := filepath.Join(rootDir, "web")
	router := adapterhttp.NewRouter(
		authUC, characterUC, statUC, activityUC, analyticsH, achievementH,
		cfg.CORSOrigins, webDir,
	)

	srv := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	slog.Info("server starting", "port", cfg.ServerPort)
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("server error", "err", err)
			os.Exit(1)
		}
	}()

	<-ctx.Done()
	slog.Info("shutting down")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("shutdown error", "err", err)
	}
}
