package handler

import (
	"net/http"

	"arkhe/internal/adapter/http/middleware"
	"arkhe/internal/domain"
	"arkhe/internal/usecase"

	"github.com/google/uuid"
)

// CharacterHandler handles character endpoints.
type CharacterHandler struct {
	characterUC *usecase.CharacterUsecase
}

// NewCharacterHandler creates a new CharacterHandler.
func NewCharacterHandler(characterUC *usecase.CharacterUsecase) *CharacterHandler {
	return &CharacterHandler{characterUC: characterUC}
}

func (h *CharacterHandler) Get(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)
	if userID == uuid.Nil {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	char, stats, err := h.characterUC.GetByUserID(r.Context(), userID)
	if err != nil {
		if err == domain.ErrNotFound {
			writeError(w, http.StatusNotFound, "character not found")
			return
		}
		writeError(w, http.StatusInternalServerError, "failed to load character")
		return
	}

	statLevels := make([]int, len(stats))
	var totalXP int64
	for i, s := range stats {
		statLevels[i] = s.StatLevel
		totalXP += s.StatXP
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"id":            char.ID,
		"display_name":  char.DisplayName,
		"class":         char.Class,
		"level":         char.Level,
		"total_xp":      totalXP,
		"xp_to_next":    domain.XPToNextLevel(totalXP),
		"stats":         stats,
	})
}

func (h *CharacterHandler) Update(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)
	if userID == uuid.Nil {
		writeError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	var req struct {
		DisplayName string `json:"display_name"`
	}
	if err := decode(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.DisplayName == "" {
		writeError(w, http.StatusBadRequest, "display_name is required")
		return
	}

	char, err := h.characterUC.UpdateDisplayName(r.Context(), userID, req.DisplayName)
	if err != nil {
		writeError(w, domainErrStatus(err), err.Error())
		return
	}

	writeJSON(w, http.StatusOK, char)
}

func userIDFromCtx(r *http.Request) uuid.UUID {
	v := r.Context().Value(middleware.UserIDKey)
	if v == nil {
		return uuid.Nil
	}
	s, ok := v.(string)
	if !ok {
		return uuid.Nil
	}
	id, err := uuid.Parse(s)
	if err != nil {
		return uuid.Nil
	}
	return id
}
