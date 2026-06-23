package usecase

import (
	"context"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
)

// StatUsecase handles stat management.
type StatUsecase struct {
	stats      port.StatRepository
	characters port.CharacterRepository
}

// NewStatUsecase creates a new StatUsecase.
func NewStatUsecase(stats port.StatRepository, characters port.CharacterRepository) *StatUsecase {
	return &StatUsecase{stats: stats, characters: characters}
}

// AddStatInput holds data for creating a new stat.
type AddStatInput struct {
	UserID        uuid.UUID
	Name          string
	Icon          string
	FrequencyDays int
}

// Add creates a new stat for the user's character.
func (u *StatUsecase) Add(ctx context.Context, in AddStatInput) (*domain.Stat, error) {
	char, err := u.characters.GetByUserID(ctx, in.UserID)
	if err != nil {
		return nil, err
	}

	freqDays := in.FrequencyDays
	if freqDays < 1 {
		freqDays = 1
	}

	stat := &domain.Stat{
		ID:            uuid.New(),
		CharacterID:   char.ID,
		Name:          in.Name,
		Icon:          in.Icon,
		FrequencyDays: freqDays,
		StatXP:        0,
		StatLevel:     1,
		StatStreak:    0,
		LongestStreak: 0,
		CreatedAt:     time.Now().UTC(),
	}

	if err := u.stats.Create(ctx, stat); err != nil {
		return nil, err
	}
	return stat, nil
}

// List returns all stats for the user's character.
func (u *StatUsecase) List(ctx context.Context, userID uuid.UUID) ([]domain.Stat, error) {
	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return u.stats.ListByCharacter(ctx, char.ID)
}

// UpdateFrequency changes a stat's frequency goal.
func (u *StatUsecase) UpdateFrequency(ctx context.Context, userID uuid.UUID, statID uuid.UUID, frequencyDays int) (*domain.Stat, error) {
	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	stat, err := u.stats.GetByID(ctx, statID)
	if err != nil {
		return nil, err
	}
	if stat.CharacterID != char.ID {
		return nil, domain.ErrForbidden
	}

	if frequencyDays < 1 {
		frequencyDays = 1
	}
	stat.FrequencyDays = frequencyDays

	if err := u.stats.Update(ctx, stat); err != nil {
		return nil, err
	}
	return stat, nil
}

// Delete removes a stat belonging to the user's character.
func (u *StatUsecase) Delete(ctx context.Context, userID uuid.UUID, statID uuid.UUID) error {
	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		return err
	}
	return u.stats.Delete(ctx, statID, char.ID)
}
