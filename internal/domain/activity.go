package domain

import (
	"time"

	"github.com/google/uuid"
)

// Activity is a single logged action tied to a stat.
type Activity struct {
	ID          uuid.UUID `json:"id"`
	CharacterID uuid.UUID `json:"character_id"`
	StatID      uuid.UUID `json:"stat_id"`
	StatName    string    `json:"stat_name"`
	StatIcon    string    `json:"stat_icon"`
	Description string    `json:"description"`
	XPEarned    int       `json:"xp_earned"`
	LoggedAt    time.Time `json:"logged_at"`
}
