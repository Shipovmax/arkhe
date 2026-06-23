package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// ActivityRepository defines persistence operations for activities.
type ActivityRepository interface {
	Create(ctx context.Context, activity *domain.Activity) error
	ListByCharacter(ctx context.Context, characterID uuid.UUID, limit, offset int) ([]domain.Activity, error)
	CountByCharacter(ctx context.Context, characterID uuid.UUID) (int, error)
	CountByCharacterAndStatName(ctx context.Context, characterID uuid.UUID, statName string) (int, error)
}
