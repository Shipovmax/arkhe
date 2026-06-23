package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// AchievementRepository defines persistence operations for achievements.
type AchievementRepository interface {
	ListAll(ctx context.Context) ([]domain.Achievement, error)
	ListUnlocked(ctx context.Context, userID uuid.UUID) ([]domain.UserAchievement, error)
	Unlock(ctx context.Context, userID uuid.UUID, achievementID uuid.UUID) error
	IsUnlocked(ctx context.Context, userID uuid.UUID, achievementID uuid.UUID) (bool, error)
}
