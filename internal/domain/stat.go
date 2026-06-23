package domain

import (
	"math"
	"time"

	"github.com/google/uuid"
)

// Stat is a skill/attribute tracked per character.
type Stat struct {
	ID            uuid.UUID  `json:"id"`
	CharacterID   uuid.UUID  `json:"character_id"`
	Name          string     `json:"name"`
	Icon          string     `json:"icon"`
	FrequencyDays int        `json:"frequency_days"`
	StatXP        int64      `json:"stat_xp"`
	StatLevel     int        `json:"stat_level"`
	StatStreak    int        `json:"stat_streak"`
	LongestStreak int        `json:"longest_streak"`
	LastPeriodEnd *time.Time `json:"last_period_end"`
	CreatedAt     time.Time  `json:"created_at"`
}

// CalcXP returns XP earned for a single activity log against this stat.
func CalcXP(statStreak int, loggedInFirstHalf bool) int {
	base := 100.0

	var streakMult float64
	switch {
	case statStreak >= 14:
		streakMult = 2.0
	case statStreak >= 7:
		streakMult = 1.5
	case statStreak >= 3:
		streakMult = 1.25
	default:
		streakMult = 1.0
	}

	freqBonus := 1.0
	if loggedInFirstHalf {
		freqBonus = 1.1
	}

	return int(math.Round(base * streakMult * freqBonus))
}
