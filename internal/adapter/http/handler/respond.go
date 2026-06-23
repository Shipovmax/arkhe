package handler

import (
	"encoding/json"
	"net/http"

	"arkhe/internal/domain"
)

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func decode(r *http.Request, v any) error {
	return json.NewDecoder(r.Body).Decode(v)
}

func domainErrStatus(err error) int {
	switch err {
	case domain.ErrNotFound:
		return http.StatusNotFound
	case domain.ErrAlreadyExists:
		return http.StatusConflict
	case domain.ErrUnauthorized:
		return http.StatusUnauthorized
	case domain.ErrForbidden:
		return http.StatusForbidden
	case domain.ErrInvalidInput:
		return http.StatusBadRequest
	default:
		return http.StatusInternalServerError
	}
}
