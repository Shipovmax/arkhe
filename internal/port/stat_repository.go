package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// StatRepository defines persistence operations for stats.
type StatRepository interface {
	Create(ctx context.Context, stat *domain.Stat) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Stat, error)
	ListByCharacter(ctx context.Context, characterID uuid.UUID) ([]domain.Stat, error)
	Update(ctx context.Context, stat *domain.Stat) error
	Delete(ctx context.Context, id uuid.UUID, characterID uuid.UUID) error
}
