package usecase

import (
	"context"
	"fmt"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Claims is the JWT payload.
type Claims struct {
	UserID uuid.UUID `json:"sub"`
	jwt.RegisteredClaims
}

// AuthUsecase handles registration and login.
type AuthUsecase struct {
	users      port.UserRepository
	characters port.CharacterRepository
	jwtSecret  []byte
	jwtTTL     time.Duration
}

// NewAuthUsecase creates a new AuthUsecase.
func NewAuthUsecase(users port.UserRepository, characters port.CharacterRepository, jwtSecret string, jwtTTLHours int) *AuthUsecase {
	return &AuthUsecase{
		users:      users,
		characters: characters,
		jwtSecret:  []byte(jwtSecret),
		jwtTTL:     time.Duration(jwtTTLHours) * time.Hour,
	}
}

// RegisterInput is the data required to create a new account.
type RegisterInput struct {
	Email    string
	Password string
}

// Register creates a user account and returns a signed JWT.
func (u *AuthUsecase) Register(ctx context.Context, in RegisterInput) (string, *domain.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(in.Password), 12)
	if err != nil {
		return "", nil, fmt.Errorf("hash password: %w", err)
	}

	user := &domain.User{
		ID:           uuid.New(),
		Email:        in.Email,
		PasswordHash: string(hash),
		CreatedAt:    time.Now().UTC(),
	}

	if err := u.users.Create(ctx, user); err != nil {
		return "", nil, err
	}

	token, err := u.signToken(user.ID)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

// LoginInput is the data required to authenticate.
type LoginInput struct {
	Email    string
	Password string
}

// Login validates credentials and returns a signed JWT.
func (u *AuthUsecase) Login(ctx context.Context, in LoginInput) (string, *domain.User, error) {
	user, err := u.users.GetByEmail(ctx, in.Email)
	if err != nil {
		return "", nil, domain.ErrUnauthorized
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(in.Password)); err != nil {
		return "", nil, domain.ErrUnauthorized
	}

	token, err := u.signToken(user.ID)
	if err != nil {
		return "", nil, err
	}

	return token, user, nil
}

// ParseToken validates a JWT and returns the userID.
func (u *AuthUsecase) ParseToken(tokenStr string) (uuid.UUID, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return u.jwtSecret, nil
	})
	if err != nil || !token.Valid {
		return uuid.Nil, domain.ErrUnauthorized
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return uuid.Nil, domain.ErrUnauthorized
	}

	return claims.UserID, nil
}

func (u *AuthUsecase) signToken(userID uuid.UUID) (string, error) {
	claims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(u.jwtTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(u.jwtSecret)
}
