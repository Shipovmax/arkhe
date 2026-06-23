package postgres

import (
	"context"
	"errors"

	"arkhe/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// StreakRepo implements port.StreakRepository using pgx.
type StreakRepo struct {
	pool *pgxpool.Pool
}

// NewStreakRepo creates a new StreakRepo.
func NewStreakRepo(pool *pgxpool.Pool) *StreakRepo {
	return &StreakRepo{pool: pool}
}

func (r *StreakRepo) Get(ctx context.Context, userID uuid.UUID) (*domain.Streak, error) {
	row := r.pool.QueryRow(ctx,
		`SELECT user_id, current, longest, last_active_date FROM streaks WHERE user_id=$1`, userID,
	)
	var s domain.Streak
	err := row.Scan(&s.UserID, &s.Current, &s.Longest, &s.LastActiveDate)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return &domain.Streak{UserID: userID}, nil
		}
		return nil, err
	}
	return &s, nil
}

func (r *StreakRepo) Upsert(ctx context.Context, s *domain.Streak) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO streaks (user_id, current, longest, last_active_date)
		 VALUES ($1,$2,$3,$4)
		 ON CONFLICT (user_id) DO UPDATE
		 SET current=$2, longest=$3, last_active_date=$4`,
		s.UserID, s.Current, s.Longest, s.LastActiveDate,
	)
	return err
}
