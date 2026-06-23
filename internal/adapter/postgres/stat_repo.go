package postgres

import (
	"context"
	"errors"

	"arkhe/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// StatRepo implements port.StatRepository using pgx.
type StatRepo struct {
	pool *pgxpool.Pool
}

// NewStatRepo creates a new StatRepo.
func NewStatRepo(pool *pgxpool.Pool) *StatRepo {
	return &StatRepo{pool: pool}
}

func (r *StatRepo) Create(ctx context.Context, s *domain.Stat) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO stats
		 (id, character_id, name, icon, frequency_days, stat_xp, stat_level, stat_streak, longest_streak, last_period_end, created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
		s.ID, s.CharacterID, s.Name, s.Icon, s.FrequencyDays,
		s.StatXP, s.StatLevel, s.StatStreak, s.LongestStreak, s.LastPeriodEnd, s.CreatedAt,
	)
	if err != nil {
		if isUniqueViolation(err) {
			return domain.ErrAlreadyExists
		}
		return err
	}
	return nil
}

func (r *StatRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Stat, error) {
	row := r.pool.QueryRow(ctx,
		`SELECT id, character_id, name, icon, frequency_days, stat_xp, stat_level,
		        stat_streak, longest_streak, last_period_end, created_at
		 FROM stats WHERE id=$1`, id,
	)
	return scanStat(row)
}

func (r *StatRepo) ListByCharacter(ctx context.Context, characterID uuid.UUID) ([]domain.Stat, error) {
	rows, err := r.pool.Query(ctx,
		`SELECT id, character_id, name, icon, frequency_days, stat_xp, stat_level,
		        stat_streak, longest_streak, last_period_end, created_at
		 FROM stats WHERE character_id=$1 ORDER BY created_at ASC`, characterID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stats []domain.Stat
	for rows.Next() {
		s, err := scanStat(rows)
		if err != nil {
			return nil, err
		}
		stats = append(stats, *s)
	}
	return stats, rows.Err()
}

func (r *StatRepo) Update(ctx context.Context, s *domain.Stat) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE stats SET
		 name=$1, icon=$2, frequency_days=$3, stat_xp=$4, stat_level=$5,
		 stat_streak=$6, longest_streak=$7, last_period_end=$8
		 WHERE id=$9`,
		s.Name, s.Icon, s.FrequencyDays, s.StatXP, s.StatLevel,
		s.StatStreak, s.LongestStreak, s.LastPeriodEnd, s.ID,
	)
	return err
}

func (r *StatRepo) Delete(ctx context.Context, id uuid.UUID, characterID uuid.UUID) error {
	tag, err := r.pool.Exec(ctx,
		`DELETE FROM stats WHERE id=$1 AND character_id=$2`, id, characterID,
	)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func scanStat(row interface{ Scan(...any) error }) (*domain.Stat, error) {
	var s domain.Stat
	err := row.Scan(
		&s.ID, &s.CharacterID, &s.Name, &s.Icon, &s.FrequencyDays,
		&s.StatXP, &s.StatLevel, &s.StatStreak, &s.LongestStreak, &s.LastPeriodEnd, &s.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &s, nil
}
