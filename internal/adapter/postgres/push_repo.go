package postgres

import (
	"context"

	"arkhe/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PushRepo struct {
	pool *pgxpool.Pool
}

func NewPushRepo(pool *pgxpool.Pool) *PushRepo {
	return &PushRepo{pool: pool}
}

func (r *PushRepo) Save(ctx context.Context, sub domain.PushSubscription) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth)
		 VALUES ($1, $2, $3, $4, $5)
		 ON CONFLICT (endpoint) DO UPDATE SET user_id=$2, p256dh=$4, auth=$5`,
		sub.ID, sub.UserID, sub.Endpoint, sub.P256DH, sub.Auth,
	)
	return err
}

func (r *PushRepo) DeleteByEndpoint(ctx context.Context, endpoint string) error {
	_, err := r.pool.Exec(ctx, `DELETE FROM push_subscriptions WHERE endpoint=$1`, endpoint)
	return err
}

func (r *PushRepo) GetByUserID(ctx context.Context, userID uuid.UUID) ([]domain.PushSubscription, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, user_id, endpoint, p256dh, auth FROM push_subscriptions WHERE user_id=$1`, userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var result []domain.PushSubscription
	for rows.Next() {
		var s domain.PushSubscription
		if err := rows.Scan(&s.ID, &s.UserID, &s.Endpoint, &s.P256DH, &s.Auth); err != nil {
			return nil, err
		}
		result = append(result, s)
	}
	return result, rows.Err()
}

func (r *PushRepo) GetUsersWithActiveStreaks(ctx context.Context) ([]domain.PushSubscription, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT ps.id, ps.user_id, ps.endpoint, ps.p256dh, ps.auth
		 FROM push_subscriptions ps
		 JOIN streaks s ON s.user_id = ps.user_id
		 WHERE s.current > 0 AND s.last_active_date < CURRENT_DATE`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var result []domain.PushSubscription
	for rows.Next() {
		var sub domain.PushSubscription
		if err := rows.Scan(&sub.ID, &sub.UserID, &sub.Endpoint, &sub.P256DH, &sub.Auth); err != nil {
			return nil, err
		}
		result = append(result, sub)
	}
	return result, rows.Err()
}
