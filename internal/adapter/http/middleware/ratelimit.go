package middleware

import (
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type ipLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// RateLimiter holds per-IP limiters.
type RateLimiter struct {
	mu       sync.Mutex
	limiters sync.Map
	r        rate.Limit
	b        int
}

// NewRateLimiter creates a per-IP rate limiter.
// r is requests per second, b is burst size.
func NewRateLimiter(r rate.Limit, b int) *RateLimiter {
	rl := &RateLimiter{r: r, b: b}
	go rl.cleanup()
	return rl
}

func (rl *RateLimiter) getLimiter(ip string) *rate.Limiter {
	v, _ := rl.limiters.LoadOrStore(ip, &ipLimiter{
		limiter:  rate.NewLimiter(rl.r, rl.b),
		lastSeen: time.Now(),
	})
	il := v.(*ipLimiter)
	il.lastSeen = time.Now()
	return il.limiter
}

func (rl *RateLimiter) cleanup() {
	for range time.Tick(time.Minute) {
		rl.limiters.Range(func(k, v any) bool {
			if time.Since(v.(*ipLimiter).lastSeen) > 5*time.Minute {
				rl.limiters.Delete(k)
			}
			return true
		})
	}
}

// Middleware returns an http.Handler that enforces the rate limit.
func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr
		if !rl.getLimiter(ip).Allow() {
			writeJSON(w, http.StatusTooManyRequests, map[string]string{"error": "rate limit exceeded"})
			return
		}
		next.ServeHTTP(w, r)
	})
}
