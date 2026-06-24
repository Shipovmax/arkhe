package usecase

import (
	"context"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
)

// ActivityUsecase handles activity logging and XP calculation.
type ActivityUsecase struct {
	activities   port.ActivityRepository
	stats        port.StatRepository
	characters   port.CharacterRepository
	streakUC     *StreakUsecase
	achievementUC *AchievementUsecase
}

// NewActivityUsecase creates a new ActivityUsecase.
func NewActivityUsecase(
	activities port.ActivityRepository,
	stats port.StatRepository,
	characters port.CharacterRepository,
	streakUC *StreakUsecase,
	achievementUC *AchievementUsecase,
) *ActivityUsecase {
	return &ActivityUsecase{
		activities:    activities,
		stats:         stats,
		characters:    characters,
		streakUC:      streakUC,
		achievementUC: achievementUC,
	}
}

// LogInput holds data for logging a new activity.
type LogInput struct {
	UserID      uuid.UUID
	StatID      uuid.UUID
	Description string
}

// LogResult contains the full outcome of logging an activity.
type LogResult struct {
	Activity             *domain.Activity       `json:"activity"`
	XPEarned             int                    `json:"xp_earned"`
	StatXP               int64                  `json:"stat_xp"`
	StatLevel            int                    `json:"stat_level"`
	StatLevelUp          bool                   `json:"stat_level_up"`
	CharacterLevel       int                    `json:"character_level"`
	CharacterLevelUp     bool                   `json:"character_level_up"`
	StatStreak           int                    `json:"stat_streak"`
	GlobalStreak         int                    `json:"global_streak"`
	AchievementsUnlocked []domain.Achievement   `json:"achievements_unlocked"`
}

// Log records an activity, calculates XP, updates streaks and character level.
func (u *ActivityUsecase) Log(ctx context.Context, in LogInput) (*LogResult, error) {
	char, err := u.characters.GetByUserID(ctx, in.UserID)
	if err != nil {
		return nil, err
	}

	stat, err := u.stats.GetByID(ctx, in.StatID)
	if err != nil {
		return nil, err
	}
	if stat.CharacterID != char.ID {
		return nil, domain.ErrForbidden
	}

	// Prevent logging more than once per period
	today := time.Now().UTC().Truncate(24 * time.Hour)
	periodStart := today.AddDate(0, 0, -(stat.FrequencyDays - 1))
	alreadyLogged, err := u.activities.HasRecentActivity(ctx, stat.ID, periodStart)
	if err != nil {
		return nil, err
	}
	if alreadyLogged {
		return nil, domain.ErrTooSoon
	}

	// Update per-stat streak and determine XP multipliers
	loggedInFirstHalf, streakBroke, err := u.streakUC.UpdateStatStreak(ctx, stat)
	if err != nil {
		return nil, err
	}
	_ = streakBroke // notification hook — email worker handles separately

	xp := domain.CalcXP(stat.StatStreak, loggedInFirstHalf)

	prevStatLevel := stat.StatLevel
	stat.StatXP += int64(xp)
	stat.StatLevel = domain.LevelFromXP(stat.StatXP)
	statLevelUp := stat.StatLevel > prevStatLevel

	if err := u.stats.Update(ctx, stat); err != nil {
		return nil, err
	}

	// Recalculate character level from all stat levels
	allStats, err := u.stats.ListByCharacter(ctx, char.ID)
	if err != nil {
		return nil, err
	}
	statLevels := make([]int, len(allStats))
	var totalXP int64
	for i, s := range allStats {
		statLevels[i] = s.StatLevel
		totalXP += s.StatXP
	}

	prevCharLevel := char.Level
	char.TotalXP = totalXP
	char.Level = domain.LevelFromXP(totalXP)
	charLevelUp := char.Level > prevCharLevel

	if err := u.characters.Update(ctx, char); err != nil {
		return nil, err
	}

	// Record the activity
	activity := &domain.Activity{
		ID:          uuid.New(),
		CharacterID: char.ID,
		StatID:      stat.ID,
		StatName:    stat.Name,
		StatIcon:    stat.Icon,
		Description: in.Description,
		XPEarned:    xp,
		LoggedAt:    time.Now().UTC(),
	}
	if err := u.activities.Create(ctx, activity); err != nil {
		return nil, err
	}

	// Update global streak
	_, err = u.streakUC.UpdateGlobal(ctx, in.UserID)
	if err != nil {
		return nil, err
	}

	globalStreak, err := u.streakUC.streaks.Get(ctx, in.UserID)
	if err != nil {
		return nil, err
	}

	// Check achievements asynchronously
	var unlocked []domain.Achievement
	done := make(chan []domain.Achievement, 1)
	go func() {
		done <- u.achievementUC.Check(context.Background(), char.ID, in.UserID)
	}()
	select {
	case unlocked = <-done:
	case <-ctx.Done():
	}

	return &LogResult{
		Activity:             activity,
		XPEarned:             xp,
		StatXP:               stat.StatXP,
		StatLevel:            stat.StatLevel,
		StatLevelUp:          statLevelUp,
		CharacterLevel:       char.Level,
		CharacterLevelUp:     charLevelUp,
		StatStreak:           stat.StatStreak,
		GlobalStreak:         globalStreak.Current,
		AchievementsUnlocked: unlocked,
	}, nil
}

// List returns paginated activities for the user's character.
func (u *ActivityUsecase) List(ctx context.Context, userID uuid.UUID, limit, offset int) ([]domain.Activity, error) {
	char, err := u.characters.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	return u.activities.ListByCharacter(ctx, char.ID, limit, offset)
}
