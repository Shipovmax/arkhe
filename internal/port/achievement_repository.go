package port

import (
	"context"
	"time"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// AchievementStatus combines an achievement with its unlock state for a user.
type AchievementStatus struct {
	domain.Achievement
	Unlocked   bool       `json:"unlocked"`
	UnlockedAt *time.Time `json:"unlocked_at,omitempty"`
}

// AchievementRepository defines persistence operations for achievements.
type AchievementRepository interface {
	ListAll(ctx context.Context) ([]domain.Achievement, error)
	ListWithStatus(ctx context.Context, userID uuid.UUID) ([]AchievementStatus, error)
	ListUnlocked(ctx context.Context, userID uuid.UUID) ([]domain.UserAchievement, error)
	Unlock(ctx context.Context, userID uuid.UUID, achievementID uuid.UUID) error
	IsUnlocked(ctx context.Context, userID uuid.UUID, achievementID uuid.UUID) (bool, error)
}
