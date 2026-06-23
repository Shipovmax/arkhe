package domain

import (
	"time"

	"github.com/google/uuid"
)

// CharacterClass represents the user's chosen archetype.
type CharacterClass string

const (
	ClassStudent   CharacterClass = "student"
	ClassWorker    CharacterClass = "worker"
	ClassSchoolkid CharacterClass = "schoolkid"
)

// Character is the RPG persona attached to a user.
type Character struct {
	ID          uuid.UUID      `json:"id"`
	UserID      uuid.UUID      `json:"user_id"`
	DisplayName string         `json:"display_name"`
	Class       CharacterClass `json:"class"`
	Level       int            `json:"level"`
	TotalXP     int64          `json:"total_xp"`
	CreatedAt   time.Time      `json:"created_at"`
}

// XPRequired returns cumulative XP needed to reach the given level.
// Formula: 100 * (n³ + 11n − 12) / 6  →  3 acts to Lv2, 5 to Lv3, 8 to Lv4, 12 to Lv5
func XPRequired(level int) int64 {
	return int64(100 * (level*level*level + 11*level - 12) / 6)
}

// LevelFromXP derives current level from accumulated XP.
func LevelFromXP(totalXP int64) int {
	level := 1
	for XPRequired(level+1) <= totalXP {
		level++
	}
	return level
}

// XPToNextLevel returns XP remaining until the next level.
func XPToNextLevel(totalXP int64) int64 {
	current := LevelFromXP(totalXP)
	return XPRequired(current+1) - totalXP
}

// LevelFromStats derives character level as floor of average stat level.
func LevelFromStats(statLevels []int) int {
	if len(statLevels) == 0 {
		return 1
	}
	sum := 0
	for _, l := range statLevels {
		sum += l
	}
	return sum / len(statLevels)
}
