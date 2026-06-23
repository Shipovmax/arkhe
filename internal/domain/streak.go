package domain

import (
	"time"

	"github.com/google/uuid"
)

// Streak tracks global daily activity for a user.
type Streak struct {
	UserID         uuid.UUID  `json:"user_id"`
	Current        int        `json:"current"`
	Longest        int        `json:"longest"`
	LastActiveDate *time.Time `json:"last_active_date"`
}
