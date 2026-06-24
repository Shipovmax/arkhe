package port

import (
	"context"
	"time"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// XPDay is a single day's XP total.
type XPDay struct {
	Day string `json:"day"` // YYYY-MM-DD
	XP  int    `json:"xp"`
}

// ActivityRepository defines persistence operations for activities.
type ActivityRepository interface {
	Create(ctx context.Context, activity *domain.Activity) error
	ListByCharacter(ctx context.Context, characterID uuid.UUID, limit, offset int) ([]domain.Activity, error)
	CountByCharacter(ctx context.Context, characterID uuid.UUID) (int, error)
	CountByCharacterAndStatName(ctx context.Context, characterID uuid.UUID, statName string) (int, error)
	HasRecentActivity(ctx context.Context, statID uuid.UUID, since time.Time) (bool, error)
	XPByDay(ctx context.Context, characterID uuid.UUID, since time.Time) ([]XPDay, error)
	HasActivityAtHour(ctx context.Context, characterID uuid.UUID, afterHour, beforeHour int) (bool, error)
}
