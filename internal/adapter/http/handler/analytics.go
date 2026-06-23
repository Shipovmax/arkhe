package handler

import (
	"net/http"
	"strconv"
	"time"

	"arkhe/internal/port"
)

// AnalyticsHandler handles analytics endpoints.
type AnalyticsHandler struct {
	activities port.ActivityRepository
	characters port.CharacterRepository
	streaks    port.StreakRepository
}

// NewAnalyticsHandler creates a new AnalyticsHandler.
func NewAnalyticsHandler(
	activities port.ActivityRepository,
	characters port.CharacterRepository,
	streaks port.StreakRepository,
) *AnalyticsHandler {
	return &AnalyticsHandler{
		activities: activities,
		characters: characters,
		streaks:    streaks,
	}
}

func (h *AnalyticsHandler) Summary(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)

	char, err := h.characters.GetByUserID(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusNotFound, "character not found")
		return
	}

	streak, err := h.streaks.Get(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load streak")
		return
	}

	total, err := h.activities.CountByCharacter(r.Context(), char.ID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load activity count")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"character_level": char.Level,
		"total_xp":        char.TotalXP,
		"best_streak":     streak.Longest,
		"current_streak":  streak.Current,
		"total_activities": total,
	})
}

func (h *AnalyticsHandler) XPHistory(w http.ResponseWriter, r *http.Request) {
	days := 30
	if v := r.URL.Query().Get("days"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 && n <= 365 {
			days = n
		}
	}
	_ = days
	// Placeholder: returns empty for now — requires time-series query
	since := time.Now().UTC().AddDate(0, 0, -days)
	writeJSON(w, http.StatusOK, map[string]any{
		"since": since,
		"data":  []any{},
	})
}

func (h *AnalyticsHandler) StatGrowth(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"data": []any{},
	})
}
