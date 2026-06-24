package port

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
)

type PushRepository interface {
	Save(ctx context.Context, sub domain.PushSubscription) error
	DeleteByEndpoint(ctx context.Context, endpoint string) error
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]domain.PushSubscription, error)
	GetUsersWithActiveStreaks(ctx context.Context) ([]domain.PushSubscription, error)
}
