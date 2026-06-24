package handler

import (
	"net/http"

	"arkhe/internal/port"
)

// AchievementHandler handles achievement endpoints.
type AchievementHandler struct {
	achievements port.AchievementRepository
}

// NewAchievementHandler creates a new AchievementHandler.
func NewAchievementHandler(achievements port.AchievementRepository) *AchievementHandler {
	return &AchievementHandler{achievements: achievements}
}

func (h *AchievementHandler) List(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)

	list, err := h.achievements.ListWithStatus(r.Context(), userID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load achievements")
		return
	}
	if list == nil {
		list = []port.AchievementStatus{}
	}

	writeJSON(w, http.StatusOK, list)
}
