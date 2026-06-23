CREATE TABLE stats (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id    UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    icon            TEXT NOT NULL DEFAULT '⚡',
    frequency_days  INT NOT NULL DEFAULT 1,
    stat_xp         BIGINT NOT NULL DEFAULT 0,
    stat_level      INT NOT NULL DEFAULT 1,
    stat_streak     INT NOT NULL DEFAULT 0,
    longest_streak  INT NOT NULL DEFAULT 0,
    last_period_end DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(character_id, name)
);
