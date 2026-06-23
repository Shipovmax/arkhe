CREATE TABLE activities (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
    stat_id      UUID NOT NULL REFERENCES stats(id),
    description  TEXT NOT NULL,
    xp_earned    INT NOT NULL,
    logged_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_character_logged ON activities(character_id, logged_at DESC);
