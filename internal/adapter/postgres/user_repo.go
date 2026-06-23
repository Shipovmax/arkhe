package postgres

import (
	"context"
	"errors"

	"arkhe/internal/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

// UserRepo implements port.UserRepository using pgx.
type UserRepo struct {
	pool *pgxpool.Pool
}

// NewUserRepo creates a new UserRepo.
func NewUserRepo(pool *pgxpool.Pool) *UserRepo {
	return &UserRepo{pool: pool}
}

func (r *UserRepo) Create(ctx context.Context, user *domain.User) error {
	_, err := r.pool.Exec(ctx,
		`INSERT INTO users (id, email, password_hash, created_at)
		 VALUES ($1, $2, $3, $4)`,
		user.ID, user.Email, user.PasswordHash, user.CreatedAt,
	)
	if err != nil {
		if isUniqueViolation(err) {
			return domain.ErrAlreadyExists
		}
		return err
	}
	return nil
}

func (r *UserRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	row := r.pool.QueryRow(ctx,
		`SELECT id, email, password_hash, created_at FROM users WHERE id=$1`, id,
	)
	return scanUser(row)
}

func (r *UserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	row := r.pool.QueryRow(ctx,
		`SELECT id, email, password_hash, created_at FROM users WHERE email=$1`, email,
	)
	return scanUser(row)
}

func scanUser(row pgx.Row) (*domain.User, error) {
	var u domain.User
	err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.CreatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &u, nil
}
