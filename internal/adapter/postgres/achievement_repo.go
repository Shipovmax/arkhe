package postgres

import (
	"context"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

// AchievementRepo implements port.AchievementRepository using pgx.
type AchievementRepo struct {
	pool *pgxpool.Pool
}

// NewAchievementRepo creates a new AchievementRepo.
func NewAchievementRepo(pool *pgxpool.Pool) *AchievementRepo {
	return &AchievementRepo{pool: pool}
}

func (r *AchievementRepo) ListAll(ctx context.Context) ([]domain.Achievement, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, code, title, description, icon FROM achievements ORDER BY title`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.Achievement
	for rows.Next() {
		var a domain.Achievement
		if err := rows.Scan(&a.ID, &a.Code, &a.Title, &a.Description, &a.Icon); err != nil {
			return nil, err
		}
		list = append(list, a)
	}
	return list, rows.Err()
}

func (r *AchievementRepo) ListWithStatus(ctx context.Context, userID uuid.UUID) ([]port.AchievementStatus, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT a.id, a.code, a.title, a.description, a.icon, ua.unlocked_at
		 FROM achievements a
		 LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = $1
		 ORDER BY ua.unlocked_at DESC NULLS LAST, a.title`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []port.AchievementStatus
	for rows.Next() {
		var s port.AchievementStatus
		var unlockedAt *time.Time
		if err := rows.Scan(&s.ID, &s.Code, &s.Title, &s.Description, &s.Icon, &unlockedAt); err != nil {
			return nil, err
		}
		s.Unlocked = unlockedAt != nil
		s.UnlockedAt = unlockedAt
		list = append(list, s)
	}
	return list, rows.Err()
}

func (r *AchievementRepo) ListUnlocked(ctx context.Context, userID uuid.UUID) ([]domain.UserAchievement, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT ua.user_id, ua.achievement_id, a.code, a.title, a.description, a.icon, ua.unlocked_at
		 FROM user_achievements ua
		 JOIN achievements a ON a.id = ua.achievement_id
		 WHERE ua.user_id=$1
		 ORDER BY ua.unlocked_at DESC`, userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []domain.UserAchievement
	for rows.Next() {
		var ua domain.UserAchievement
		if err := rows.Scan(
			&ua.UserID, &ua.AchievementID,
			&ua.Achievement.Code, &ua.Achievement.Title,
			&ua.Achievement.Description, &ua.Achievement.Icon,
			&ua.UnlockedAt,
		); err != nil {
			return nil, err
		}
		list = append(list, ua)
	}
	return list, rows.Err()
}

func (r *AchievementRepo) Unlock(ctx context.Context, userID uuid.UUID, achievementID uuid.UUID) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO user_achievements (user_id, achievement_id)
		 VALUES ($1,$2) ON CONFLICT DO NOTHING`,
		userID, achievementID,
	)
	return err
}

func (r *AchievementRepo) IsUnlocked(ctx context.Context, userID uuid.UUID, achievementID uuid.UUID) (bool, error) {
	var exists bool
	err := r.pool.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id=$1 AND achievement_id=$2)`,
		userID, achievementID,
	).Scan(&exists)
	return exists, err
}
