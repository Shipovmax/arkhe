package postgres

import (
	"context"
	"errors"

	"arkhe/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// CharacterRepo implements port.CharacterRepository using pgx.
type CharacterRepo struct {
	pool *pgxpool.Pool
}

// NewCharacterRepo creates a new CharacterRepo.
func NewCharacterRepo(pool *pgxpool.Pool) *CharacterRepo {
	return &CharacterRepo{pool: pool}
}

func (r *CharacterRepo) Create(ctx context.Context, c *domain.Character) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO characters (id, user_id, display_name, class, level, total_xp, created_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		c.ID, c.UserID, c.DisplayName, c.Class, c.Level, c.TotalXP, c.CreatedAt,
	)
	if err != nil {
		if isUniqueViolation(err) {
			return domain.ErrAlreadyExists
		}
		return err
	}
	return nil
}

func (r *CharacterRepo) GetByUserID(ctx context.Context, userID uuid.UUID) (*domain.Character, error) {
	row := r.pool.QueryRow(ctx,
		`SELECT id, user_id, display_name, class, level, total_xp, created_at
		 FROM characters WHERE user_id=$1`, userID,
	)
	var c domain.Character
	err := row.Scan(&c.ID, &c.UserID, &c.DisplayName, &c.Class, &c.Level, &c.TotalXP, &c.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &c, nil
}

func (r *CharacterRepo) Update(ctx context.Context, c *domain.Character) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE characters SET display_name=$1, level=$2, total_xp=$3 WHERE id=$4`,
		c.DisplayName, c.Level, c.TotalXP, c.ID,
	)
	return err
}
