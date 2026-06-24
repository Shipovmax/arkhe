package http

import (
	"net/http"

	"arkhe/internal/adapter/http/handler"
	"arkhe/internal/adapter/http/middleware"
	"arkhe/internal/usecase"

	"golang.org/x/time/rate"
)

// NewRouter builds and returns the main HTTP mux.
func NewRouter(
	authUC *usecase.AuthUsecase,
	characterUC *usecase.CharacterUsecase,
	statUC *usecase.StatUsecase,
	activityUC *usecase.ActivityUsecase,
	analyticsH *handler.AnalyticsHandler,
	achievementH *handler.AchievementHandler,
	corsOrigins []string,
	webDir string,
) http.Handler {
	mux := http.NewServeMux()

	// Handlers
	authH := handler.NewAuthHandler(authUC, characterUC)
	charH := handler.NewCharacterHandler(characterUC)
	statH := handler.NewStatHandler(statUC)
	actH := handler.NewActivityHandler(activityUC)

	// Auth middleware factory
	authMiddleware := middleware.Auth(func(token string) (string, error) {
		id, err := authUC.ParseToken(token)
		if err != nil {
			return "", err
		}
		return id.String(), nil
	})

	// Rate limiters
	globalRL := middleware.NewRateLimiter(rate.Every(1), 300)        // 300 req/min burst
	authRL := middleware.NewRateLimiter(rate.Limit(5.0/60), 5)       // 5 req/min
	activityRL := middleware.NewRateLimiter(rate.Limit(60.0/60), 60) // 60 req/min

	// Health endpoints
	mux.HandleFunc("GET /healthz", healthz)
	mux.HandleFunc("GET /readyz", healthz)

	// Auth routes (rate limited)
	mux.Handle("POST /api/v1/auth/register", authRL.Middleware(http.HandlerFunc(authH.Register)))
	mux.Handle("POST /api/v1/auth/login", authRL.Middleware(http.HandlerFunc(authH.Login)))

	// Protected routes
	mux.Handle("GET /api/v1/character", authMiddleware(http.HandlerFunc(charH.Get)))
	mux.Handle("PUT /api/v1/character", authMiddleware(http.HandlerFunc(charH.Update)))

	mux.Handle("GET /api/v1/stats", authMiddleware(http.HandlerFunc(statH.List)))
	mux.Handle("POST /api/v1/stats", authMiddleware(http.HandlerFunc(statH.Create)))
	mux.Handle("PATCH /api/v1/stats/{id}", authMiddleware(http.HandlerFunc(statH.UpdateFrequency)))
	mux.Handle("DELETE /api/v1/stats/{id}", authMiddleware(http.HandlerFunc(statH.Delete)))

	mux.Handle("POST /api/v1/activities", activityRL.Middleware(authMiddleware(http.HandlerFunc(actH.Log))))
	mux.Handle("GET /api/v1/activities", authMiddleware(http.HandlerFunc(actH.List)))

	mux.Handle("GET /api/v1/analytics/summary", authMiddleware(http.HandlerFunc(analyticsH.Summary)))
	mux.Handle("GET /api/v1/analytics/xp-history", authMiddleware(http.HandlerFunc(analyticsH.XPHistory)))
	mux.Handle("GET /api/v1/analytics/stat-growth", authMiddleware(http.HandlerFunc(analyticsH.StatGrowth)))

	mux.Handle("GET /api/v1/achievements", authMiddleware(http.HandlerFunc(achievementH.List)))

	// Static files
	mux.Handle("/", http.FileServer(http.Dir(webDir)))

	// Apply global middleware chain
	return middleware.Logger(middleware.CORS(corsOrigins)(globalRL.Middleware(mux)))
}

func healthz(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}
