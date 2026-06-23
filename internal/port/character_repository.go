package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// CharacterRepository defines persistence operations for characters.
type CharacterRepository interface {
	Create(ctx context.Context, character *domain.Character) error
	GetByUserID(ctx context.Context, userID uuid.UUID) (*domain.Character, error)
	Update(ctx context.Context, character *domain.Character) error
}
