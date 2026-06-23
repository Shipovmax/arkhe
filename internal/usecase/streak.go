package usecase

import (
	"context"
	"time"

	"arkhe/internal/domain"
	"arkhe/internal/port"

	"github.com/google/uuid"
)

// StreakUsecase handles global and per-stat streak updates.
type StreakUsecase struct {
	streaks port.StreakRepository
	stats   port.StatRepository
}

// NewStreakUsecase creates a new StreakUsecase.
func NewStreakUsecase(streaks port.StreakRepository, stats port.StatRepository) *StreakUsecase {
	return &StreakUsecase{streaks: streaks, stats: stats}
}

// UpdateGlobal updates the daily global streak for a user.
// Returns true if this is the first log today (used for bonus XP decision).
func (u *StreakUsecase) UpdateGlobal(ctx context.Context, userID uuid.UUID) (bool, error) {
	streak, err := u.streaks.Get(ctx, userID)
	if err != nil {
		return false, err
	}

	today := time.Now().UTC().Truncate(24 * time.Hour)

	if streak.LastActiveDate != nil {
		last := streak.LastActiveDate.UTC().Truncate(24 * time.Hour)
		if last.Equal(today) {
			return false, nil
		}
		yesterday := today.AddDate(0, 0, -1)
		if last.Equal(yesterday) {
			streak.Current++
		} else {
			streak.Current = 1
		}
	} else {
		streak.Current = 1
	}

	if streak.Current > streak.Longest {
		streak.Longest = streak.Current
	}
	streak.LastActiveDate = &today

	return true, u.streaks.Upsert(ctx, streak)
}

// UpdateStatStreak updates the per-stat streak and returns whether the log
// landed in the first half of the frequency window (for XP frequency bonus).
func (u *StreakUsecase) UpdateStatStreak(ctx context.Context, stat *domain.Stat) (loggedInFirstHalf bool, streakBroke bool, err error) {
	today := time.Now().UTC().Truncate(24 * time.Hour)

	if stat.LastPeriodEnd == nil {
		// First log ever for this stat
		periodEnd := today.AddDate(0, 0, stat.FrequencyDays)
		stat.LastPeriodEnd = &periodEnd
		stat.StatStreak = 1
		stat.LongestStreak = 1
		return true, false, nil
	}

	periodEnd := stat.LastPeriodEnd.UTC().Truncate(24 * time.Hour)

	if today.Before(periodEnd) {
		// Still inside the current period — already counted, no streak change
		halfPoint := periodEnd.AddDate(0, 0, -stat.FrequencyDays/2)
		return today.Before(halfPoint) || today.Equal(halfPoint), false, nil
	}

	nextPeriodEnd := periodEnd.AddDate(0, 0, stat.FrequencyDays)
	if today.Before(nextPeriodEnd) || today.Equal(nextPeriodEnd) {
		// Logged within the next valid window — streak continues
		stat.StatStreak++
		streakBroke = false
	} else {
		// Missed at least one full period
		stat.StatStreak = 1
		streakBroke = true
	}

	if stat.StatStreak > stat.LongestStreak {
		stat.LongestStreak = stat.StatStreak
	}
	stat.LastPeriodEnd = &nextPeriodEnd

	halfPoint := nextPeriodEnd.AddDate(0, 0, -(stat.FrequencyDays / 2))
	loggedInFirstHalf = today.Before(halfPoint) || today.Equal(halfPoint)

	return loggedInFirstHalf, streakBroke, nil
}
