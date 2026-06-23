package handler

import (
	"net/http"
	"strings"

	"arkhe/internal/domain"
	"arkhe/internal/usecase"

	"github.com/google/uuid"
)

// StatHandler handles stat endpoints.
type StatHandler struct {
	statUC *usecase.StatUsecase
}

// NewStatHandler creates a new StatHandler.
func NewStatHandler(statUC *usecase.StatUsecase) *StatHandler {
	return &StatHandler{statUC: statUC}
}

func (h *StatHandler) List(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)
	stats, err := h.statUC.List(r.Context(), userID)
	if err != nil {
		writeError(w, domainErrStatus(err), "failed to load stats")
		return
	}
	if stats == nil {
		stats = []domain.Stat{}
	}
	writeJSON(w, http.StatusOK, stats)
}

func (h *StatHandler) Create(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)

	var req struct {
		Name          string `json:"name"`
		Icon          string `json:"icon"`
		FrequencyDays int    `json:"frequency_days"`
	}
	if err := decode(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "name is required")
		return
	}
	if req.Icon == "" {
		req.Icon = "⚡"
	}

	stat, err := h.statUC.Add(r.Context(), usecase.AddStatInput{
		UserID:        userID,
		Name:          req.Name,
		Icon:          req.Icon,
		FrequencyDays: req.FrequencyDays,
	})
	if err != nil {
		writeError(w, domainErrStatus(err), "failed to create stat")
		return
	}

	writeJSON(w, http.StatusCreated, stat)
}

func (h *StatHandler) UpdateFrequency(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)
	statID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid stat id")
		return
	}

	var req struct {
		FrequencyDays int `json:"frequency_days"`
	}
	if err := decode(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	stat, err := h.statUC.UpdateFrequency(r.Context(), userID, statID, req.FrequencyDays)
	if err != nil {
		writeError(w, domainErrStatus(err), "failed to update stat")
		return
	}

	writeJSON(w, http.StatusOK, stat)
}

func (h *StatHandler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)
	statID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid stat id")
		return
	}

	if err := h.statUC.Delete(r.Context(), userID, statID); err != nil {
		writeError(w, domainErrStatus(err), "failed to delete stat")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
