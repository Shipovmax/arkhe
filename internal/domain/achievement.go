package domain

import (
	"time"

	"github.com/google/uuid"
)

// Achievement is a milestone that can be unlocked.
type Achievement struct {
	ID          uuid.UUID `json:"id"`
	Code        string    `json:"code"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
}

// UserAchievement records when a user unlocked an achievement.
type UserAchievement struct {
	UserID        uuid.UUID   `json:"user_id"`
	AchievementID uuid.UUID   `json:"achievement_id"`
	Achievement   Achievement `json:"achievement"`
	UnlockedAt    time.Time   `json:"unlocked_at"`
}
