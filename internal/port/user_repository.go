package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

// UserRepository defines persistence operations for users.
type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
}
