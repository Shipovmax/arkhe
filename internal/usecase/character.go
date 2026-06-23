package usecase

import (
	"context"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
)

// CharacterUsecase handles character creation and retrieval.
type CharacterUsecase struct {
	characters port.CharacterRepository
	stats      port.StatRepository
}

// NewCharacterUsecase creates a new CharacterUsecase.
func NewCharacterUsecase(characters port.CharacterRepository, stats port.StatRepository) *CharacterUsecase {
	return &CharacterUsecase{characters: characters, stats: stats}
}

// CreateInput holds the data needed to create a character during onboarding.
type CreateCharacterInput struct {
	UserID      uuid.UUID
	DisplayName string
	Class       domain.CharacterClass
	Stats       []CreateStatInput
}

// CreateStatInput holds data for one stat created during onboarding.
type CreateStatInput struct {
	Name          string
	Icon          string
	FrequencyDays int
}

// Create creates a character and its initial stats atomically.
func (u *CharacterUsecase) Create(ctx context.Context, in CreateCharacterInput) (*domain.Character, []domain.Stat, error) {
	char := &domain.Character{
		ID:          uuid.New(),
		UserID:      in.UserID,
		DisplayName: in.DisplayName,
		Class:       in.Class,
		Level:       1,
		TotalXP:     0,
		CreatedAt:   time.Now().UTC(),
	}

	if err := u.characters.Create(ctx, char); err != nil {
		return nil, nil, err
	}

	var stats []domain.Stat
	for _, s := range in.Stats {
		freqDays := s.FrequencyDays
		if freqDays < 1 {
			freqDays = 1
		}
		stat := &domain.Stat{
			ID:            uuid.New(),
			CharacterID:   char.ID,
			Name:          s.Name,
			Icon:          s.Icon,
			FrequencyDays: freqDays,
			StatXP:        0,
			StatLevel:     1,
			StatStreak:    0,
			LongestStreak: 0,
			CreatedAt:     time.Now().UTC(),
		}
		if err := u.stats.Create(ctx, stat); err != nil {
			return nil, nil, err
		}
		stats = append(stats, *stat)
	}

	return char, stats, nil
}

// GetByUserID returns the character with its current stats for the given user.
func (u *CharacterUsecase) GetByUserID(ctx context.Context, userID uuid.UUID) (*domain.Character, []domain.Stat, error) {
	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		return nil, nil, err
	}

	stats, err := u.stats.ListByCharacter(ctx, char.ID)
	if err != nil {
		return nil, nil, err
	}

	return char, stats, nil
}

// UpdateDisplayName changes the character's display name.
func (u *CharacterUsecase) UpdateDisplayName(ctx context.Context, userID uuid.UUID, displayName string) (*domain.Character, error) {
	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	char.DisplayName = displayName
	if err := u.characters.Update(ctx, char); err != nil {
		return nil, err
	}
	return char, nil
}
