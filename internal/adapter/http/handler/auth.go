package handler

import (
	"net/http"
	"strings"

	"arkhe/internal/domain"
	"arkhe/internal/usecase"
)

// AuthHandler handles registration and login.
type AuthHandler struct {
	authUC    *usecase.AuthUsecase
	characterUC *usecase.CharacterUsecase
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(authUC *usecase.AuthUsecase, characterUC *usecase.CharacterUsecase) *AuthHandler {
	return &AuthHandler{authUC: authUC, characterUC: characterUC}
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email       string `json:"email"`
		Password    string `json:"password"`
		DisplayName string `json:"display_name"`
		Class       string `json:"class"`
		Stats       []struct {
			Name          string `json:"name"`
			Icon          string `json:"icon"`
			FrequencyDays int    `json:"frequency_days"`
		} `json:"stats"`
	}
	if err := decode(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	req.Email = strings.TrimSpace(strings.ToLower(req.Email))
	if req.Email == "" || req.Password == "" || req.DisplayName == "" || req.Class == "" {
		writeError(w, http.StatusBadRequest, "email, password, display_name and class are required")
		return
	}
	if len(req.Password) < 8 {
		writeError(w, http.StatusBadRequest, "password must be at least 8 characters")
		return
	}

	class := domain.CharacterClass(req.Class)
	if class != domain.ClassStudent && class != domain.ClassWorker && class != domain.ClassSchoolkid {
		writeError(w, http.StatusBadRequest, "invalid class")
		return
	}

	token, user, err := h.authUC.Register(r.Context(), usecase.RegisterInput{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		if err == domain.ErrAlreadyExists {
			writeError(w, http.StatusConflict, "email already registered")
			return
		}
		writeError(w, http.StatusInternalServerError, "registration failed")
		return
	}

	statsInput := make([]usecase.CreateStatInput, len(req.Stats))
	for i, s := range req.Stats {
		fd := s.FrequencyDays
		if fd < 1 {
			fd = 1
		}
		statsInput[i] = usecase.CreateStatInput{Name: s.Name, Icon: s.Icon, FrequencyDays: fd}
	}

	char, stats, err := h.characterUC.Create(r.Context(), usecase.CreateCharacterInput{
		UserID:      user.ID,
		DisplayName: req.DisplayName,
		Class:       class,
		Stats:       statsInput,
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "character creation failed")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"token":     token,
		"character": char,
		"stats":     stats,
	})
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := decode(r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	token, user, err := h.authUC.Login(r.Context(), usecase.LoginInput{
		Email:    strings.TrimSpace(strings.ToLower(req.Email)),
		Password: req.Password,
	})
	if err != nil {
		writeError(w, http.StatusUnauthorized, "invalid credentials")
		return
	}

	char, stats, err := h.characterUC.GetByUserID(r.Context(), user.ID)
	if err != nil {
		if err == domain.ErrNotFound {
			// User registered but hasn't completed onboarding yet
			writeJSON(w, http.StatusOK, map[string]any{
				"token":     token,
				"character": nil,
				"stats":     nil,
			})
			return
		}
		writeError(w, http.StatusInternalServerError, "failed to load character")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"token":     token,
		"character": char,
		"stats":     stats,
	})
}
