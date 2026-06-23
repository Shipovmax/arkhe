package domain

import (
	"time"

	"github.com/google/uuid"
)

// User is the authenticated account entity.
type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
}
