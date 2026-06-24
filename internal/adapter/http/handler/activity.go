package handler

import (
	"net/http"
	"strconv"

	"arkhe/internal/domain"
	"arkhe/internal/usecase"

	"github.com/google/uuid"
)

// ActivityHandler handles activity logging and listing.
type ActivityHandler struct {
	activityUC *usecase.ActivityUsecase
}

// NewActivityHandler creates a new ActivityHandler.
func NewActivityHandler(activityUC *usecase.ActivityUsecase) *ActivityHandler {
	return &ActivityHandler{activityUC: activityUC}
}

func (h *ActivityHandler) Log(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)

	var req struct {
		StatID      string `json:"stat_id"`
		Description string `json:"description"`
	}
	if err := decode(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Description == "" {
		writeError(w, http.StatusBadRequest, "description is required")
		return
	}

	statID, err := uuid.Parse(req.StatID)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid stat_id")
		return
	}

	result, err := h.activityUC.Log(r.Context(), usecase.LogInput{
		UserID:      userID,
		StatID:      statID,
		Description: req.Description,
	})
	if err != nil {
		if err == domain.ErrTooSoon {
			writeError(w, http.StatusTooManyRequests, "Уже записано в этом периоде. Возвращайся позже!")
			return
		}
		writeError(w, domainErrStatus(err), "failed to log activity")
		return
	}

	unlocked := result.AchievementsUnlocked
	if unlocked == nil {
		unlocked = []domain.Achievement{}
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"activity":              result.Activity,
		"xp_earned":             result.XPEarned,
		"stat_xp":               result.StatXP,
		"stat_level":            result.StatLevel,
		"stat_level_up":         result.StatLevelUp,
		"character_level":       result.CharacterLevel,
		"character_level_up":    result.CharacterLevelUp,
		"stat_streak":           result.StatStreak,
		"global_streak":         result.GlobalStreak,
		"achievements_unlocked": unlocked,
	})
}

func (h *ActivityHandler) List(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)

	limit := 20
	offset := 0
	if v := r.URL.Query().Get("limit"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 && n <= 100 {
			limit = n
		}
	}
	if v := r.URL.Query().Get("offset"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n >= 0 {
			offset = n
		}
	}

	activities, err := h.activityUC.List(r.Context(), userID, limit, offset)
	if err != nil {
		writeError(w, domainErrStatus(err), "failed to load activities")
		return
	}
	if activities == nil {
		activities = []domain.Activity{}
	}

	writeJSON(w, http.StatusOK, activities)
}
