package postgres

import (
	"context"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// ActivityRepo implements port.ActivityRepository using pgx.
type ActivityRepo struct {
	pool *pgxpool.Pool
}

// NewActivityRepo creates a new ActivityRepo.
func NewActivityRepo(pool *pgxpool.Pool) *ActivityRepo {
	return &ActivityRepo{pool: pool}
}

func (r *ActivityRepo) Create(ctx context.Context, a *domain.Activity) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO activities (id, character_id, stat_id, description, xp_earned, logged_at)
		 VALUES ($1,$2,$3,$4,$5,$6)`,
		a.ID, a.CharacterID, a.StatID, a.Description, a.XPEarned, a.LoggedAt,
	)
	return err
}

func (r *ActivityRepo) ListByCharacter(ctx context.Context, characterID uuid.UUID, limit, offset int) ([]domain.Activity, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT a.id, a.character_id, a.stat_id, s.name, s.icon, a.description, a.xp_earned, a.logged_at
		 FROM activities a
		 JOIN stats s ON s.id = a.stat_id
		 WHERE a.character_id=$1
		 ORDER BY a.logged_at DESC
		 LIMIT $2 OFFSET $3`,
		characterID, limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []domain.Activity
	for rows.Next() {
		var a domain.Activity
		if err := rows.Scan(
			&a.ID, &a.CharacterID, &a.StatID, &a.StatName, &a.StatIcon,
			&a.Description, &a.XPEarned, &a.LoggedAt,
		); err != nil {
			return nil, err
		}
		activities = append(activities, a)
	}
	return activities, rows.Err()
}

func (r *ActivityRepo) CountByCharacter(ctx context.Context, characterID uuid.UUID) (int, error) {
	var count int
	err := r.pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM activities WHERE character_id=$1`, characterID,
	).Scan(&count)
	return count, err
}

func (r *ActivityRepo) CountByCharacterAndStatName(ctx context.Context, characterID uuid.UUID, statName string) (int, error) {
	var count int
	err := r.pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM activities a
		 JOIN stats s ON s.id = a.stat_id
		 WHERE a.character_id=$1 AND s.name=$2`,
		characterID, statName,
	).Scan(&count)
	return count, err
}

func (r *ActivityRepo) HasRecentActivity(ctx context.Context, statID uuid.UUID, since time.Time) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM activities WHERE stat_id=$1 AND logged_at >= $2)`,
		statID, since,
	).Scan(&exists)
	return exists, err
}

func (r *ActivityRepo) XPByDay(ctx context.Context, characterID uuid.UUID, since time.Time) ([]port.XPDay, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT TO_CHAR(logged_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') as day, SUM(xp_earned)::int
		 FROM activities
		 WHERE character_id=$1 AND logged_at >= $2
		 GROUP BY day
		 ORDER BY day ASC`,
		characterID, since,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var days []port.XPDay
	for rows.Next() {
		var d port.XPDay
		if err := rows.Scan(&d.Day, &d.XP); err != nil {
			return nil, err
		}
		days = append(days, d)
	}
	return days, rows.Err()
}

func (r *ActivityRepo) HasActivityAtHour(ctx context.Context, characterID uuid.UUID, afterHour, beforeHour int) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx,
		`SELECT EXISTS(
			SELECT 1 FROM activities
			WHERE character_id=$1
			  AND EXTRACT(HOUR FROM logged_at AT TIME ZONE 'UTC') >= $2
			  AND EXTRACT(HOUR FROM logged_at AT TIME ZONE 'UTC') < $3
		)`,
		characterID, afterHour, beforeHour,
	).Scan(&exists)
	return exists, err
}
