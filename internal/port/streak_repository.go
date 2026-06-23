package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// StreakRepository defines persistence operations for global streaks.
type StreakRepository interface {
	Get(ctx context.Context, userID uuid.UUID) (*domain.Streak, error)
	Upsert(ctx context.Context, streak *domain.Streak) error
}
