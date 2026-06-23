package middleware

import (
	"context"
	"net/http"
	"strings"
)

type contextKey string

// UserIDKey is the context key for the authenticated user's ID.
const UserIDKey contextKey = "userID"

// TokenParser can validate a JWT and return the user ID string.
type TokenParser interface {
	ParseToken(token string) (interface{ String() string }, error)
}

// authParseFunc is a function type matching AuthUsecase.ParseToken signature.
type authParseFunc func(token string) (fmt interface{}, err error)

// Auth extracts and validates the Bearer token, injecting userID into context.
func Auth(parseToken func(string) (string, error)) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			header := r.Header.Get("Authorization")
			if !strings.HasPrefix(header, "Bearer ") {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "missing token"})
				return
			}
			tokenStr := strings.TrimPrefix(header, "Bearer ")
			userID, err := parseToken(tokenStr)
			if err != nil {
				writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid token"})
				return
			}
			ctx := context.WithValue(r.Context(), UserIDKey, userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// writeJSON writes a JSON response. Shared across middleware.
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	encodeJSON(w, v)
}
