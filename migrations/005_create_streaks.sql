CREATE TABLE streaks (
    user_id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current          INT NOT NULL DEFAULT 0,
    longest          INT NOT NULL DEFAULT 0,
    last_active_date DATE
);
