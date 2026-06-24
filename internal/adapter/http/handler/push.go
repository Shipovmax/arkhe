package handler

import (
	"net/http"

	"arkhe/internal/usecase"
)

type PushHandler struct {
	pushUC *usecase.PushUsecase
}

func NewPushHandler(pushUC *usecase.PushUsecase) *PushHandler {
	return &PushHandler{pushUC: pushUC}
}

func (h *PushHandler) GetVAPIDKey(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"public_key": h.pushUC.VAPIDPublicKey(),
		"enabled":    h.pushUC.Enabled(),
	})
}

func (h *PushHandler) Subscribe(w http.ResponseWriter, r *http.Request) {
	userID := userIDFromCtx(r)

	var req struct {
		Endpoint string `json:"endpoint"`
		P256DH   string `json:"p256dh"`
		Auth     string `json:"auth"`
	}
	if err := decode(r, &req); err != nil || req.Endpoint == "" || req.P256DH == "" || req.Auth == "" {
		writeError(w, http.StatusBadRequest, "invalid subscription")
		return
	}

	if err := h.pushUC.Subscribe(r.Context(), userID, req.Endpoint, req.P256DH, req.Auth); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to save subscription")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *PushHandler) Unsubscribe(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Endpoint string `json:"endpoint"`
	}
	if err := decode(r, &req); err != nil || req.Endpoint == "" {
		writeError(w, http.StatusBadRequest, "invalid request")
		return
	}

	if err := h.pushUC.Unsubscribe(r.Context(), req.Endpoint); err != nil {
		writeError(w, http.StatusInternalServerError, "failed to remove subscription")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}
