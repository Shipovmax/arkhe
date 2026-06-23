CREATE TYPE character_class AS ENUM ('student', 'worker', 'schoolkid');

CREATE TABLE characters (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    class        character_class NOT NULL,
    level        INT NOT NULL DEFAULT 1,
    total_xp     BIGINT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);
