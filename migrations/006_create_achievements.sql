CREATE TABLE achievements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    icon        TEXT NOT NULL
);

CREATE TABLE user_achievements (
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id),
    unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(user_id, achievement_id)
);

INSERT INTO achievements (id, code, title, description, icon) VALUES
  (gen_random_uuid(), 'first_blood', 'First Blood',  'Залогировал первую активность',        '🩸'),
  (gen_random_uuid(), 'on_fire',     'On Fire',       'Streak 7 дней подряд',                 '🔥'),
  (gen_random_uuid(), 'centurion',   'Centurion',     '100 активностей залогировано',          '⚔️'),
  (gen_random_uuid(), 'level_10',    'Level X',       'Достиг 10 уровня персонажа',           '✨'),
  (gen_random_uuid(), 'bookworm',    'Bookworm',      '20 активностей в стате Начитанность',  '📚');
