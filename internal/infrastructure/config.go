package infrastructure

import (
	"os"
	"strconv"
	"strings"
)

// Config holds all application configuration loaded from environment variables.
type Config struct {
	DatabaseURL    string
	JWTSecret      string
	JWTTTLHours    int
	ServerPort     string
	CORSOrigins    []string
	BillingEnabled bool
	EmailEnabled   bool
	ResendAPIKey   string
	ResendFrom     string
}

// LoadConfig reads configuration from environment variables.
func LoadConfig() *Config {
	ttl, _ := strconv.Atoi(getEnv("JWT_TTL_HOURS", "24"))

	origins := strings.Split(getEnv("CORS_ORIGINS", "http://localhost:8080"), ",")
	for i, o := range origins {
		origins[i] = strings.TrimSpace(o)
	}

	return &Config{
		DatabaseURL:    getEnv("DATABASE_URL", "postgres://arkhe:secret@localhost:5432/arkhe?sslmode=disable"),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		JWTTTLHours:    ttl,
		ServerPort:     getEnv("SERVER_PORT", "8080"),
		CORSOrigins:    origins,
		BillingEnabled: getEnv("BILLING_ENABLED", "false") == "true",
		EmailEnabled:   getEnv("EMAIL_ENABLED", "false") == "true",
		ResendAPIKey:   getEnv("RESEND_API_KEY", ""),
		ResendFrom:     getEnv("RESEND_FROM", "Arkhe <noreply@arkhe.app>"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
