package usecase

import (
	"context"
	"log/slog"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
)

// AchievementUsecase checks and unlocks achievements.
type AchievementUsecase struct {
	achievements port.AchievementRepository
	activities   port.ActivityRepository
	characters   port.CharacterRepository
	streaks      port.StreakRepository
}

// NewAchievementUsecase creates a new AchievementUsecase.
func NewAchievementUsecase(
	achievements port.AchievementRepository,
	activities port.ActivityRepository,
	characters port.CharacterRepository,
	streaks port.StreakRepository,
) *AchievementUsecase {
	return &AchievementUsecase{
		achievements: achievements,
		activities:   activities,
		characters:   characters,
		streaks:      streaks,
	}
}

// Check evaluates all unearned achievements and unlocks any that qualify.
// Returns newly unlocked achievements.
func (u *AchievementUsecase) Check(ctx context.Context, characterID uuid.UUID, userID uuid.UUID) []domain.Achievement {
	all, err := u.achievements.ListAll(ctx)
	if err != nil {
		slog.Error("achievement list failed", "err", err)
		return nil
	}

	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		slog.Error("achievement char lookup failed", "err", err)
		return nil
	}

	streak, err := u.streaks.Get(ctx, userID)
	if err != nil {
		slog.Error("achievement streak lookup failed", "err", err)
		return nil
	}

	activityCount, err := u.activities.CountByCharacter(ctx, characterID)
	if err != nil {
		slog.Error("achievement activity count failed", "err", err)
		return nil
	}

	bookwormCount, err := u.activities.CountByCharacterAndStatName(ctx, characterID, "Начитанность")
	if err != nil {
		slog.Error("achievement bookworm count failed", "err", err)
		return nil
	}

	var unlocked []domain.Achievement
	for _, a := range all {
		already, err := u.achievements.IsUnlocked(ctx, userID, a.ID)
		if err != nil || already {
			continue
		}

		if u.qualifies(a.Code, char, streak, activityCount, bookwormCount) {
			if err := u.achievements.Unlock(ctx, userID, a.ID); err != nil {
				slog.Error("unlock achievement failed", "code", a.Code, "err", err)
				continue
			}
			unlocked = append(unlocked, a)
		}
	}

	return unlocked
}

func (u *AchievementUsecase) qualifies(
	code string,
	char *domain.Character,
	streak *domain.Streak,
	activityCount, bookwormCount int,
) bool {
	switch code {
	case "first_blood":
		return activityCount >= 1
	case "on_fire":
		return streak.Current >= 7
	case "centurion":
		return activityCount >= 100
	case "level_10":
		return char.Level >= 10
	case "bookworm":
		return bookwormCount >= 20
	}
	return false
}
