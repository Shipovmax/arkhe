INSERT INTO achievements (id, code, title, description, icon) VALUES
  (gen_random_uuid(), 'streak_3',      'On a Roll',      'Держишь стрик 3 дня подряд',          '🌡️'),
  (gen_random_uuid(), 'streak_14',     'Unstoppable',    'Стрик 14 дней — ты машина',            '⚡'),
  (gen_random_uuid(), 'streak_30',     'Legendary',      '30 дней непрерывного стрика',          '👑'),
  (gen_random_uuid(), 'activities_10', 'Warming Up',     '10 активностей залогировано',          '🏃'),
  (gen_random_uuid(), 'activities_50', 'Dedicated',      '50 активностей — ты серьёзен',         '🎖️'),
  (gen_random_uuid(), 'level_5',       'Rising Star',    'Достиг 5 уровня персонажа',            '🌟'),
  (gen_random_uuid(), 'night_owl',     'Night Owl',      'Залогировал активность после полуночи','🦉'),
  (gen_random_uuid(), 'early_bird',    'Early Bird',     'Залогировал активность до 7 утра',     '🐦')
ON CONFLICT (code) DO NOTHING;
