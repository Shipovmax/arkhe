package postgres

import "github.com/jackc/pgx/v5/pgconn"

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	if e, ok := err.(*pgconn.PgError); ok {
		pgErr = e
	}
	return pgErr != nil && pgErr.Code == "23505"
}
